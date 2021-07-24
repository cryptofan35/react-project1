const MARKET_PLACES = [
  {
    country: 'Germany',
    email: 'johndoe@gmail.com',
    id: 0
  }
];

export const PAYMENT_ACCOUNTS = [
  {
    id: 0,
    name: 'Hotelier Account',
    // marketPlaces: MARKET_PLACES
  },
  {
    id: 1,
    name: 'Cultuzz Account',
    // marketPlaces: [...MARKET_PLACES, { country: 'Spain', email: 'example@gmail.com', id: 1 }]
  }
];

export const EBAY_SETTINGS_DATA = {
  userName: '',
  reputize: '',
  paymentAccounts: PAYMENT_ACCOUNTS,
  emails: [
    {
      name: 'johndoe@gmail.com',
      isPayment: false,
      isReservation: false,
      isAuction: true,
      isBidderEnquiry: true,
      id: 0
    }
  ]
};
