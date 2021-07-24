import React, { useLayoutEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Space, Tooltip, Table, Pagination } from "antd";
import moment from "moment";
import ContentForm from "../../components/ContentForm";

import "../../styles/layout/tablePaginationComponentStyles.less";
import "./voucher.less";

import calendarImage from "../../assets/images/calendar.png";
import visibilityImage from "../../assets/images/visibility-24px.png";
import { connect } from "react-redux";
import { getVouchers } from "../../appRedux/actions/Voucher";
import { VoucherStatuses } from "../../constants/VoucherStatuses";
import { useFormatMessage } from 'react-intl-hooks';

const statusClassNames = {
  7: "voucher-redeemed-status",
  9: "voucher-cancellation-status",
  Expired: "voucher-expired-status",
};


function Voucher(props) {
  const [objectId, setObjectId] = React.useState(null);
  const t = useFormatMessage();

  const columns = [
    {
      title: t({id: 'app.ebay.vouchers.id'}),
      render: (item) => (
        <a href={`${item.offerSiteId}${item.itemId}`} target="_blank">
          <span className="voucher-id">
            {`${item.itemId}${item.id ? '-' : ''}${item.id}`}
          </span>
        </a>
      ),
    },
    {
      title: t({id: 'app.ebay.vouchers.paid_date'}),
      render: ({ paidDate }) => <span>{moment(paidDate).format("ll")}</span>,
    },
    {
      title: t({id: 'app.ebay.vouchers.buyer_name'}),
      render: ({ buyer }) => (
        <div>
          <p style={{ marginBottom: "3px" }}>{buyer.username}</p>
          <p>({buyer.fullName})</p>
        </div>
      ),
    },
    {
      title: t({id: 'app.ebay.vouchers.price'}),
      render: (item) => (
        <span>
          {item.price} {item.currency}
        </span>
      ),
    },
    {
      title: t({id: 'app.ebay.vouchers.status'}),
      render: (item) => (
        <span className={statusClassNames[item.status]}>
          {`${VoucherStatuses[item.status] === 'Unredeemed' && moment(item.validUntil).isBefore(new Date()) ? 'Unredeemed Expired' : VoucherStatuses[item.status]}`}
        </span>
      ),
      width: 100,
    },

    {
      title: t({id: 'app.ebay.vouchers.travel_period'}),
      render: ({ travelPeriod }) =>
        travelPeriod && (
          <div>
            <p>
              {travelPeriod.start
                ? moment(travelPeriod.start).format("ll")
                : ""}
            </p>
            <p>
              {travelPeriod.end ? moment(travelPeriod.end).format("ll") : ""}
            </p>
          </div>
        ),
    },
    {
      title: t({id: 'app.ebay.vouchers.actions'}),
      key: "operation",
      width: 100,
      render: (item) => (
        <Space size="middle" style={{ fontSize: "24px" }}>
          <Tooltip title={t({id: 'app.ebay.vouchers.preview'})}>
            <Link
              target="_blank"
              to={{
                pathname: `/voucher-preview/${item.id}`,
                search: `?orderId=${item.orderId}&itemId=${item.itemId}&objectId=${props.property.objectId}`,
              }}
            >
              <img
                src={visibilityImage}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  color: item.isModifying ? "grey" : "#005c81",
                }}
              />
            </Link>
          </Tooltip>
          {VoucherStatuses[item.status] === "Unredeemed" &&
            item.productOffer !== "true" &&
            moment(item.validUntil).isAfter(new Date()) && (
              <Tooltip title={t({id: 'app.ebay.vouchers.redeem'})}>
                <img
                  src={calendarImage}
                  style={{
                    cursor: "pointer",
                    color: item.isModifying ? "grey" : "#005c81",
                  }}
                  onClick={() =>
                    props.history.push({
                      pathname: `/vouchers/${item.id}/redeem`,
                      state: {
                        orderId: item.orderId,
                        itemId: item.itemId,
                        objectId: props.property.objectId,
                      },
                    })
                  }
                />
              </Tooltip>
            )}
        </Space>
      ),
    },
  ];

  const { vouchers, getVouchers, property, history } = props;
  const params = new URLSearchParams(history.location.search);
  const page = +params.get("page");

  const scrollTop = () => {
    const el = document.getElementsByClassName('ant-layout-content cb-layout-content')[0];
    el.scrollTop = 0;
  }

  useLayoutEffect(() => {
    if (property && property.objectId) {
      setObjectId(property.objectId);
      getVouchers(property.objectId, page);
    }
  }, []);

  React.useEffect(() => {
    if (property && property.objectId) {
      getVouchers(property.objectId, page);
    }
  }, [page]);

  React.useEffect(() => {
    if (property && objectId && property.objectId && property.objectId !== objectId) {
      setObjectId(property.objectId);
      scrollTop();
      if (page === 0) {
        getVouchers(property.objectId, 0);
      } else {
        history.push('/vouchers');
      }
    }
  }, [property, objectId]);

  const handlePageChange = (value) => {
    if (property && property.objectId) {
      scrollTop();
      history.push({
        pathname: history.location.pathname,
        search: `?page=${value - 1}`,
      });
    }
  };
  if(property && !property.objectId){
    return <Redirect to="/"/>;
  }
  return (
    <ContentForm title={t({id: 'app.ebay.vouchers.vouchers_list'})}>
      <Table
        className="cultbay-table vouchers-table "
        columns={columns}
        rowKey={(record) => record.id + record.buyer.username + record.itemId}
        pagination={false}
        dataSource={vouchers.data.vouchers}
        loading={vouchers.loading}
        scroll={{ x: 720 }}
        locale={{
          filterConfirm: t({id: 'app.common.ok'}),
          filterReset: t({id: 'app.common.reset'}),
          emptyText: t({id: 'app.common.no_data'})
        }}
      />
      {vouchers && vouchers.data && vouchers.data.total ? (
        <Pagination
          style={{ marginTop: 20 }}
          defaultCurrent={1}
          total={+vouchers.data.total}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSize={50}
        />
      ) : null}
    </ContentForm>
  );
}

const mapStateToProps = (state) => ({
  vouchers: state.voucher.vouchersList,
  property: state.property.property,
});

const mapDispatchToProps = {
  getVouchers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
