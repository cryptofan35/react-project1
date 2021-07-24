import React, { useLayoutEffect, useEffect, useState } from "react";
import { Space, Tooltip, Table, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import ContentForm from "../../components/ContentForm";

import "../../styles/layout/tablePaginationComponentStyles.less";
import "./objectAdministration.less";
import deleteImage from "../../assets/images/delete.png";

import { connect } from "react-redux";
import { deleteProperty, getUserProperties } from "../../appRedux/actions";
import DeleteModal from "../../components/DeleteModal";
import { useFormatMessage } from 'react-intl-hooks';
import roleNames from "util/roleNames";
import { OFFER_TYPES } from "constants/Ebay/offers";


function ObjectAdministration(props) {
  const { userProperties, getUserProperties, deleteProperty, history, roleName } = props;
  const [propertyToDeleteId, setPropertyToDeleteId] = useState(null);
  const t = useFormatMessage();

  useLayoutEffect(() => {
    getUserProperties(true, OFFER_TYPES.running);
  }, []);

  const columns = [
    {
      title: t({id: 'app.properties.list.id'}),
      dataIndex: "id"
    },
    {
      title: t({id: 'app.properties.list.name'}),
      dataIndex: "name",
      width: 250
    },
    {
      title: t({id: 'app.properties.list.country'}),
      dataIndex: "country"
    },
    { 
      title: t({id: 'app.properties.list.city'}), 
      dataIndex: "city" 
    },
    {
      title: t({id: 'app.properties.list.street'}),
      dataIndex: "street"
    },
    {
      title: t({id: 'app.properties.list.created_at'}),
      render: ({ created_at }) => (
        <span>{moment(created_at).format("DD.MM.YYYY")}</span>
      ),
      width: 150
    },
    {
      key: "operation",
      width: 25,
      render: item => {
        if (roleName !== roleNames.ADMIN) {
          return null;
        }
        if (item.offers && item.offers.length > 0) {
          return null;
        }
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {item.loadingDelete ? (
              <Tooltip title={t({id: 'app.properties.list.loading_delete'})}>
                <LoadingOutlined
                  style={{
                    marginRight: "10px",
                    color: "#005c81",
                    fontSize: 14
                  }}
                  spin
                />
              </Tooltip>
            ) : (
              <Tooltip title={t({id: 'app.common.delete'})}>
                <img
                  src={deleteImage}
                  style={{
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                  onClick={() => setPropertyToDeleteId(item.id)}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    }
  ];

  function handleDeleteObject() {
    deleteProperty(propertyToDeleteId);
    setPropertyToDeleteId(null);
  }

  return (
    <ContentForm
      title={t({id: 'app.properties.list.list_of_properties'})}
      buttonLabel={`+ ${t({id: 'app.properties.list.add_property'})}`}
      onClick={() => history.push("property/add")}
    >
      <Table
        className="cultbay-table objects-table "
        columns={columns}
        rowKey={record => record.id}
        pagination={{ position: ["bottomLeft"] }}
        dataSource={userProperties.data}
        loading={userProperties.loading}
        scroll={{ x: 720 }}
        locale={{
          filterConfirm: t({id: 'app.common.ok'}),
          filterReset: t({id: 'app.common.reset'}),
          emptyText: t({id: 'app.common.no_data'})
        }}
      />
      <DeleteModal
        title={t({id: 'app.properties.list.delete_property'})}
        isVisible={propertyToDeleteId}
        onCancel={() => setPropertyToDeleteId(null)}
        onDelete={() => handleDeleteObject()}
      />
    </ContentForm>
  );
}

const mapStateToProps = state => ({
  userProperties: state.property.userProperties,
  roleName: state.auth.user.role.name
});
const mapDispatchToProps = {
  deleteProperty,
  getUserProperties
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObjectAdministration);
