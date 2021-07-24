import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { getVoucherPreview} from "../../appRedux/actions/Voucher";
import FullPageError from "../../components/FullPageError";

function Voucher(props) {
  const {
    previewVoucher: { error, loading, data },
    match: { params },
    history,
    getVoucherPreview,
  } = props;

  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(history.location.search);
    const itemId = Number(urlParams.get('itemId'));
    const orderId = Number(urlParams.get('orderId'));
    const objectId = Number(urlParams.get('objectId'));

    getVoucherPreview({
      id:params.id,
      itemId,
      orderId,
      objectId
    });
  }, []);

  if (error) {
    if (error.status === 404) {
      return (
        <FullPageError
          contentFormTitle="Voucher Details"
          text={<span>Voucher not found</span>}
        />
      );
    }
    return (
      <FullPageError
        contentFormTitle="Voucher Details"
        text={<span>There was an error getting the voucher</span>}
      />
    );
  }

  if (loading || !data) {
    return null;
  }

  return (
    <iframe
      src={`data:application/pdf;base64,${data}`}
      height="100%"
      width="100%">
    </iframe>
  );
}

const mapStateToProps = state => ({
  previewVoucher: state.voucher.previewVoucher,
});

const mapDispatchToProps = {
  getVoucherPreview,
};

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
