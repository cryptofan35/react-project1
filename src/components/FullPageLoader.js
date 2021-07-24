import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ContentForm from "./ContentForm";

export default function FullPageLoader({ size, contentFormTitle }) {
  return (
    <ContentForm title={contentFormTitle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: size || 24 }} spin />}
        />
      </div>
    </ContentForm>
  );
}
