import React, {useEffect} from "react";
import { connect } from "react-redux";
import { Space, Table, Spin, message, Tooltip } from "antd";
import { EditFilled, StopOutlined, UserOutlined } from "@ant-design/icons";
import ContentForm from "../../components/ContentForm";
import {
  getUsers,
  activateUser,
  blockUser,
  PROPS_TRANSLATION_MAPPINGS
} from "../../appRedux/actions/Users";
import "./userAdministration.less";
import "../../styles/layout/tablePaginationComponentStyles.less";
import blockUserImage from "../../assets/images/block-24px.png";
import unblockUserImage from "../../assets/images/unblock.png";
import editUserImage from "../../assets/images/edit.png";
import { useFormatMessage } from 'react-intl-hooks';
import translate from '../../util/translate';

const UserAdministration = (props) => {
  const { activateUser, blockUser } = props;
  const t = useFormatMessage();

  useEffect(() => {
    props.getUsers();
  }, []);

  const handleAction = user => {
    if (user.statusName === t({id:PROPS_TRANSLATION_MAPPINGS["Active"]})) {
      blockUser(user.id);
    } else {
      activateUser(user.id);
    }
  };

  const columns = [
    { title: t({id: 'app.users.list.name'}), dataIndex: "fullName", width: 200 },
    { title: t({id: 'app.users.list.email'}), dataIndex: "email" },
    { title: t({id: 'app.users.list.group_name'}), dataIndex: "roleName" },
    { title: t({id: 'app.users.list.status'}), dataIndex: "statusName" },
    {
      title: t({id: 'app.users.list.actions'}),
      key: "operation",
      width: 100,
      render: item => (
        <Space size="middle" style={{ fontSize: "24px" }}>
          <Tooltip title={t({id: 'app.users.list.edit_user'})}>
            <img
              src={editUserImage}
              style={{
                cursor: "pointer",
                marginRight: "10px",
                color: item.isModifying ? "grey" : "#005c81"
              }}
              onClick={() =>
                props.history.push(`/users/${item.id}/edit`)
              }
              disabled={item.isModifying}
            />
          </Tooltip>

          {item.statusName === t({id:PROPS_TRANSLATION_MAPPINGS["Active"]}) ? (
            <Tooltip title={t({id: 'app.users.list.block_user'})}>
              <img
                src={blockUserImage}
                style={{
                  cursor: "pointer",
                  color: item.isModifying ? "grey" : "#005c81"
                }}
                onClick={() => handleAction(item)}
                disabled={item.isModifying}
              />
            </Tooltip>
          ) : (
            <Tooltip title={t({id: 'app.users.list.activate_user'})}>
              <img
                src={unblockUserImage}
                style={{
                  cursor: "pointer",
                  color: item.isModifying ? "grey" : "#005c81"
                }}
                onClick={() => handleAction(item)}
                disabled={item.isModifying}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];
  return (
    <ContentForm
      title={t({id: 'app.users.list.users_list'})}
      buttonLabel={`+ ${t({id: 'app.users.list.create_user'})}`}
      onClick={() => props.history.push("/users/create")}
    >
      <Table
        rowKey={record => record.id}
        className="cultbay-table"
        columns={columns}
        dataSource={props.translatedUserProps}
        loading={props.users.getUsersLoading}
        pagination={{ position: ["bottomLeft"] }}
        locale={{
          filterConfirm: t({id: 'app.common.ok'}),
          filterReset: t({id: 'app.common.reset'}),
          emptyText: t({id: 'app.common.no_data'})
        }}
      />
    </ContentForm>
  );
}

const getTranslatedResult = (users) => users.map(user => ({
  ...user,
  'roleName': translate(PROPS_TRANSLATION_MAPPINGS[user.roleName]) || user.roleName,
  'statusName': translate(PROPS_TRANSLATION_MAPPINGS[user.statusName]) || user.statusName,
}));

const mapStateToProps = ({users}) => ({
  users: users,
  translatedUserProps: getTranslatedResult(users.users || [])
});

const mapDispatchToProps = {
  getUsers,
  activateUser,
  blockUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAdministration);
