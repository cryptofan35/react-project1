import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "components/Common/Page";
import { useFormatMessage } from "react-intl-hooks";
import AlertCircleOutline from "@2fd/ant-design-icons/lib/AlertCircleOutline";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SupportIcon from '../../../assets/svg/support.svg';
import FullServiceBadge from '../../../assets/svg/fullservice-badge.svg';
import moment from 'moment';

import "./styles.less";
import { Table } from 'antd';

const Plan = ({emailVerifiedAt}) => {
  const t = useFormatMessage();

  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const trialStart = moment(emailVerifiedAt);

    const trialEnd = trialStart.clone().add(30, 'days');
    const diff = trialEnd.diff(moment(), 'days') + 1;

    setDaysLeft(diff);
  }, []);

  const comparisonColumns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t({ id: "app.billingplan.plan.compare_headline_selfservice" }),
      dataIndex: 'selfservice',
      key: 'selfservice',
      width: '130px',
    },
    {
      title: <div className="fullservice-badge"><img src={FullServiceBadge} width="35" height="35" /><span>{t({ id: "app.billingplan.plan.advance_plan_fullservice" })}</span></div>,
      dataIndex: 'fullservice',
      key: 'fullservice',
      width: '130px',
    },
  ];

  const comparisonData = [
    {
      key: '1',
      name: t({ id: "app.billingplan.plan.compare_unlimited_ebay" }),
      selfservice: <CheckOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '2',
      name: t({ id: "app.billingplan.plan.compare_sync_channel" }),
      selfservice: <CheckOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '3',
      name: t({ id: "app.billingplan.plan.compare_availability" }),
      selfservice: <CheckOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '4',
      name: t({ id: "app.billingplan.plan.compare_support_accomodation" }),
      selfservice: <CloseOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '5',
      name: t({ id: "app.billingplan.plan.compare_support_offers" }),
      selfservice: <CloseOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '6',
      name: t({ id: "app.billingplan.plan.compare_support_ebay" }),
      selfservice: <CloseOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '7',
      name: t({ id: "app.billingplan.plan.compare_support_marketing" }),
      selfservice: <CloseOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '8',
      name: t({ id: "app.billingplan.plan.compare_fast_technical" }),
      selfservice: <CloseOutlined />,
      fullservice: <CheckOutlined />,
    },
    {
      key: '9',
      name: t({ id: "app.billingplan.plan.compare_technical_support" }),
      selfservice: <CheckOutlined />,
      fullservice: <CloseOutlined />,
    },
  ]


return (
    <Page
      className={"Plan"}
      title={t({ id: "app.billingplan.plan.title" })}
    >
    <div className="plan-content">
      {
        daysLeft > 0 &&
        <div className="status-info">
          <div>
            <p dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.status_plan" }) }}></p>
            <p>{t({ id: "app.billingplan.plan.status_prompt" })}</p>
          </div>
          <div>
            <span>{t({ id: "app.billingplan.plan.end_in" })} <span className="expiration">{`${daysLeft} ${t({ id: "app.billingplan.plan.days" })}`}</span></span>
          </div>
        </div>
      }

      {
        daysLeft <= 0 &&
        <div className="expired-card">
          <AlertCircleOutline />
          <span dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.trial_ended" }) }}></span>
        </div>
      }

      <div className="plan-card">
        <div className="left-column">
          <div className="headline">
            <span className="title">{t({ id: "app.billingplan.plan.advance_plan" })}</span>
            <div className="fullservice-badge">
              <img src={FullServiceBadge} width="35" height="35" />
              <span>{t({ id: "app.billingplan.plan.advance_plan_fullservice" })}</span>
            </div>
          </div>
          <p>{t({ id: "app.billingplan.plan.advance_plan_descr_1" })}</p>
          <p>{t({ id: "app.billingplan.plan.advance_plan_descr_2" })}</p>
          <p dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.advance_plan_descr_3" }) }}></p>
          <p>{t({ id: "app.billingplan.plan.advance_plan_descr_4" })}</p>
        </div>

        <div className="right-column">
          <div className="price-option">
            <div className="button-group">
              <span className="main-price">{t({ id: "app.billingplan.plan.advance_plan_cost" })}</span>
            </div>
            <div className="button-group">
              <button type="button" className="ant-btn ant-btn-primary link disabled"><span>{t({ id: "app.billingplan.plan.select_button" })}</span></button>
              <span className="secondary-note"><CheckOutlined />{t({ id: "app.billingplan.plan.advance_plan_full" })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="plan-card">
        <div className="left-column">
          <div className="headline">
            <span className="title">{t({ id: "app.billingplan.plan.flat_fee" })}</span>
          </div>
          <p>{t({ id: "app.billingplan.plan.flat_fee_descr_1" })}</p>
          <p>{t({ id: "app.billingplan.plan.flat_fee_descr_2" })}</p>
          <p>{t({ id: "app.billingplan.plan.flat_fee_descr_3" })}</p>
          <p dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.flat_fee_descr_4" }) }}></p>
        </div>

        <div className="right-column">
          <div className="price-option">
            <div className="button-group">
              <span className="main-price">{t({ id: "app.billingplan.plan.flat_fee_cost_month" })}</span>
              <span className="secondary-price">{t({ id: "app.billingplan.plan.flat_fee_total_cost_year" })}</span>
            </div>
            <div className="button-group">
              <button type="button" className="ant-btn ant-btn-secondary link disabled"><span>{t({ id: "app.billingplan.plan.select_button" })}</span></button>
              <span className="secondary-note">{t({ id: "app.billingplan.plan.flat_fee_self_service" })}</span>
            </div>
          </div>

          <div className="price-option">
            <div className="button-group">
              <span className="main-price">{t({ id: "app.billingplan.plan.flat_fee_cost_year" })}</span>
              <span className="secondary-price">{t({ id: "app.billingplan.plan.flat_fee_total_cost_month" })}</span>
            </div>
            <div className="button-group">
              <button type="button" className="ant-btn ant-btn-primary link disabled"><span>{t({ id: "app.billingplan.plan.select_button" })}</span></button>
              <span className="secondary-note" dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.flat_fee_you_save" }) }}></span>
            </div>
          </div>
        </div>
      </div>

      <div className="plan-card">
        <div className="left-column">
          <div className="headline">
            <span className="title">{t({ id: "app.billingplan.plan.cpc_model" })}</span>
          </div>
          <p>{t({ id: "app.billingplan.plan.cpc_model_descr_1" })}</p>
          <p>{t({ id: "app.billingplan.plan.cpc_model_descr_2" })}</p>
          <p dangerouslySetInnerHTML={{ __html: t({ id: "app.billingplan.plan.cpc_model_descr_3" }) }}></p>
          <p>{t({ id: "app.billingplan.plan.cpc_model_descr_4" })}</p>
        </div>

        <div className="right-column">
          <div className="price-option">
            <div className="button-group">
              <span className="main-price">{t({ id: "app.billingplan.plan.cpc_model_cost_click" })}</span>
            </div>
            <div className="button-group">
              <button type="button" className="ant-btn ant-btn-primary link disabled"><span>{t({ id: "app.billingplan.plan.select_button" })}</span></button>
              <span className="secondary-note">{t({ id: "app.billingplan.plan.cpc_model_self_service" })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <AlertCircleOutline />
        <span>{t({ id: "app.billingplan.plan.additional_fees" })}</span>
      </div>

      <div className="plan-card comparison-card">
        <Table dataSource={comparisonData} columns={comparisonColumns} pagination={false} />
      </div>

      <div className="more-info">
        <img src={SupportIcon} width="20" height="20" />
        <span>
          {t({ id: "app.billingplan.plan.more_information" })}
          <a href={t({ id: "app.billingplan.plan.more_information_link" })} target="_blank">
            {t({ id: "app.billingplan.plan.more_information_2" })}
          </a>
        </span>
      </div>

    </div>
    </Page>
  );
};

const mapStateToProps = ({ auth }) => {
  const { user } = auth;
  return { emailVerifiedAt: user.email_verified_at };
};

export default connect(mapStateToProps, null)(Plan);
