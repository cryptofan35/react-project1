import moment from "moment";
import { OFFER_TYPES } from "../../constants/Ebay/offers";
import { getTimezoneAbbr, convertToString } from "../dates/getters";

const DATE_FORMAT = 'MM-DD-YYYY HH:mm';
const TABLE_DATE_FORMAT = 'D MMM YYYY HH:mm';
const { future, past, running } = OFFER_TYPES;

const getOfferType = (offer) => {
  switch(offer.Status[0]) {
    case '0':
      return future;
    case '1':
      return running;
    case '2':
      return past;
  }
}

const getOfferPeriod = (start, end, zone) => {
  return `${start.format(TABLE_DATE_FORMAT)} to ${end.format(TABLE_DATE_FORMAT)} (${zone})`;
}


export const parseOffersToTable = (offers) => offers.map(({ marketPlace, payeeAccount, sold, total, purchases = [], ...offer }) => {
  const start = moment(offer.startDate, DATE_FORMAT);
  const end = moment(offer.endDate, DATE_FORMAT);
  const zone = getTimezoneAbbr();
  const type = getOfferType(offer)
  
  return ({
    ...offer,
    type: type,
    period: getOfferPeriod(start, end, zone),
    market: `${marketPlace} \n ${payeeAccount}`,
    quantity: `${sold}/${total}`,
    duration: end.diff(start, 'days'),
    purchases: purchases.map(purchase => ({
      ...purchase,
      date: `${convertToString(moment(purchase.date, DATE_FORMAT), TABLE_DATE_FORMAT)} (${zone})`,
    })),
  });
});

export const checkAndConvertMandatoryToXmlField = (name) => {
  switch (name) {
    case 'Standard Business Terms' :
      return 'StandardBusinessTerms';
     case 'Standard Geschäftsbedingungen':
      return 'StandardBusinessTerms'; 
    case 'Checkout Service':
      return 'CheckoutService';
    case 'Angebotsabwicklung/Check-Out':
      return 'CheckoutService';
    case 'Payment Service':
      return 'PaymentService';
    case 'Zahlungsabwicklung':
      return 'PaymentService';
    case 'Voucher Service':
      return 'VoucherService';
    case 'Gutschein/Versand':
      return 'VoucherService';
    default:
      return false;
  }
}