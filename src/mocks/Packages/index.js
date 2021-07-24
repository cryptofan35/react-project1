const BOOLEAN_OPTIONS = [
  {
    id: 1,
    value: 'app.common.yes'
  },
  {
    id: 0,
    value: 'app.common.no'
  },
];

const PACKAGES_LIST = [
  { id: 190445, status: 'running', sellerAccount: 'dummy@dummy.com', payeeAccount: 'paypal@dummy.com', rooms: "Single bedroom", nights: 8, people: 2, price: 22.00, arrivalPrice: 12.00, currency: 'EUR', packageName: "Romantic SPA weekend for 2 people", marketPlace: "UK" },
  { id: 190443, status: 'new', sellerAccount: 'dummy@dummy.com', payeeAccount: 'paypal@dummy.com', rooms: "Single bedroom", nights: 8, people: 2, price: 22.00, arrivalPrice: 12.00, currency: 'EUR', packageName: "Romantic SPA weekend for 3 people", marketPlace: "UK" },
  { id: 190442, status: 'future', sellerAccount: 'dummy@dummy.com', payeeAccount: 'paypal@dummy.com', rooms: "Single bedroom", nights: 8, people: 2, price: 22.00, arrivalPrice: 12.00, currency: 'EUR', packageName: "Romantic SPA weekend for 4 people", marketPlace: "Germany" },
  { id: 190441, status: 'failed', sellerAccount: 'dummy@dummy.com', payeeAccount: 'paypal@dummy.com', rooms: "Single bedroom", nights: 8, people: 2, price: 22.00, arrivalPrice: 12.00, currency: 'EUR', packageName: "Romantic SPA weekend for 5 people", marketPlace: "UK" },
  { id: 190444, status: 'past', sellerAccount: 'dummy@dummy.com', payeeAccount: 'paypal@dummy.com', rooms: "Single bedroom", nights: 8, people: 2, price: 22.00, arrivalPrice: 12.00, currency: 'EUR', packageName: "Romantic SPA weekend for 6 people", marketPlace: "UK" },
];

const ROOM_TYPES = [
  { id: 0, name: "Single bedroom" },
  { id: 1, name: "Pitch" },
  { id: 2, name: "Apartment" },
  { id: 3, name: "Double bedroom" },
  { id: 4, name: "Bed in Dormitory" }
];

const MARKETPLACE = ['US', 'UK', 'Italy', 'France', 'India', 'Germany', 'Switzerland', 'Australia', 'Spain', 'Austria', 'Belgium (French)', 'Netherlands', 'Belgium (Dutch)'];

const CURRENCY = 'EUR';

const SELLER_ACCOUNT = [
  { id: "1", value: "dummy1@dumy.com" },
  { id: "2", value: "dummy2@dumy.com" },
  { id: "3", value: "dummy3@dumy.com" },
];

const PACKAGE_DESCRIPTION = "<p><strong>Room Description:</strong></p><p>This is the sample text. Please edit as your wish. Named after our lovely town, the luxury Hotel is located on the beach side . This spacious and cheerful room overlooks sea and offers private outdoor parking.</p><p>This ground-level room is ideal for guests who prefer to avoid climbing stairs. Excellent connectivity to the airport.</p><p><strong>Offer includes:</strong></p><ul><li>(=nights=) nights for (=persons=) person</li><li>Free/Paid breakfast</li><li>Free/Paid wifi</li><li>TV: compact flat-screen and 80+ cable channel</li></ul><p><strong>Room Information:</strong></p><ul><li>Building: Main Inn</li><li>Floor: 1</li><li>Size: 150 sq. ft. (excl. bathroom)</li><li>Max. occupancy: (=persons=)</li><li>Beds: 1 (King)</li><li>Exposure: East</li></ul><p><strong>Voucher Information:</strong></p><p>This offer is valid for three years after receipt of payment and can only be booked via the availability calendar. Booking is subject to availability and booking calendar. Your booking is binding and non-refundable or refundable. Resale to third parties is not permitted. The voucher is only valid for the registered traveler. This offer is subject to a separate quota. Availabilities may therefore differ from those of other providers.</p>"
const VOUCHER_TEXT = '<p>This is the sample text. You can edit as your wish.</p><ul><li>Building: Main Inn</li><li>Floor: 1 (the front porch has several steps)</li><li>Beds: 1 (King)</li><li>Number of Nights: (=nights=)</li><li>Number of Persons: (=persons=)</li><li>Exposure: South</li><li>Views: carriage yard (parking)</li><li>Non-smoking</li><li>Adults only</li></ul><p>This offer is valid for three years after receipt of payment and can only be booked via the availability calendar. Booking&nbsp; is subject to availability and booking calendar. Your booking is binding and non-refundable or refundable.</p>';

const VOUCHER_VALIDITY = [
  { id: "1", value: "3 years" },
  { id: "2", value: "2 years" },
  { id: "3", value: "1 year" },
  { id: "4", value: "6 months" },
  { id: "5", value: "3 months" },
  { id: "6", value: "1 month" },
];

const TYPE_OFFER = [
  { id: "Both", value: "app.packages.place_offer.fixed_and_auction" },
  { id: "Auction", value: "app.packages.place_offer.auction" },
  { id: "Fixed Price Offer", value: "app.packages.place_offer.fixed" },
];

const AUCTION_DURATION = [
  { id: "1", value: "app.packages.place_offer.1_day" },
  { id: "3", value: "app.packages.place_offer.3_days" },
  { id: "5", value: "app.packages.place_offer.5_days" },
  { id: "7", value: "app.packages.place_offer.7_days" },
  { id: "10", value: "app.packages.place_offer.10_days" },
  { id: "30", value: "app.packages.place_offer.30_days" },
];

const RESERVED_DATES = [
  {
    date: '09-01-2020',
    quantity: 10,
    price: 100.50,
    isClosed: true,
    cta: false,
    ctd: false
  },
  {
    date: '09-29-2020',
    quantity: 10,
    price: 10.21,
    isClosed: false,
    cta: false,
    ctd: false
  },
  {
    date: '09-30-2020',
    quantity: 0,
    price: 60,
    isClosed: true,
    cta: true,
    ctd: true
  },
  {
    date: '09-27-2020',
    quantity: 2,
    price: 160,
    isClosed: true,
    cta: true,
    ctd: true
  }, {
    date: '10-17-2020',
    quantity: 2,
    price: 160,
    isClosed: true,
    cta: true,
    ctd: true
  }
];

const PACKAGE_DETAILS = {
  id: 1,
  name: 'Romantic SPA Package for 2 people',
  reservedDates: RESERVED_DATES
};

export {
  PACKAGES_LIST,
  BOOLEAN_OPTIONS,
  ROOM_TYPES,
  MARKETPLACE,
  CURRENCY,
  SELLER_ACCOUNT,
  PACKAGE_DESCRIPTION,
  VOUCHER_TEXT,
  VOUCHER_VALIDITY,
  TYPE_OFFER,
  AUCTION_DURATION,
  PACKAGE_DETAILS
};
