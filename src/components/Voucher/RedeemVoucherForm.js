import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  message,
  DatePicker,
} from "antd";
import { useFormatMessage } from 'react-intl-hooks';

import "../../styles/layout/formStyles.less";
import "./redeemVoucherForm.less";
import { useForm } from "antd/lib/form/Form";

function RedeemVoucherForm(props) {
  const { history, handleSubmit, loading } = props;

  const [form] = useForm();
  const t = useFormatMessage();

  return (
    <Form
      name="basic"
      className="cultbay-form redeem-voucher-form"
      form={form}
      onFinish={handleSubmit}
    >
      <Row gutter={30}>
        <Col span={24}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.vouchers.redemption.traveller_name'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="travellerName"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'}),
              },
              {
                max: 255,
                message: t({id: 'app.common.max_characters_allowed'}, {length: 255}),
              },
              {
                whitespace: true,
                message: t({id: 'app.common.field_is_required'}),
              },
            ]}
          >
            <Input placeholder={t({id: 'app.vouchers.redemption.traveller_name'})} size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.vouchers.redemption.date_start'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="dateStart"
            placeholder={t({id: 'app.vouchers.redemption.date_start'})}
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'}),
              },
            ]}
            dependencies={["dateEnd"]}
          >
            <DatePicker
              placeholder={t({id: 'app.vouchers.redemption.date_start'})}
              disabledDate={(dateStart) => {
                const dateEnd = form.getFieldValue("dateEnd");
                if (dateStart < moment().subtract(1, "d")) {
                  return true;
                }
                if (dateEnd) {
                  return dateEnd < moment(dateStart).add(1, "d");
                }
                return false;
              }}
              date
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.vouchers.redemption.date_end'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="dateEnd"
            placeholder={t({id: 'app.vouchers.redemption.date_end'})}
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'}),
              },
            ]}
            dependencies={["dateStart"]}
          >
            <DatePicker
              placeholder={t({id: 'app.vouchers.redemption.date_end'})}
              disabledDate={(dateEnd) => {
                const dateStart = form.getFieldValue("dateStart");
                if (dateEnd < moment().subtract(1, "d")) {
                  return true;
                }
                if (dateStart) {
                  return dateEnd < moment(dateStart).add(1, "d");
                }
                return false;
              }}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30]} justify="space-between" style={{ marginTop: "70px" }}>
        <Col>
          <Button
            className="content-form__button"
            type="link"
            onClick={() => history.goBack()}
          >
            {t({id: 'app.common.back'})}
          </Button>
        </Col>
        <Col>
          <Button
            className="content-form__button"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {t({id: 'app.vouchers.redemption.redeem'})}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const mapStateToProps = (state) => ({
  loading: state.voucher.redeemVoucherForm.loading,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RedeemVoucherForm);
