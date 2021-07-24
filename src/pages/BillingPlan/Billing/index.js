import React from "react";
import Page from "components/Common/Page";
import { useFormatMessage } from "react-intl-hooks";
import "./styles.less";

const Billing = props => {
  const t = useFormatMessage();

return (
    <Page
      className={"Billing"}
      title={t({ id: "app.billing_plan.billing.billing" })}
    >
    <div className="billing-content">
      <p>{t({id: 'app.billing_plan.billing.no_required'})}</p>
    </div>
    </Page>
  );
};

export default Billing;
