import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col, Card, Typography, Progress, Space, Spin } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import WidgetNumber from "./WidgetNumber";
import NoDataAvailable from "./NoDataAvailable";
import CHART_COLORS from "../../constants/ChartColors";
import { getViews } from "../../appRedux/actions/Views";
import { ComponentWithLoader } from "../../components/ComponentWithLoader";
import { useFormatMessage } from 'react-intl-hooks';
const { Title } = Typography;

function Views({ runningOffers, last30Days, getViews, id }) {
  const { data: runningOffersData, loading: runningOffersLoading, error: runningOffersError } = runningOffers;
  const { data: last30DaysData, loading: last30DaysLoading, error: last30DaysError } = last30Days;
  const t = useFormatMessage();

  React.useEffect(() => {
    if (id) {
      getViews(id);
    }
  }, [id]);

  const getTotalCount = () => {
    return runningOffersData.last24Hours + runningOffersData.last30Days + runningOffersData.last365Days;
  }

  const getLastDays = () => {
    if (!last30DaysData) return [];
    return Object.keys(last30DaysData.days).map(key => ({
      name: moment(key).format("D MMM"),
      value: Number(last30DaysData.days[key]),
    }))
  }

  return (
    <Card title={t({id: 'app.dashboard.views'})} bordered={false} className="dashboard-views">
      <Row gutter={50} justify="space-between">
        <ComponentWithLoader loading={runningOffersLoading} error={runningOffersError}>
          {
            runningOffersData ? (
              <>
                <Col span={7}>
                  <Title level={5}>{t({id: 'app.dashboard.views'})}</Title>
                  <Space direction="vertical">
                    <div>
                      <Row gutter={50} type="flex" justify="space-between">
                        <Col>{t({id: 'app.dashboard.24_hours'})}</Col>
                        <Col>{runningOffersData.last24Hours}</Col>
                      </Row>
                      <Progress
                        percent={
                          (runningOffersData.last24Hours / getTotalCount()) *
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
                        <Col>{t({id: 'app.dashboard.30_days'})}</Col>
                        <Col>{runningOffersData.last30Days}</Col>
                      </Row>
                      <Progress
                        percent={
                          (runningOffersData.last30Days / getTotalCount()) * 100
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
                        <Col>{t({id: 'app.dashboard.365_days'})}</Col>
                        <Col>{runningOffersData.last365Days}</Col>
                      </Row>
                      <Progress
                        percent={
                          (runningOffersData.last365Days / getTotalCount()) *
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
                </Col>
                <Col span={8} style={{ alignSelf: "flex-end" }}>
                  <Space size="middle">
                    <WidgetNumber label={t({id: 'app.dashboard.unanswered_messages'})} value={runningOffersData.unAnsweredMessages || 0}/>
                    <WidgetNumber label={t({id: 'app.dashboard.watchers'})} value={runningOffersData.watchers || 0}/>
                  </Space>
                </Col>
              </>
            ) : null
          }
        </ComponentWithLoader>
        <Col span={9}>
          <Title level={5} style={{ marginLeft: "40px" }}>
            {t({id: 'app.dashboard.last_30_days_views'})}
          </Title>
          <ComponentWithLoader loading={last30DaysLoading} error={last30DaysError}>
            <ResponsiveContainer height={150}>
              {getLastDays() && getLastDays().length > 0 ? (
                <AreaChart data={getLastDays()}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name" tickLine={false}/>
                  <YAxis width={40} tickLine={false} minTickGap={10}/>
                  <Tooltip/>
                  <Area
                    type="monotone"
                    fillOpacity="1"
                    dataKey="value"
                    stroke={CHART_COLORS[3]}
                    fill={CHART_COLORS[3]}
                  />
                </AreaChart>
              ) : (
                <NoDataAvailable/>
              )}
            </ResponsiveContainer>
          </ComponentWithLoader>
        </Col>
      </Row>
    </Card>
  );
}

const mapStateToProps = ({ views }) => ({
  runningOffers: views.runningOffers,
  last30Days: views.last30Days,
})

const mapDispatchToProps = {
  getViews,
}

export default connect(mapStateToProps, mapDispatchToProps)(Views);
