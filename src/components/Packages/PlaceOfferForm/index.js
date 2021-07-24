import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  DatePicker,
  TimePicker,
} from "antd";

import ClockOutline from '@2fd/ant-design-icons/lib/ClockOutline';
import { useForm } from "antd/lib/form/Form";

import arrowDown from "assets/images/arrow-down-black.png";

import { BOOLEAN_OPTIONS, TYPE_OFFER, AUCTION_DURATION } from 'mocks/Packages'

import { minNumberValidator } from 'util/Validators'
import { useFormatMessage } from 'react-intl-hooks';
import { DecimalInputField } from '../../Fields'

// import "../../styles/layout/formStyles.less";
import "./index.less";

const { Option } = Select;

const PlaceOfferForm = (props) => {
  const { history, handleSubmit, loading, currency, packageDetails } = props;

  const [form] = useForm();
  const t = useFormatMessage();

  return (
    <Form
      name="basic"
      className="cultbay-form place-offer-form"
      form={form}
      onFinish={handleSubmit}
    >
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.place_offer.type_of_offer'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="typeOfOffer"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Select
              // disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              getPopupContainer={trigger => trigger.parentNode}
              suffixIcon={<img src={arrowDown} />}
            >
              {TYPE_OFFER && TYPE_OFFER.length > 0 ? (
                TYPE_OFFER.map(({id, value }) => (
                  <Option key={id} value={id}>
                    {t({id: value})}
                  </Option>
                ))
              ) : (
                <Option>{t({id: 'app.packages.place_offer.no_offer_to_select'})}</Option>
              )}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Form.Item
          shouldUpdate={(prevValues, currentValues) => prevValues.typeOfOffer !== currentValues.typeOfOffer}
          noStyle
        >
          {({ getFieldValue }) => {
            return getFieldValue('typeOfOffer') !== TYPE_OFFER[1].id ? (
              <Col span={12}>
                <Form.Item
                  gutter={30}
                  labelCol={{ span: 24 }}
                  name="fixedPrice"
                  shouldUpdate={(prevValues, currentValues) => {
                    return currentValues === 0
                  }}
                  label={
                    <span>
                      {t({id: 'app.packages.place_offer.fixed_price'})}<span className="required-star">*</span>:
                    </span>
                  }
                  rules={
                    [
                      {
                        message: t({id: 'app.common.field_is_required'}),
                        validator: minNumberValidator(0)
                      }
                    ]
                  }
                  validateTrigger={["onBlur"]}
                >
                  <DecimalInputField addonAfter={currency} />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
        <Form.Item
          shouldUpdate={(prevValues, currentValues) => prevValues.typeOfOffer !== currentValues.typeOfOffer}
          noStyle
        >
          {({ getFieldValue }) => {
            return getFieldValue('typeOfOffer') !== TYPE_OFFER[2].id ? (
              <Col span={12}>
                <Form.Item
                  gutter={30}
                  labelCol={{ span: 24 }}
                  name="auctionPrice"
                  shouldUpdate={(prevValues, currentValues) => {
                    return currentValues === 0
                  }}
                  label={
                    <span>
                      {t({id: 'app.packages.place_offer.auction_start_price'})}<span className="required-star">*</span>:
                    </span>
                  }
                  rules={
                    [
                      {
                        message: t({id: 'app.common.field_is_required'}),
                        validator: minNumberValidator(0)
                      }
                    ]
                  }
                  validateTrigger={["onBlur"]}
                >
                  <DecimalInputField addonAfter={currency} />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) => prevValues.typeOfOffer !== currentValues.typeOfOffer}
        noStyle
      >
        {({ getFieldValue }) => {
          return getFieldValue('typeOfOffer') !== TYPE_OFFER[2].id ? (
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  gutter={30}
                  label={
                    <span>
                      {t({id: 'app.packages.place_offer.duration'})}<span className="required-star">*</span>:
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  name="auctionDuration"
                  rules={[
                    {
                      required: true,
                      message: t({id: 'app.common.field_is_required'})
                    }
                  ]}
                >
                  <Select
                    // disabled={isEdit}
                    placeholder={t({id: 'app.common.select'})}
                    getPopupContainer={trigger => trigger.parentNode}
                    suffixIcon={<img src={arrowDown} />}
                  >
                    {AUCTION_DURATION && AUCTION_DURATION.length > 0 ? (
                      AUCTION_DURATION.map(({ id, value }) => (
                        <Option key={id} value={id}>
                          {t({id: value})}
                        </Option>
                      ))
                    ) : (
                      <Option>{t({id: 'app.packages.place_offer.no_duration'})}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  gutter={30}
                  label={
                    <span>
                      {t({id: 'app.packages.place_offer.repeat'})}<span className="required-star">*</span>:
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  name="offerRepeat"
                  rules={[
                    {
                      required: true,
                      message: t({id: 'app.common.field_is_required'})
                    }
                  ]}
                >
                  <Select
                    // disabled={isEdit}
                    placeholder={t({id: 'app.common.select'})}
                    getPopupContainer={trigger => trigger.parentNode}
                    suffixIcon={<img src={arrowDown} />}
                  >
                    {BOOLEAN_OPTIONS && BOOLEAN_OPTIONS.length > 0 ? (
                      BOOLEAN_OPTIONS.map(({ id, value }) => (
                        <Option key={id} value={id}>
                          {t({id: value})}
                        </Option>
                      ))
                    ) : (
                      <Option>{t({id: 'app.packages.place_offer.no_options'})}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.place_offer.offer_start_date'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="startDate"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <DatePicker
              disabledDate={dateStart => {
                if (dateStart < moment().subtract(1, "d")) {
                  return true;
                }

                return false;
              }}
              date
              size="large"
              placeholder={t({id: 'app.packages.place_offer.offer_start_date_placeholder'})}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.place_offer.offer_start_time'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="startTime"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <TimePicker
              size="large"
              suffixIcon={<div className="place-offer__time-addon"><ClockOutline className="place-offer__time-clock" /><div className="ant-input-group-addon"><div>GMT</div></div></div>}
              className="place-offer__time"
              popupClassName="place-offer__time-popup"
              placeholder={t({id: 'app.packages.place_offer.offer_start_time_placeholder'})}
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
            {t({id: 'app.common.submit'})}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const mapStateToProps = ({ packages }) => {
  const { currency, timeZone, packageDetails, loading } = packages;

  return { currency, timeZone, packageDetails, loading };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOfferForm);
