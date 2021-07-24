import React from "react";
import { message } from "antd";
import error_img from "../assets/images/error-notification.png";
import translate from "util/translate";

export default function showErrorMessage(msg) {
  message.error({
    icon: (
      <img
        src={error_img}
        style={{ width: 17, height: 17, marginRight: 5 }}
        alt="error"
      />
    ),
    content: translate(msg),
    style: {
      color: "#D0021B",
      fontSize: "12px",
      fontFamily: "Poppins",
      fontWeight: 500
    }
  });
}
