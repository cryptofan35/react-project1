import React, { useState } from "react";
import { connect } from "react-redux";
import { createUser, getUserFormData } from "../../appRedux/actions/Users";
import {
  Row,
  Col,
  Form,
  Select,
  Upload,
  InputNumber,
  Button,
  Input,
} from "antd";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import Html5Outlined from "@ant-design/icons/Html5Outlined";

import "../../styles/layout/formStyles.less";
import arrowDown from "../../assets/images/arrow-down-black.png";
import showErrorMessage from "util/showErrorMessage";

const { Option } = Select;

const languageOptions = [
  {
    label: "German",
    id: 1,
  },
  {
    label: "English",
    id: 2,
  },
];

const templateTypeOptions = [
  {
    label: "Offer",
    id: "offer",
    active: true,
  },
  {
    label: "Email",
    id: "email",
    active: true,
  },
  {
    label: "Voucher",
    id: "voucher",
  },
];
const emailTypeOptions = [
  {
    label: "Encashment information for hotels (payment Information MAIL)",
    id: 30,
  },
  {
    label: "Highbidder confirmation of booking",
    id: 53,
  },
  {
    label: "Confirmation of booking email to hotelier",
    id: 56,
  },
  {
    label: "Payment confirmation email to the hotelier",
    id: 60,
  },
  {
    label: "Voucher email to the buyer",
    id: 68,
  },
  {
    label: "Cancellation Initiated email to the buyer",
    id: 75,
  },
  {
    label: "Cancellation Closed email to the buyer",
    id: 77,
  },
  {
    label: "Refund pending reminder email to the hotelier",
    id: 79,
  },
  {
    label: "Cancellation Initiation email to the hotelier",
    id: 81,
  },
  {
    label: "Cancellation closed email to the hotelier",
    id: 83,
  },
];

function UploadTemplateForm({ isLoading, onSubmit, form, match }) {
  function handleHtmlFileEvent({ file }) {
    const isHtml = file.type === "text/html";
    const isLt50M = file.size / 1024 / 1024 < 50;

    if (!isHtml) {
      showErrorMessage("You can only upload Html file!");
    }
    if (!isLt50M) {
      showErrorMessage("File must smaller than 50MB!");
    }
    if (!isHtml || !isLt50M) {
      return null;
    }
    return [file];
  }

  function beforeFileUpload(file) {
    return false;
  }

  function renderUploadInput({ getFieldValue }) {
    const file = getFieldValue("htmlFile");
    let fileName;

    if (file) {
      fileName = file[0].name;
    }
    return (
      <Form.Item
        gutter={30}
        label={
          <span>
            Choose file<span className="required-star">*</span>:
          </span>
        }
        labelCol={{ span: 24 }}
        name="htmlFile"
        rules={[
          {
            required: true,
            message: "This field is required",
          },
        ]}
        getValueFromEvent={handleHtmlFileEvent}
        valuePropName="fileList"
      >
        <Upload
          multiple={false}
          accept=".html"
          beforeUpload={beforeFileUpload}
          listType="text"
          showUploadList={false}
        >
          {fileName ? (
            <Button
              style={{ width: "100%", paddingBottom: "28px" }}
              icon={<Html5Outlined />}
            >
              {fileName}
            </Button>
          ) : (
            <Button
              style={{ width: "100%", paddingBottom: "28px" }}
              icon={<UploadOutlined />}
            >
              Upload Html File
            </Button>
          )}
        </Upload>
      </Form.Item>
    );
  }

  const renderEmailInput = ({ getFieldValue }) => {
    const emailTemplateValue = getFieldValue("templateType");
    const showOnlyForEmail = emailTemplateValue == "email";

    return (
      <>
        {showOnlyForEmail && (
          <Form.Item
            gutter={30}
            label={
              <span>
                Email type:<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="emailTypeId"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          >
            <Select
              placeholder="Select"
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {emailTypeOptions.map((temp) => (
                <Option key={temp.id} value={temp.id}>
                  {temp.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </>
    );
  };
  return (
    <Form name="basic" className="cultbay-form" form={form} onFinish={onSubmit}>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                Language<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="languageId"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          >
            <Select
              placeholder="Select"
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {languageOptions.map((lang) => (
                <Option key={lang.id} value={lang.id}>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                Select template type<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="templateType"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          >
            <Select
              placeholder="Select"
              allowClear
              suffixIcon={<img src={arrowDown} />}
            >
              {templateTypeOptions.map((temp) => (
                <Option key={temp.id} value={temp.id} disabled={!temp.active}>
                  {temp.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                Object Id<span className="required-star">*</span>:
              </span>
            }
            requiredMark={null}
            labelCol={{ span: 24 }}
            name="objectId"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
            ]}
          >
            <InputNumber
              placeholder="Object Id"
              size="large"
              type="number"
              maxLength={10}
              max={9999999}
              min={1}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.htmlFile !== currentValues.htmlFile
            }
          >
            {renderUploadInput}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.templateType !== currentValues.templateType
            }
          >
            {renderEmailInput}
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
            Upload
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default UploadTemplateForm;
