import { OFFER_STATUSES, OFFER_TYPES, OFFER_ACTIONS } from "../../constants/Ebay/offers";
import AuctionIcon from '../../assets/images/auction.png';
import FixedPriceIcon from '../../assets/images/fixed-price.png';

const { fixedPrice, notAvailable } = OFFER_STATUSES;
const { running, future, past } = OFFER_TYPES;
const { stop, view, remove } = OFFER_ACTIONS;

export const getIconByStatus = (status) => {
  switch (status) {
    case fixedPrice: {
      return FixedPriceIcon;
    }
    case notAvailable: {
      return AuctionIcon;
    }
    default:
      return ''
  }
};

export const getActionsByType = (type) => {
  switch (type) {
    case running: {
      return [stop, view];
    }
    case past: {
      return [view];
    }
    case future: {
      return [remove];
    }
    default: {
      return [];
    }
  }
};
