import React, { Component } from "react";
import { Layout } from "antd";
import App from "../../routes/index";
import Topbar from "../Header";
import Sidebar from "../Sidebar";

import { connect } from "react-redux";
import { getEbaySettings } from "appRedux/actions/Ebay";
import NotificationForm from "../NotificationForm";

const { Content } = Layout;

export class MainApp extends Component {
  componentDidMount() {
    const { property, getEbaySettings } = this.props;
    if (property && property.objectId) {
      getEbaySettings(property.objectId);
    }
  }
  render() {
    const { match } = this.props;
    return (
      <Layout className="cb-app-layout">
        <Topbar {...this.props} />
        <NotificationForm />
        <Layout>
          <Sidebar />
          <Content className={"cb-layout-content"}>
            <App match={match} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ settings, property }) => {
  const { width } = settings;

  return { width, property: property.property };
};
export default connect(mapStateToProps, { getEbaySettings })(MainApp);
