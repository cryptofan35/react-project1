import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Typography, Space, Table, Spin } from "antd";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import WidgetNumber from "./WidgetNumber";
import NoDataAvailable from "./NoDataAvailable";
import CHART_COLORS from "../../constants/ChartColors";
import { LoadingOutlined } from "@ant-design/icons";
import { getDashboardVouchers } from "../../appRedux/actions/DashboardVouchers";
import { ComponentWithLoader } from "../../components/ComponentWithLoader";
import { useFormatMessage } from 'react-intl-hooks';
const { Title } = Typography;

const voucherTableColumns = [
  {
    title: "",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "app.dashboard.vouchers.24_hours",
    children: [
      {
        title: "app.dashboard.vouchers.fixed_price",
        dataIndex: "24HoursFixedPrice",
        key: "24HoursFixedPrice",
        align: "center",
      },
      {
        title: "app.dashboard.vouchers.auction",
        dataIndex: "24HoursAuction",
        key: "24HoursAuction",
        align: "center",
      },
    ],
  },
  {
    title: "app.dashboard.vouchers.30_days",
    children: [
      {
        title: "app.dashboard.vouchers.fixed_price",
        dataIndex: "30DaysFixedPrice",
        key: "30DaysFixedPrice",
        align: "center",
      },
      {
        title: "app.dashboard.vouchers.auction",
        dataIndex: "30DaysAuction",
        key: "30DaysAuction",
        align: "center",
      },
    ],
  },
  {
    title: "app.dashboard.vouchers.365_days",
    children: [
      {
        title: "app.dashboard.vouchers.fixed_price",
        dataIndex: "365DaysFixedPrice",
        key: "365DaysFixedPrice",
        align: "center",
      },
      {
        title: "app.dashboard.vouchers.auction",
        dataIndex: "365DaysAuction",
        key: "365DaysAuction",
        align: "center",
      },
    ],
  },
];

const mapVoucherTableData = (data, t) => {
  const res = [
    { key: 1, name: t({id: "app.dashboard.vouchers.number_of_voucher"}) },
    { key: 2, name: "GSV" },
    { key: 3, name: t({id: "app.dashboard.vouchers.conversion_rate"}) },
  ];

  res.forEach((item) => {
    let key = "vouchers";
    switch (item.key) {
      case 1:
        key = "vouchers";
        break;
      case 2:
        key = "gsv";
        break;
      case 3:
        key = "convertion";
        break;
      default:
        return;
    }

    item["24HoursFixedPrice"] = data["last24Hours"].fixed[key];
    item["24HoursAuction"] = data["last24Hours"].auction[key];
    item["30DaysFixedPrice"] = data["last30Days"].fixed[key];
    item["30DaysAuction"] = data["last30Days"].auction[key];
    item["365DaysFixedPrice"] = data["last365Days"].fixed[key];
    item["365DaysAuction"] = data["last365Days"].auction[key];
  });

  return res;
};

const totalVouchersNameMap = {
  yetToBeRedeem: "app.dashboard.vouchers.yet_to_redeem",
  redeem: "app.dashboard.vouchers.redeemed",
  cancelled: "app.dashboard.vouchers.cancelled",
  expired: "app.dashboard.vouchers.expired",
};

const yetToRedeemVouchersNameMap = {
  expiredIn1Years: "app.dashboard.vouchers.expired_in_1_year",
  expiredIn1to2Years: "app.dashboard.vouchers.expired_in_1_to_2_years",
  expiredIn2to3years: "app.dashboard.vouchers.expired_in_2_to_3_years",
  booked: "app.dashboard.vouchers.booked",
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    name,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${value} (${Math.round(percent * 100)}%)`}
      </text>
    </g>
  );
};

const VouchersValueFormatter = (value, entry, index) => {
  return `${entry.payload.name} - ${entry.payload.value} (${Math.round(
    entry.payload.percent * 100
  )}%)`;
};

function VouchersPieChart(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  function onPieEnter(data, index) {
    setActiveIndex(index);
  }

  return (
    <ResponsiveContainer height={300}>
      {props.data && props.data.length > 0 ? (
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={props.data}
            outerRadius={80}
            cy={100}
            fill="#005C81"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            iconSize={12}
            formatter={VouchersValueFormatter}
          />
        </PieChart>
      ) : (
        <NoDataAvailable />
      )}
    </ResponsiveContainer>
  );
}

function Vouchers(props) {
  const {
    vouchersOverview,
    totalVouchers,
    yetToRedeemVouchers,
    totalData,
    getDashboardVouchers,
    id,
  } = props;
  const t = useFormatMessage();

  const {
    data: vouchersOverviewData,
    loading: vouchersOverviewLoading,
    error: vouchersOverviewError,
  } = vouchersOverview;
  const {
    data: totalVouchersData,
    loading: totalVouchersLoading,
    error: totalVouchersError,
  } = totalVouchers;
  const {
    data: yetToRedeemVouchersData,
    loading: yetToRedeemVouchersLoading,
    error: yetToRedeemVouchersError,
  } = yetToRedeemVouchers;
  const {
    data: totalDataData,
    loading: totalDataLoading,
    error: totalDataError,
  } = totalData;

  React.useEffect(() => {
    if (id) {
      getDashboardVouchers(id);
    }  
  }, [id]);

  const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);

  const totalVouchersArray = () =>
    Object.keys(totalVouchersData.result).map(
      (key) => +totalVouchersData.result[key]
    );
  const yetToRedeemVouchersArray = () =>
    Object.keys(yetToRedeemVouchersData).map(
      (key) => +yetToRedeemVouchersData[key]
    );

  const getTotalVouchersData = () => {
    return Object.keys(totalVouchersData.result).map((key) => {
      const value = +totalVouchersData.result[key];
      return {
        name: t({id: totalVouchersNameMap[key]}),
        value,
        percent: value === 0 ? 0 : value / sum(totalVouchersArray()),
      };
    });
  };

  const getYetToRedeemVouchersData = () => {
    return Object.keys(yetToRedeemVouchersData).map((key) => {
      const value = Number(yetToRedeemVouchersData[key]);
      return {
        name: yetToRedeemVouchersNameMap[key],
        value: value,
        percent: value === 0 ? 0 : value / sum(yetToRedeemVouchersArray()),
      };
    });
  };

  return (
    <Card title={t({id: 'app.dashboard.vouchers'})} bordered={false} className="dashboard-vouchers">
      <Row gutter={50} align="bottom">
        <Col span={24}>
          <Title level={5}>{t({id: 'app.dashboard.vouchers_overview'})}</Title>
          <ComponentWithLoader
            loading={vouchersOverviewLoading}
            error={vouchersOverviewError}
          >
            {vouchersOverviewData ? (
              <Space size="large">
                <WidgetNumber
                  label={t({id: 'app.dashboard.redeemed_vouchers'})}
                  value={vouchersOverviewData.redeemeed | 0}
                />
                <WidgetNumber
                  label={t({id: 'app.dashboard.room_nights_included'})}
                  value={vouchersOverviewData.roomNightIncluded | 0}
                />
                <WidgetNumber
                  label={t({id: 'app.dashboard.revenue_eur'})}
                  value={vouchersOverviewData.revenue | 0}
                />
                <WidgetNumber
                  label={t({id: 'app.dashboard.price_per_room_eur'})}
                  value={vouchersOverviewData.pricePerRoomNight | 0}
                />
              </Space>
            ) : null}
          </ComponentWithLoader>
        </Col>
        <Col span={24} className="dashboard-vouchers-table">
          <ComponentWithLoader
            loading={totalDataLoading}
            error={totalDataError}
          >
            {totalDataData &&
              totalDataData.last30Days &&
              totalDataData.last24Hours &&
              totalDataData.last365Days && (
                <Table
                  columns={voucherTableColumns.map((column) => ({
                    ...column,
                    title: column.title ? t({id: column.title}) : '',
                    children: column.children ? column.children.map((childColumn) => ({
                      ...childColumn,
                      title: childColumn.title ? t({id: column.title}) : ''
                    })) : []
                  }))}
                  dataSource={mapVoucherTableData(totalDataData, t)}
                  pagination={false}
                  locale={{
                    filterConfirm: t({id: 'app.common.ok'}),
                    filterReset: t({id: 'app.common.reset'}),
                    emptyText: t({id: 'app.common.no_data'})
                  }}
                />
              )}
          </ComponentWithLoader>
        </Col>
        <Col span={12} className="dashboard-vouchers-chart">
          <Title level={5}>{t({id: 'app.dashboard.total_vouchers'})}</Title>
          <ComponentWithLoader
            loading={totalVouchersLoading}
            error={totalVouchersError}
          >
            {totalVouchersData && totalVouchersData.summary.total  ? (
              <VouchersPieChart data={getTotalVouchersData()} />
            ) : <NoDataAvailable />}
          </ComponentWithLoader>
        </Col>
        <Col span={12} className="dashboard-vouchers-chart">
          <Title level={5}>{t({id: 'app.dashboard.yet_to_vouchers'})}</Title>
          <ComponentWithLoader
            loading={yetToRedeemVouchersLoading}
            error={yetToRedeemVouchersError}
          >
            {yetToRedeemVouchersData && yetToRedeemVouchersData.expiredIn2to3years ? (
              <VouchersPieChart data={getYetToRedeemVouchersData()} />
            ) : <NoDataAvailable />}
          </ComponentWithLoader>
        </Col>
      </Row>
    </Card>
  );
}

const mapStateToProps = ({ dashboardVouchers }) => ({
  vouchersOverview: dashboardVouchers.vouchersOverview,
  totalVouchers: dashboardVouchers.totalVouchers,
  yetToRedeemVouchers: dashboardVouchers.yetToRedeemVouchers,
  totalData: dashboardVouchers.totalData,
});

const mapDispatchToProps = {
  getDashboardVouchers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Vouchers);
