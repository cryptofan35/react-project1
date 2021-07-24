import React, { Component, useEffect, useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import {
  createUser,
  getUserFormData,
  PROPS_TRANSLATION_MAPPINGS
} from "../../appRedux/actions/Users";
import { Row, Col, Form, Input, Select, Button, message } from "antd";

import "../../styles/layout/formStyles.less";
import "./styles.less";
import arrowDown from "../../assets/images/arrow-down-black.png";
import { useFormatMessage } from 'react-intl-hooks';
const { Option } = Select;

function UserForm(props) {
  const {
    isEdit,
    isLoading,
    onSubmit,
    roles,
    properties,
    languages,
    user,
    createUserError
  } = props;
  const [form] = Form.useForm();
  const [showNoProperty, setShowNoProperty] = useState(false);
  const t = useFormatMessage();

  useEffect(() => {
    if (createUserError && createUserError.status === 409) {
      form.setFields([
        { name: "email", errors: [t({id: 'app.users.form.email_already_used'})] }
      ]);
    }
  }, [createUserError]);

  useLayoutEffect(() => {
    if (user) {
      if (user.role.id === 3) {
        setShowNoProperty(false);
      } else {
        setShowNoProperty(true);
      }
    }
  }, []);

  function handleSubmit(values) {
    let { object } = values;
    const noPropertyIndex = object.indexOf(-1);
    if (noPropertyIndex >= 0) {
      object = object.filter(i => i !== -1);
    }
    values = {
      ...values,
      object
    };
    onSubmit(values);
  }

  function getFormsInitialValues() {
    if (!user) {
      return {
        remember: true
      };
    }
    const userProperties = user.properties.map(p => p.id);
    return {
      firstName: user.name,
      lastName: user.last_name,
      email: user.email,
      language: user.language.code,
      userGroup: user.role.id,
      object: userProperties
    };
  }

  function handleValuesChange({ userGroup }) {
    if (userGroup === 3) {
      setShowNoProperty(false);
      let userProperties = form.getFieldValue("object");
      if (!userProperties) {
        return;
      }
      const noPropertyIndex = userProperties.indexOf(-1);
      if (noPropertyIndex >= 0) {
        userProperties = userProperties.filter(i => i !== -1);
        form.setFields([{ name: "object", value: userProperties }]);
      }
    } else {
      setShowNoProperty(true);
    }
  }

  return (
    <Form
      name="basic"
      className="cultbay-form"
      form={form}
      onValuesChange={handleValuesChange}
      initialValues={getFormsInitialValues()}
      onFinish={handleSubmit}
    >
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.first_name'})}<span className="required-star">*</span>:
              </span>
            }
            requiredMark={null}
            labelCol={{ span: 24 }}
            name="firstName"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
              {
                min: 2,
                message: t({id: 'app.common.min_characters_allowed'}, {length: 2})
              },
              {
                pattern: new RegExp("^(?=[^A-Za-z]*[A-Za-z])[ -~]*$"),
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Input
              disabled={isEdit}
              placeholder={t({id: 'app.users.form.first_name'})}
              size="large"
              maxLength={40}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.last_name'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="lastName"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
              {
                min: 2,
                message: t({id: 'app.common.min_characters_allowed'}, {length: 2})
              },
              {
                pattern: new RegExp("^(?=[^A-Za-z]*[A-Za-z])[ -~]*$"),
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Input
              disabled={isEdit}
              placeholder={t({id: 'app.users.form.last_name'})}
              size="large"
              maxLength={40}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            labelCol={{ span: 24 }}
            label={
              <span>
                {t({id: 'app.users.form.email'})}{!isEdit && <span className="required-star">*</span>}:
              </span>
            }
            name="email"
            rules={
              !isEdit && [
                {
                  required: true,
                  message: t({id: 'app.common.field_is_required'})
                },
                {
                  pattern: new RegExp(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ),
                  message: t({id: 'app.common.wrong_email_format'}),
                  validateTrigger: "onBlur"
                }
              ]
            }
            validateTrigger={["onBlur", "onChange"]}
          >
            <Input
              disabled={isEdit}
              placeholder="example@email.com"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.language'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="language"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Select
              disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {languages && languages.length > 0 ? (
                languages.map(language => (
                  <Option key={language.id} value={language.code}>
                    {language.name}
                  </Option>
                ))
              ) : (
                <Option>{t({id: 'app.users.form.no_language_to_select'})}</Option>
              )}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.user_group'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="userGroup"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Select
              placeholder={t({id: 'app.common.select'})}
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {roles && roles.length > 0 ? (
                roles.map(role => (
                  <Option key={role.id} value={role.id}>
                    {t({id:PROPS_TRANSLATION_MAPPINGS[role.name]})}
                  </Option>
                ))
              ) : (
                <Option>{t({id: 'app.users.form.no_role_to_select'})}</Option>
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.object'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="object"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
            dependencies={["userGroup"]}
          >
            <Select
              placeholder={t({id: 'app.common.select'})}
              mode="multiple"
              showArrow
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {showNoProperty && (
                <Option key={-1} value={-1}>
                  {t({id: 'app.users.form.no_property'})}
                </Option>
              )}
              {properties &&
                properties.length > 0 &&
                properties.map(property => (
                  <Option key={property.id} value={property.id}>
                    {property.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.password'})}{!isEdit && <span className="required-star">*</span>}:
              </span>
            }
            labelCol={{ span: 24 }}
            name="password"
            rules={[
              {
                required: !isEdit,
                message: t({id: 'app.common.field_is_required'})
              },
              {
                pattern: new RegExp(
                  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                ),
                message: t({id: 'app.common.wrong_password_format'}),
                validateTrigger: "onBlur"
              }
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input type="password" placeholder={t({id: 'app.users.form.password'})} size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.users.form.repeat_password'})}
                {!isEdit && <span className="required-star">*</span>}:
              </span>
            }
            labelCol={{ span: 24 }}
            name="confirmPassword"
            rules={[
              {
                required: !isEdit,
                message: t({id: 'app.common.field_is_required'})
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (
                    isEdit &&
                    getFieldValue("password") &&
                    getFieldValue("password") !== value
                  ) {
                    return Promise.reject(t({id: 'app.users.form.passwords_do_not_match'}));
                  }

                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t({id: 'app.users.form.passwords_do_not_match'}));
                }
              })
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input type="password" placeholder={t({id: 'app.users.form.repeat_password'})} size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30]} justify="end" style={{ marginTop: "70px" }}>
        <Col>
          <Button
            className="content-form__button"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {isEdit ? t({id: 'app.common.save'}) : t({id: 'app.users.form.create'})}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const mapStateToProps = state => ({
  roles: state.users.formData.roles,
  properties: state.users.formData.properties,
  languages: state.users.formData.languages,
  createUserError: state.users.createUserError
});

const mapDispatchToProps = { createUser, getUserFormData };

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
