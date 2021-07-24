import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import ContentForm from "components/ContentForm";
import ConfirmModal from 'components/ConfirmationModal'

import './index.less'

import PlaceOfferForm from "components/Packages/PlaceOfferForm"
import PlaceOfferDetails from "components/Packages/PlaceOfferDetails"
import Marketplaces from "constants/Packages/Marketplaces"

import {
  createOffer as createOfferAction,
  getPackages as getPackagesAction
 } from "appRedux/actions";
import moment from "moment";

import { useFormatMessage } from 'react-intl-hooks';

const PlaceOfferPage = ({ user, history, property, packageDetails, createOffer, getPackages }) => {
  const [confirm, setConfirm] = useState(false);
  const [formData, setformData] = useState();
  const t = useFormatMessage();

  const handleFormSubmit = data => {
    setConfirm(true)
    setformData(data)
  }

  const handleOnConfirm = async () => {

    const startTime = moment(formData.startTime);
    let startDateTime = moment(formData.startDate);
    startDateTime.hours(startTime.hours()).minutes(startTime.minutes()).seconds(startTime.seconds());
    const formattedStartDateTime = startDateTime.format('YYYY-MM-DD HH:mm:ss');

    const currency = Marketplaces[packageDetails.marketPlaceId]['currency'];
    try {
      if (formData.typeOfOffer === 'Both') {
        await createOffer({
          objectId: property.objectId,
          errorLang: user.language_id.substring(0, 2),
          marketPlaceId: packageDetails.marketPlaceId,
          templateId: packageDetails.templateId,
          listingType: 'Auction',
          listingDuration: formData.auctionDuration || 1,
          startTime: formattedStartDateTime,
          price: formData.auctionPrice,
          offerRepeat: formData.offerRepeat,
          currency
        });
        await createOffer({
          objectId: property.objectId,
          errorLang: user.language_id.substring(0, 2),
          marketPlaceId: packageDetails.marketPlaceId,
          templateId: packageDetails.templateId,
          listingType: 'Fixed Price Offer',
          listingDuration: formData.auctionDuration || 1,
          startTime: formattedStartDateTime,
          price: formData.fixedPrice,
          currency
        });
      } else {
        await createOffer({
          objectId: property.objectId,
          errorLang: user.language_id.substring(0, 2),
          marketPlaceId: packageDetails.marketPlaceId,
          templateId: packageDetails.templateId,
          listingType: formData.typeOfOffer,
          listingDuration: formData.auctionDuration || 1,
          startTime: formattedStartDateTime,
          price: formData.fixedPrice || formData.auctionPrice,
          offerRepeat: formData.offerRepeat,
          currency
        });
      }

      await getPackages({
        objectId: property.objectId,
        errorLang: user.language_id.substring(0, 2),
        offset: 0,
        limit: 10
      });
      history.push('/packages/templates')
    } catch (error) {
      console.log(error);
    }
  }

  if (! packageDetails || ! packageDetails.packageId) {
    return (<Redirect to={'/packages/templates'} />)
  }

  return (
    <ContentForm
      title={t({id:"app.packages.place_offer.place_offer_headline"})}
      className="packages__content-form"
    >
      <PlaceOfferDetails />
      <PlaceOfferForm history={history} handleSubmit={handleFormSubmit}/>
      <ConfirmModal
        title={t({id:"app.packages.place_offer.modal.title"})}
        confirmLabel={t({id:"app.packages.place_offer.modal.place_button"})}
        cancelLabel={t({id:"app.packages.place_offer.modal.cancel_button"})}
        isVisible={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={handleOnConfirm}
      />
    </ContentForm>
  );
};

const mapStateToProps = ({ auth, property, packages }) => {
  const { packageDetails } = packages;
  const { user } = auth;
  return { user, property: property.property, packageDetails };
};

const mapDispatchToProps = {
  createOffer: createOfferAction,
  getPackages: getPackagesAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOfferPage);
