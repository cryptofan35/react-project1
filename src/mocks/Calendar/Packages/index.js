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
  }
];


export const PACKAGES = [
  {
    id: 1,
    name: 'Romantic SPA Package for 2 people',
    reservedDates: RESERVED_DATES
  },
  {
    id: 2,
    name: 'Weekend around historical center of Viena',
    reservedDates: [...RESERVED_DATES, {
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
    }]
  },
];
