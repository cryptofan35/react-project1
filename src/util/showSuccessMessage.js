import React from "react";
import { message } from "antd";
import success_img from "../assets/images/success-notification.png";
import translate from "util/translate";

export default function showSuccessMessage(msg) {
  message.success({
    icon: (
      <img
        src={success_img}
        style={{ width: 17, marginRight: 5 }}
        alt="success"
      />
    ),
    content: translate(msg),
    style: {
      color: "#1D577B",
      fontSize: "12px",
      fontFamily: "Poppins",
      fontWeight: 500
    }
  });
}
