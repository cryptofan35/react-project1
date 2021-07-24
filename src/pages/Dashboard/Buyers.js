import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Typography, Spin } from "antd";
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
import { LoadingOutlined } from "@ant-design/icons";
import { getBuyers } from "../../appRedux/actions/Buyers";
import { ComponentWithLoader } from "../../components/ComponentWithLoader";
import { useFormatMessage } from 'react-intl-hooks';
const { Title } = Typography;

const buyersTotalNameMap = {
  purchased2to3Times: 'app.dashboard.buyers.2_3_times',
  purchased4to10Times: 'app.dashboard.buyers.4_10_times',
  purchasedMoreThen10Times: 'app.dashboard.buyers.more_than_10_times',
  purchased1Time: 'app.dashboard.buyers.1st_time',
}
const allValuesValid = object => Object.values(object).some((value)=>value);

const BuyersLegendFormatter = (value, entry, index) => {
  return `${entry.payload.name} - ${entry.payload.value} (${Math.round(entry.payload.percent * 100)}%)`;
};

function Buyers({ buyersTotal, buyersOrigin, getBuyers, id }) {
  const { data: buyersTotalData, loading: buyersTotalLoading, error: buyersTotalError } = buyersTotal;
  const { data: buyersOriginData, loading: buyersOriginLoading, error: buyersOriginError } = buyersOrigin;
  const t = useFormatMessage();

  React.useEffect(() => {
    if (id) {
      getBuyers(id);
    }
  }, [id]);

  const sum = arr => arr.reduce((acc, curr) => acc + curr, 0);

  const buyersTotalArray = () => Object.keys(buyersTotalData.result).map(key => +buyersTotalData.result[key]);
  const buyersOriginArray = () => Object.keys(buyersOriginData).map(key => +buyersOriginData[key]);

  const buyersPurchasesTooltipFormatter = (value) => {
    const total = getBuyersTotalData().reduce((acc, curr) => acc + curr.value, 0);
    const percentage = value === 0 ? 0 : Math.round((value / total) * 100);
    return `${value} (${percentage}%)`;
  };

  const buyersOriginTooltipFormatter = (value) => {
    const total = getBuyersOriginData().reduce((acc, curr) => acc + curr.value, 0);
    const percentage = value === 0 ? 0 : Math.round((value / total) * 100);
    return `${value} (${percentage}%)`;
  };

  const getBuyersTotalData = () => {
    return Object.keys(buyersTotalData.result).map(key => {
      const value = Number(buyersTotalData.result[key]);
      return {
        name: t({id: buyersTotalNameMap[key]}),
        value: Number(buyersTotalData.result[key]),
        percent: value === 0 ? 0 : value / sum(buyersTotalArray()),
      }
    });
  }

  const getBuyersOriginData = () => {
    return Object.keys(buyersOriginData).map(key => {
      const value = Number(buyersOriginData[key]);
      return {
        name: key,
        value: Number(buyersOriginData[key]),
        percent: value === 0 ? 0 : value / sum(buyersOriginArray()),
      }
    });
  }

  return (
    <Card title={t({id: 'app.dashboard.buyers'})} bordered={false} className="dashboard-buyers">
      <Row gutter={50}>
        <Col span={12}>
          <Title level={5}>{t({id: 'app.dashboard.total_buyers'})}</Title>
          <ComponentWithLoader loading={buyersTotalLoading} error={buyersTotalError}>
            {buyersTotalData ? (
              <ResponsiveContainer width="100%" height={200}>
                {  buyersTotalData.summary.total ? (
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={getBuyersTotalData()}
                      outerRadius={80}
                      cx={80}
                      fill="#005c81"
                    >
                      {getBuyersTotalData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={12}
                      formatter={BuyersLegendFormatter}
                    />
                    <Tooltip formatter={buyersPurchasesTooltipFormatter} separator=": "/>
                  </PieChart>
                ) : (
                  <NoDataAvailable/>
                )}
              </ResponsiveContainer>
            ) : <NoDataAvailable/> }
          </ComponentWithLoader>
        </Col>
        <Col span={12}>
          <Title level={5}>{t({id: 'app.dashboard.buyers_origin'})}</Title>
          <ComponentWithLoader loading={buyersOriginLoading} error={buyersOriginError}>
            {buyersOriginData ? (
              <ResponsiveContainer width="100%" height={200}>
                {allValuesValid(buyersOriginData) ? (
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={getBuyersOriginData()}
                      outerRadius={80}
                      cx={80}
                      fill="#005c81"
                    >
                      {getBuyersOriginData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={12}
                      formatter={BuyersLegendFormatter}
                    />
                    <Tooltip formatter={buyersOriginTooltipFormatter} separator=": "/>
                  </PieChart>
                ) : (
                  <NoDataAvailable/>
                )}
              </ResponsiveContainer>
            ) :  <NoDataAvailable/>}
          </ComponentWithLoader>
        </Col>
      </Row>
    </Card>
  );
}

const mapStateToProps = ({ buyers }) => ({
  buyersTotal: buyers.buyersTotal,
  buyersOrigin: buyers.buyersOrigin,
})

const mapDispatchToProps = {
  getBuyers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Buyers);
