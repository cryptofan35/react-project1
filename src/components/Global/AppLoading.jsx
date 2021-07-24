import React from "react";
import { Alert, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function AppLoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}
    >
      <Spin size="large" />
    </div>
  );
}
