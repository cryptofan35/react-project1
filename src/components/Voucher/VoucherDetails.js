import React from "react";
import moment from "moment";
import { useFormatMessage } from 'react-intl-hooks';
import "./voucherDetails.less";

export default function VoucherDetails({ voucher }) {
  const { buyer, price, itemId, id, paidDate, currency } = voucher;
  const t = useFormatMessage();
  return (
    <div className="voucher-details">
      <div className="voucher-details-labels">
        <p>{t({id: 'app.vouchers.redemption.buyer_name'})}:</p>
        <p>{t({id: 'app.vouchers.redemption.voucher_id'})}:</p>
        <p>{t({id: 'app.vouchers.redemption.paid_date'})}:</p>
        <p>{t({id: 'app.vouchers.redemption.price'})}:</p>
      </div>
      <div className="voucher-details-values">
        <p>{buyer.fullName}</p>
        <p>{`${itemId || ''}-${id}`}</p>
        <p>{moment(paidDate).format("ll")}</p>
        <p>{price} {currency}</p>
      </div>
    </div>
  );
}
