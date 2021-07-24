const OLD_MESSAGE = {
  question: 'Hello.\n What is your name?',
  answer: 'Vlad',
  id: 0
};

const NEW_MESSAGE = {
  question: 'Hello.\n How old to you?',
  answer: '',
  id: 1
};


const MESSAGE = {
  buyerID: 'polinnovikov-27',
  itemID: 164405833194,
  date: '28 Sep 2020',
  subject: 'Information',
};

export const EBAY_MESSAGES = [
  {
    ...MESSAGE,
    id: 0,
    isNew: false,
    history: [OLD_MESSAGE]
  },
  {
    ...MESSAGE,
    id: 1,
    isNew: true,
    history: [NEW_MESSAGE],
  },
  {
    ...MESSAGE,
    id: 2,
    isNew: true,
    history: [{ ...NEW_MESSAGE, id: 2 }],
  },
  {
    ...MESSAGE,
    id: 3,
    isNew: false,
    history: [{ ...OLD_MESSAGE, id: 3 }, { ...OLD_MESSAGE, id: 4 }]
  },
];
