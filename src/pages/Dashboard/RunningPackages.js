import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Space, Typography, Progress, Table, Spin } from "antd";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import NoDataAvailable from "./NoDataAvailable";
import CHART_COLORS from "../../constants/ChartColors";
import { useFormatMessage } from 'react-intl-hooks';
import "./dashboard.less";
import { getRunningPackages } from "../../appRedux/actions/RunningPackages";
import { ComponentWithLoader } from "../../components/ComponentWithLoader";

const { Title } = Typography;

const packagesTableColumns = [
  {
    dataIndex: "order",
    key: "order"
  },
  {
    dataIndex: "offerName",
    key: "offerName",
    render: text => <a>{text}</a>
  },
  {
    render: item => <p>{item.total} {item.currency || ''}</p>
  }
];

function RunningPackages({ getRunningPackages, marketPlaces, topOffers, runningOffers, id }) {
  const { data: marketPlacesData, loading: marketPlacesLoading, error: marketPlacesError } = marketPlaces;
  const { data: topOffersData, loading: topOffersLoading, error: topOffersError } = topOffers;
  const { data: runningOffersData, loading: runningOffersLoading, error: runningOffersError } = runningOffers;
  const t = useFormatMessage();

  React.useEffect(() => {
    if (id) {
      getRunningPackages(id);
    }
  }, [id])

  const eBayMarketPlacesValueFormatter = (value) => {
    const total = getMarketPieChart().reduce((acc, curr) => acc + curr.value, 0);
    const percentage = ((value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  const getMarketPieChart = () => {
    const res = Object.keys(marketPlacesData.marketoffers).map(key => ({
      name: key,
      value: Number(marketPlacesData.marketoffers[key]),
    }))

    return res;
  }

  return (
    <Card
      title={t({id: 'app.dashboard.running_packages'})}
      bordered={false}
      className="dashboard-running-packages"
    >
      <Row gutter={50} justify="space-between">
        <Col span={7}>
          <Title level={5}>{t({id: 'app.dashboard.running_packages'})}</Title>
          <ComponentWithLoader loading={runningOffersLoading} error={runningOffersError}>
            {runningOffersData ? (
              <Space direction="vertical">
                <div>
                  <Row gutter={50} type="flex" justify="space-between">
                    <Col>{t({id: 'app.dashboard.auction'})}</Col>
                    <Col>{runningOffersData.auction}</Col>
                  </Row>
                  <Progress
                    percent={
                      (runningOffersData.auction /
                        runningOffersData.total) *
                      100
                    }
                    showInfo={false}
                    strokeWidth={12}
                    strokeColor={CHART_COLORS[0]}
                    trailColor={CHART_COLORS[CHART_COLORS.length - 1]}
                    status="normal"
                  />
                </div>
                <div>
                  <Row gutter={50} type="flex" justify="space-between">
                    <Col>{t({id: 'app.dashboard.fixed_price'})}</Col>
                    <Col>{runningOffersData.fixed}</Col>
                  </Row>
                  <Progress
                    percent={
                      (runningOffersData.fixed /
                        runningOffersData.total) *
                      100
                    }
                    showInfo={false}
                    strokeWidth={12}
                    strokeColor={CHART_COLORS[0]}
                    trailColor={CHART_COLORS[CHART_COLORS.length - 1]}
                    status="normal"
                  />
                </div>
              </Space>
            ) : null}
          </ComponentWithLoader>
        </Col>
        <Col span={11} className="top-performing-packages">
          <Title level={5}>{t({id: 'app.dashboard.top_5_packages'})}</Title>
          <ComponentWithLoader loading={topOffersLoading} error={topOffersError}>
            {topOffersData && topOffersData.topOfferList ?
              <Table
                dataSource={topOffersData.topOfferList.map((item, index) => ({ ...item, order: index + 1 }))}
                rowKey={item => item.offerId}
                columns={packagesTableColumns}
                size="small"
                pagination={false}
                showHeader={false}
                bordered={false}
                locale={{
                  filterConfirm: t({id: 'app.common.ok'}),
                  filterReset: t({id: 'app.common.reset'}),
                  emptyText: t({id: 'app.common.no_data'})
                }}
              />
              :
              <NoDataAvailable/>
            }
          </ComponentWithLoader>
        </Col>
        <Col span={6}>
          <Title level={5}>{t({id: 'app.dashboard.ebay_marketplaces'})}</Title>
          <ComponentWithLoader loading={marketPlacesLoading} error={marketPlacesError}>
            {
              marketPlacesData && marketPlacesData.marketoffers && getMarketPieChart().length
                ? (
                  <ResponsiveContainer height={200}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={getMarketPieChart()}
                        cy={80}
                        outerRadius={80}
                        fill={CHART_COLORS[0]}
                      >
                        {getMarketPieChart().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend iconType="circle" iconSize={12} formatter={(item) => { return '-' + item; }} />
                      <Tooltip formatter={eBayMarketPlacesValueFormatter} separator=": "/>
                    </PieChart>
                  </ResponsiveContainer>
                )
                : <NoDataAvailable/>
            } 
          </ComponentWithLoader>
        </Col>
      </Row>
    </Card>
  );
}

const mapStateToProps = ({ runningPackages }) => ({
  marketPlaces: runningPackages.marketPlaces,
  topOffers: runningPackages.topOffers,
  runningOffers: runningPackages.runningOffers,
});

const mapDispatchToProps = {
  getRunningPackages,
}


export default connect(mapStateToProps, mapDispatchToProps)(RunningPackages);
