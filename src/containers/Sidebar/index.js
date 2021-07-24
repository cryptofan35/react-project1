import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import FormatListBulleted from "@2fd/ant-design-icons/lib/FormatListBulleted";
import { ebayMenuData, accountMenuData } from "../../constants/MenuData";
import hasAccess from "../../util/hasAccess";
import { useFormatMessage } from 'react-intl-hooks';
import "./index.less";
import { getRooms, getPackages } from "appRedux/actions";
import { getTotalOfferCount } from "appRedux/actions/Ebay";

const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill}
    className={props.class}
  ></svg>
);

const Marker = props => (
  <span className="marker"></span>
)

const MenuBar = props => {
  const { pathname, roleName, title, property, menuData } = props;
  const [openKeys, setOpenKeys] = useState("");
  const [selectedKeys, setSelectedKeys] = useState("");
  const t = useFormatMessage();

  useEffect(() => {
    const selectedKeys = pathname.substr(1);
    setSelectedKeys(selectedKeys);
    setOpenKeys(selectedKeys.split("/")[0]);
  }, [pathname]);

  const onOpenChange = keys => {
    if (keys[1]) {
      setOpenKeys(keys[1]);
    } else {
      setOpenKeys("");
    }
  };

  return (
    <>
      <div className="menubar-title">{title}</div>
      <div className="cb-sidebar-content menubar-content">
        <Menu
          mode="inline"
          openKeys={[openKeys]}
          selectedKeys={[selectedKeys]}
          style={{ width: 260, height: "100%" }}
          onOpenChange={onOpenChange}
          inlineIndent={30}
        >
          {menuData.map(item => {
            if (!hasAccess(item.allowedRoles, roleName)) {
              return null;
            }
            if (item.requires && !props[item.requires]) {
              return null;
            }
            if (!item.childs.length) {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.pathname}>{t({id: item.name})}</Link>
                  {item.hasMarker && item.hasMarker(props) && (
                    <Marker />
                  )}
                </Menu.Item>
              );
            }
            return (
              <SubMenu
                key={item.key}
                icon={(
                  <>
                  {item.icon}
                  {item.hasMarker && item.hasMarker(props) && (
                    <Marker />
                  )}
                  </>
                )}
                title={t({id: item.name})}
                overflowedIndicator={<FormatListBulleted />}
              >
                {item.childs.map(subItem => {
                  if (subItem.requires && !props[subItem.requires]) {
                    return null;
                  }
                  if (subItem.requiresCallback && ! subItem.requiresCallback(props)) {
                    return null;
                  }
                  return (
                    <Menu.Item key={subItem.key}>
                      <Link to={subItem.pathname}>{t({id: subItem.name})}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </div>
    </>
  );
}

const Sidebar = props => {
  const { pathname, roleName, property, propertyObjectId, rooms, getRooms, packages, getPackages, hasEbayToken, getTotalOfferCount, totalOfferCount } = props;
  const t = useFormatMessage();
  useEffect(() => {
    if (propertyObjectId) {
      getRooms(propertyObjectId);
      getPackages({objectId: propertyObjectId, errorLang: 'en', offset: 0, limit: 10})
      getTotalOfferCount();
    }
  }, [propertyObjectId])
  
  return (
    <Sider className="sidebar">
      <MenuBar 
        pathname={pathname} 
        roleName={roleName} 
        property={property} 
        propertyObjectId={propertyObjectId} 
        rooms={rooms}
        packages={packages}
        hasEbayToken={hasEbayToken}
        totalOfferCount={totalOfferCount}
        title={t({id: 'sidebar.ebay'})}
        menuData = {ebayMenuData(property)}
      />
      <MenuBar
        pathname={pathname} 
        roleName={roleName} 
        property={property} 
        propertyObjectId={propertyObjectId} 
        rooms={rooms}
        packages={packages}
        hasEbayToken={hasEbayToken}
        totalOfferCount={totalOfferCount}
        title={t({id: 'sidebar.account'})}
        menuData = {accountMenuData(property)}
      />
    </Sider>
  )
};

const mapStateToProps = ({
  settings,
  auth: {
    user: { role }
  },
  property,
  rooms,
  packages,
  ebay
}) => {
  const { pathname } = settings;
  return { 
    pathname, 
    roleName: role ? role.name : "", 
    property: property && property.property,
    propertyObjectId: property && property.property && property.property.objectId,
    rooms: rooms.rooms || [],
    packages: packages.packagesList || [],
    hasEbayToken: ebay.tokenStatus && ebay.tokenStatus.isTokenSet,
    totalOfferCount: ebay.totalOfferCount
  };
};

const mapDispatchToProps = {
  getRooms,
  getPackages,
  getTotalOfferCount
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
