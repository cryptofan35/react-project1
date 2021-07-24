import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import {
  createUser,
  editUser,
  getUserById,
  getUserFormData
} from "../../appRedux/actions/Users";
import { Row, Col, Form, Input, Select, Button, message, Empty } from "antd";
import ContentForm from "../../components/ContentForm";
import UserForm from "../../components/UserForm";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import FullPageLoader from "../../components/FullPageLoader";
import FullPageError from "../../components/FullPageError";
import { useFormatMessage } from 'react-intl-hooks';
const { Option } = Select;

function EditUser(props) {
  const {
    history,
    editUserState: {
      loadingGetUserById,
      loadingEdit,
      getUserByIdError,
      editError,
      user
    }
  } = props;
  const t = useFormatMessage();

  useLayoutEffect(() => {
    props.getUserById(props.match.params.id);
    props.getUserFormData();
  }, []);

  function onFinish(values) {
    props.editUser(user.id, values);
  }

  if (getUserByIdError) {
    if (getUserByIdError.status === 404) {
      return (
        <FullPageError
          contentFormTitle={t({id: 'app.users.list.edit_user'})}
          text={<span>{t({id: 'app.users.form.user_not_found'})}</span>}
        />
      );
    }
    return (
      <FullPageError
        contentFormTitle={t({id: 'app.users.list.edit_user'})}
        text={<span>{t({id: 'app.users.form.user_error'})}</span>}
      />
    );
  }

  if (loadingGetUserById) {
    return <FullPageLoader size="3rem" contentFormTitle={t({id: 'app.users.list.edit_user'})} />;
  }

  return (
    <ContentForm title={t({id: 'app.users.list.edit_user'})}>
      <UserForm
        isEdit
        user={user}
        onSubmit={onFinish}
        isLoading={loadingEdit}
      />
    </ContentForm>
  );
}

const mapStateToProps = state => ({
  editUserState: state.users.editUser
});

const mapDispatchToProps = { getUserById, getUserFormData, editUser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(EditUser);
