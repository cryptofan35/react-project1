import React from "react";
import Page from "components/Common/Page";
import { useFormatMessage } from "react-intl-hooks";
import "./styles.less";

const Invoices = props => {
  const t = useFormatMessage();

return (
    <Page
      className={"Invoices"}
      title={t({ id: "app.billing_plan.invoices.invoices" })}
    >
    <div className="invoices-content">
      <p>{t({id: 'app.billing_plan.invoices.no_invoices'})}</p>
    </div>
    </Page>
  );
};

export default Invoices;
