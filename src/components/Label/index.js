import React from "react";

import "./label.less";

const Label = ({ label, required, children }) => (
  <>
    <div className="label">
      {label}
      {required && <span>*</span>}:
    </div>
    {children}
  </>
);

export default Label;
