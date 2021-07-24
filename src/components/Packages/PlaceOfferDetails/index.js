import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tooltip, Modal } from "antd";

import Marketplaces from "constants/Packages/Marketplaces";
import visibilityImage from "assets/images/visibility-24px.png";
import PreviewPackage from "components/Packages/PreviewPackage";
import { useFormatMessage } from 'react-intl-hooks';
import {
  getTemplateDetail,
  getSellerAccounts
 } from "appRedux/actions";

import "./index.less";

const PlaceOfferDetails = ({
  packageDetails,
  property,
  user,
  getTemplateDetail,
  sellerAccounts,
  getSellerAccounts
 }) => {
  const [sellerAccount, setSellerAccount] = useState('-');
  const [payeeAccount, setPayeeAccount] = useState('-');
  const { name, marketPlaceId, templateId } = packageDetails;

  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);
  const t = useFormatMessage();

  useEffect(() => {
    if (! property || ! property.objectId || ! marketPlaceId || ! user.language_id) {
      return;
    }
    getSellerAccounts({
      objectId: property.objectId,
      siteId: marketPlaceId,
      errorLang: user.language_id.substring(0,2)
    })
  }, [property, marketPlaceId])

  useEffect(() => {
    if (! marketPlaceId) {
      return;
    }
    if (sellerAccounts.length == 0) {
      return;
    }

    setPayeeAccount(sellerAccounts[0].payeeAccount || '-');
    setSellerAccount(sellerAccounts[0].sellerName || '-');
  }, [sellerAccounts, marketPlaceId])

  const onPreviewClicked = async () => {
    await getTemplateDetail({
      objectId: property && property.objectId ? property.objectId : null,
      templateId: templateId,
      errorLang: user.language_id.substring(0, 2),
    });
    setIsPreviewModalOpened(true);
  }

  return (
    <div className="place-offer-details">
      <div className="place-offer-details-labels">
        <p>{t({id: 'app.packages.place_offer.ebay_title'})}:</p>
        <p>{t({id: 'app.packages.place_offer.marketplace'})}:</p>
        <p>{t({id: 'app.packages.place_offer.seller_account'})}:</p>
        <p>{t({id: 'app.packages.place_offer.payee_account'})}:</p>
        <p>{t({id: 'app.packages.place_offer.preview'})}:</p>
      </div>
      <div className="place-offer-details-values">
        <p>{name || '-'}</p>
        <p>{Marketplaces[marketPlaceId]['name'] || '-'}</p>
        <p>{sellerAccount || '-'}</p>
        <p>{payeeAccount || '-'}</p>
        <p>
          <Tooltip overlayClassName="place-offer-details__tooltip" title={t({id:'app.packages.place_offer.preview'})}>
            <img
              src={visibilityImage}
              style={{
                cursor: "pointer",
                marginRight: 10,
                width: 22
              }}
              onClick={() => {onPreviewClicked()}}
            />
          </Tooltip>
          <Modal
            className="packages__modal"
            title={t({id:'app.packages.place_offer.preview'})}
            centered
            visible={isPreviewModalOpened}
            onCancel={() => setIsPreviewModalOpened(false)}
            footer={null}
            width={1100}
          >
            <PreviewPackage />
          </Modal>
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = ({auth, property, packages}) => {
  return {
    user: auth.user,
    property: property.property,
    packageDetails: packages.packageDetails,
    sellerAccounts: packages.sellerAccounts
  }
}

const mapDispatchToProps = {
  getTemplateDetail,
  getSellerAccounts
}


export default connect(mapStateToProps, mapDispatchToProps)(PlaceOfferDetails);
