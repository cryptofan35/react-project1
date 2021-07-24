export const MARKET_PLACES = [
  {
    id: 0,
    value: 'US',
    currency: 'USD'
  },
  {
    id: 3,
    value: 'UK',
    currency: 'GBP'
  },
  {
    id: 15,
    value: 'Australia',
    currency: 'AUD'
  },
  {
    id: 16,
    value: 'Austria',
    currency: 'EUR'
  },
  {
    id: 23,
    value: 'Belgium (French)',
    currency: 'EUR'
  },
  {
    id: 71,
    value: 'France',
    currency: 'EUR'
  },
  {
    id: 77,
    value: 'Germany',
    currency: 'EUR'
  },
  {
    id: 101,
    value: 'Italy',
    currency: 'EUR'
  },
  {
    id: 123,
    value: 'Belgium (Dutch)',
    currency: 'EUR'
  },
  {
    id: 146,
    value: 'Netherlands',
    currency: 'EUR'
  },
  {
    id: 186,
    value: 'Spain',
    currency: 'EUR'
  },
  {
    id: 193,
    value: 'Switzerland',
    currency: 'CHF'
  },
  {
    id: 203,
    value: 'India',
    currency: 'INR'
  },
];

export const CURRENCIES = Array.from(new Set(MARKET_PLACES.map(({currency}) => currency)));