const captions = [
  {  // Hotel Pictures
    code: 1,
    categoryId: 4,
    multiple: true,
    required: true,
    label: 'Hotel Pictures'
  },
  {  // Hotel Logo
    code: 2,
    categoryId: 7,
    multiple: false,
    required: true,
    label: 'Hotel Logo'
  },
  { // Voucher Logo
    code: 5,
    categoryId: 10,
    multiple: false,
    required: true,
    label: 'Voucher Logo'
  },
  {  // Voucher Picture
    code: 4,
    categoryId: 6,
    multiple: false,
    required: true,
    label: 'Voucher Picture'
  },
  {  // Footer Picture
    code: 0,
    categoryId: 3,
    multiple: false,
    isFooter: true,
    required: false,
    label: 'Footer Picture'
  }
];

export default captions;