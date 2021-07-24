import React from "react";
import { Spin } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import ContentForm from "./ContentForm";

export default function FullPageError({
  iconSize = "3rem",
  text = "There was an error",
  contentFormTitle
}) {
  return (
    <ContentForm title={contentFormTitle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <CloseCircleFilled style={{ fontSize: iconSize, color: "red" }} />
        <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>{text}</p>
      </div>
    </ContentForm>
  );
}
