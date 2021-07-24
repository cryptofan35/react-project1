import React from 'react';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const ComponentWithLoader = ({children, loading, error}) => {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin/>}/>
      </div>
    )
  }

  if (error) {
    return null;
  }

  return children;
}
