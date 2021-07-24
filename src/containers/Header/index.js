import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Menu, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userSignOut } from "../../appRedux/actions/Auth";

import Plus from "@2fd/ant-design-icons/lib/Plus";
import ChevronDown from "@2fd/ant-design-icons/lib/ChevronDown";
import { LoadingOutlined } from "@ant-design/icons";

import logo_img from "../../assets/images/header-logo.png";
import signout_img from "../../assets/images/logout.png";
import { setSelectedProperty, getUserProperties } from "../../appRedux/actions";
import CanAccess from "../../components/CanAccess";
import roleNames from "../../util/roleNames";
import { getEbaySettings, setInitialEbaySettings } from "appRedux/actions/Ebay";

const { Header } = Layout;

const Topbar = (props) => {
  const {
    property,
    roleName,
    userProperties,
    getUserProperties,
    setSelectedProperty,
    loadingSetUserProperty,
    loadingAddNewProperty,
    getEbaySettings,
    setInitialEbaySettings,
  } = props;

  const isLoading = loadingAddNewProperty || loadingSetUserProperty;
  const isGuestUser = roleName === roleNames.GUEST;
  
  useEffect(() => {
    getUserProperties();
  }, []);

  function renderContent() {
    if (!property || Object.keys(property).length == 0) {
      return (
        <Link to={"/property/add"}>
          <span
            style={{
              color: "#fff",
              border: "1px solid #FFFFFF",
              borderRadius: "4px",
              padding: "6px 7px",
            }}
          >
            <Plus style={{ fontSize: 15 }} />
            Add Property
          </span>
        </Link>
      );
    }

    return (
      <Dropdown
        overlay={propertyMenu}
        placement="bottomRight"
        trigger={["click"]}
        disabled={isLoading}
      >
        <div className="property-dropdown-link">
          <Spin
            spinning={isLoading}
            indicator={
              <LoadingOutlined style={{ fontSize: 16, color: "#fff" }} spin />
            }
            style={{ margin: "0 8px 0 0" }}
          />
          <span>{property.name}</span>
          <ChevronDown style={{ fontSize: 20 }} />
        </div>
      </Dropdown>
    );
  }

  const propertyMenu = () => {
    return (
      <Menu className="nav-menu property-select-dropdown">
        {userProperties && userProperties.map(({ id, name, objectId }) => (
          <Menu.Item key={id}>
            <a onClick={() => handlePropertyClick(id, objectId)}>{name}</a>
          </Menu.Item>
        ))}
        {!isGuestUser && (
          <Menu.Item key="-1">
            <Link to={"/property/add"}>
              <span>
                <Plus style={{ fontSize: 15 }} />
                Add Property
              </span>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const signOut = () => {
    props.userSignOut();
  };

  const handlePropertyClick = (id, objectId) => {
    setSelectedProperty(id);
    //get last info about ebay settings
    if (objectId) {
      getEbaySettings(objectId);
    } else {
      setInitialEbaySettings();
    }
  };

  return (
    <Header>
      <div className="logo">
        <img src={logo_img} alt="cultbay" />
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <div className="add-property"> {renderContent()} </div>
      <div className="signout" onClick={signOut}>
        <img src={signout_img} alt="signout" />
      </div>
    </Header>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    roleName: state.auth.user.role.name,
    property: state.property.property,
    loadingSetUserProperty: state.property.loadingSetUserProperty,
    loadingAddNewProperty: state.property.loadingAddNewProperty,
    userProperties: state.property.userProperties.data,
  };
};

const mapDispatchToProps = {
  setSelectedProperty,
  userSignOut,
  getEbaySettings,
  setInitialEbaySettings,
  getUserProperties
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
