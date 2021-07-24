import React, {useEffect} from "react";
import { connect } from "react-redux";
import { createUser, getUserFormData } from "../../appRedux/actions/Users";
import { Row, Col, Form, Input, Select, Button, message } from "antd";
import ContentForm from "../../components/ContentForm";
import UserForm from "../../components/UserForm";
import { useFormatMessage } from 'react-intl-hooks';

const { Option } = Select;

const CreateUser = ({createUser, history, getUserFormData, loading}) => {
  const t = useFormatMessage();

  useEffect(() => {
    getUserFormData();
  }, []);

  const onFinish = values => {
    const { password, confirmPassword } = values;
    if (!(password == confirmPassword)) {
      message.warning("Passwords must be equal");
      return;
    }
    createUser(values, history);
  }

  return (
    <ContentForm title={t({id: 'app.users.list.create_user'})}>
      <UserForm onSubmit={onFinish} isLoading={loading} />
    </ContentForm>
  );
}

const mapStateToProps = state => ({
  loading: state.users.createUserLoading,
  error: state.users.createUserError
});

const mapDispatchToProps = { createUser, getUserFormData };

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
