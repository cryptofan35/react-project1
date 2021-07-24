import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import ContentForm from "../../components/ContentForm";
import VoucherDetails from "../../components/Voucher/VoucherDetails";
import { getVoucherById, redeemVoucher } from "../../appRedux/actions/Voucher";
import RedeemVoucherForm from "../../components/Voucher/RedeemVoucherForm";
import FullPageError from "../../components/FullPageError";
import FullPageLoader from "../../components/FullPageLoader";
import { useFormatMessage } from 'react-intl-hooks';

function Redemption(props) {
  const {
    voucher: { error, loading, data },
    match: { params },
    history,
    getVoucherById,
    redeemVoucher
  } = props;
  const t = useFormatMessage();

  useLayoutEffect(() => {
    getVoucherById(
      params. id,
      history.location.state.itemId,
      history.location.state.orderId,
      history.location.state.objectId,
    );
  }, []);

  function handleSubmit({ travellerName, dateEnd, dateStart }) {
    const voucherToUpdate = {
      ...data,
      travellerName,
      travelPeriod: {
        start: dateStart,
        end: dateEnd
      }
    };
    redeemVoucher(voucherToUpdate, history, history.location.state.objectId);
  }

  if (error) {
    if (error.status === 404) {
      return (
        <FullPageError
          contentFormTitle={t({id: 'app.vouchers.redemption.voucher_redemption'})}
          text={<span>{t({id: 'app.ebay.vouchers.voucher_not_found'})}</span>}
        />
      );
    }
    return (
      <FullPageError
        contentFormTitle={t({id: 'app.vouchers.redemption.voucher_redemption'})}
        text={<span>{t({id: 'app.ebay.vouchers.voucher_error'})}</span>}
      />
    );
  }

  if (loading || !data) {
    return <FullPageLoader size="3rem" contentFormTitle={t({id: 'app.vouchers.redemption.voucher_redemption'})} />;
  }

  return (
    <ContentForm title={t({id: 'app.vouchers.redemption.voucher_redemption'})}>
      <VoucherDetails voucher={data} />
      <RedeemVoucherForm history={history} handleSubmit={handleSubmit} />
    </ContentForm>
  );
}

const mapStateToProps = state => ({
  voucher: state.voucher.voucherRedemption
});

const mapDispatchToProps = {
  getVoucherById,
  redeemVoucher
};

export default connect(mapStateToProps, mapDispatchToProps)(Redemption);
