
import React from "react";

function WidgetNumber(props) {
  return (
    <div className="widget-number">
      <label className="widget-number-label">{props.label}</label>
      <span className="widget-number-value">{props.value}</span>
    </div>
  );
}

export default WidgetNumber;