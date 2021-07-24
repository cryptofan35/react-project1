import {
  GET_EBAY_SETTINGS, SET_INITIAL_EBAY_SETTINGS, CHANGE_EBAY_SETTINGS, ADD_MARKET_PLACE,
  REMOVE_MARKET_PLACE, ADD_EMAIL_ITEM,
  GET_CONFIG_DETAILS, CHANGE_FAQ_ITEM, CHANGE_FAQ, CHANGE_TC, ADD_FAQ_ITEM, REMOVE_FAQ_ITEM,
  GET_EBAY_OFFERS_LOADING, GET_EBAY_OFFERS, STOP_EBAY_OFFER, REMOVE_EBAY_OFFER,
  GET_EBAY_MESSAGES, GET_EBAY_MESSAGES_LOADING,  ARCHIVE_EBAY_MESSAGE,
  GET_EBAY_ARCHIVE_MAILS, RESET_EBAY_ARCHIVE_MAILS, CHANGE_REPUTIZE, GET_DEFAULT_FAQ_TC, SET_TOKEN_STATUS, SET_SESSION_ID, SET_TOTAL_OFFER_COUNT
} from "../../constants/ActionTypes";
import { getRandomInt } from "../../util/numbers/validation";
import { parseOffersToTable } from "../../util/ebayOffers/filters";
import { getDateOfFormat, getTimezoneAbbr } from "../../util/dates/getters";
import { OFFER_TYPES } from "../../constants/Ebay/offers";
const { past } = OFFER_TYPES;
const TABLE_DATE_FORMAT = 'D MMM YYYY HH:mm';

const INITIAL_SETTINGS = {
  userName: '',
  password: '',
  reputize: '',
  paymentAccounts: [],
  emails: [],
};

const INITIAL_ARCHIVE = {
  mails: [],
  isFetched: false,
};

const INITIAL_STATE = {
  settings: INITIAL_SETTINGS,
  faq: [],
  addedItemID: {
    faq: null,
    tc: null
  },
  tc: [],
  offers: [],
  totalOfferCount: 0,
  loadingOffers: false,
  newMessages: { messages: [], total: 0, loading: false },
  history: { messages: [], total: 0, loading: false },
  archive: INITIAL_ARCHIVE,
  tokenStatus: {},
  sessionId: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_EBAY_SETTINGS: {
      const { settings } = payload;

      return {
        ...state,
        settings
      }
    }
    case CHANGE_EBAY_SETTINGS: {
      const { settings } = state;
      const { data } = payload;

      const updatedSettings = {
        ...settings,
        ...data,
        // password: ''
      }

      return {
        ...state,
        settings: updatedSettings
      }
    }
    case SET_INITIAL_EBAY_SETTINGS: {
      
      return {
        ...state,
        settings: INITIAL_SETTINGS
      }
    }
    case ADD_MARKET_PLACE: {
      const { accountID, accountType } = payload;
      const { settings } = state;
      const { paymentAccounts } = settings;
      const defaultMarketPlace = {
        country: '',
        email: '',
        id: Math.floor(Math.random() * 99999) + 1000,
        hotelier: accountType === 'Hotelier Account' ? true : false,
      };

      const account = paymentAccounts ? paymentAccounts.find(({ id }) => id === accountID) : null;

      const updatedAccount = {
        ...account,
        marketPlaces: [defaultMarketPlace, ...account.marketPlaces]
      };

      const updatedSettings = {
        ...settings,
        paymentAccounts: paymentAccounts.map(_account => {
          if (_account.id === accountID) {
            return updatedAccount;
          }

          return _account;
        })
      };

      return {
        ...state,
        settings: updatedSettings
      }
    }
    case REMOVE_MARKET_PLACE: {
      const { accountID, marketPlaceID } = payload;
      const { settings } = state;
      const { paymentAccounts } = settings;

      const account = paymentAccounts.find(({ id }) => id === accountID);

      const updatedAccount = {
        ...account,
        marketPlaces: account.marketPlaces.filter(({ id }) => id !== marketPlaceID)
      };

      const updatedSettings = {
        ...settings,
        paymentAccounts: paymentAccounts.map(_account => {
          if (_account.id === accountID) {
            return updatedAccount;
          }

          return _account;
        })
      };

      return {
        ...state,
        settings: updatedSettings
      }
    }
    case ADD_EMAIL_ITEM: {
      const { settings } = state;
      const { emails } = settings;
      const defaultEmail = {
        email: '',
        payMailOption: false,
        bookingMailOption: false,
        eoaMailOption: false,
        enqMailOption: false
      }

      return {
        ...state,
        settings: {
          ...settings,
          emails: [defaultEmail, ...emails]
        }
      }
    }


    case GET_CONFIG_DETAILS: {
      const { faq, tc, reputize, paymentAccounts } = payload;
      
      
      return {
        ...state,
        faq,
        tc,
        settings: {
          ...state.settings,
          reputize,
          paymentAccounts,
        }
      }
    }

    case GET_DEFAULT_FAQ_TC: {
      const { faq, tc } = payload;
      return {
        ...state,
        faq: state.faq.length ? state.faq: faq,
        tc: state.tc.length ? state.tc: tc,
      }
    }

    case CHANGE_FAQ: {
      return {
        ...state,
        faq: payload
      }
    }


    case CHANGE_TC: {
      return {
        ...state,
        tc: payload
      }
    }


    case CHANGE_REPUTIZE: {
      return {
        ...state,
        settings: {
          ...state.settings,
          reputize: payload
        }
      }
    }

    
    case CHANGE_FAQ_ITEM: {
      const { type, id, item, locale } = payload;

      return {
        ...state,
        [type]: state[type].map(_item => {
          if (_item.id === id) {
            const { answer, question } = _item;

            return {
              ..._item,
              question: {
                ...question,
                [locale]: item.question
              },
              answer: {
                ...answer,
                [locale]: item.answer
              }
            }
          }

          return _item;
        })
      }
    }
    case ADD_FAQ_ITEM: {
      const { type } = payload;
      const id = getRandomInt(0, 999999);
      const defaultItem = {
        id,
        question: {
          en: '',
          de: ''
        },
        answer: {
          en: '',
          de: ''
        }
      };

      return {
        ...state,
        [type]: [...state[type], defaultItem],
        addedItemID: {
          ...state.addedItemID,
          [type]: id,
        }
      }
    }
    case REMOVE_FAQ_ITEM: {
      const { type, id } = payload;

      return {
        ...state,
        [type]: state[type].filter((item) => item.id !== id)
      }
    }
    case GET_EBAY_OFFERS: {
      const { offers } = payload;
      return {
        ...state,
        offers: parseOffersToTable(offers),
      }
    }
    case GET_EBAY_OFFERS_LOADING: {
      return {
        ...state,
        loadingOffers: payload
      }
    }
    case SET_TOTAL_OFFER_COUNT: {
      return {
        ...state,
        totalOfferCount: payload
      }
    }
    case STOP_EBAY_OFFER: {
      const { id } = payload;

      return {
        ...state,
        offers: state.offers.map(offer => {
          if (offer.id === id) {
            return {
              ...offer,
              type: past
            }
          }

          return offer;
        }),
      }
    }
    case REMOVE_EBAY_OFFER: {
      const { id } = payload;

      return {
        ...state,
        offers: state.offers.filter(offer => offer.id !== id),
      }
    }
    case GET_EBAY_MESSAGES: {
      return {
        ...state,
        newMessages : payload.newMessages || state.newMessages,
        history: payload.history || state.history,
      }
    }

    case GET_EBAY_MESSAGES_LOADING: {
      return {
        ...state,
        history: {
          ...state.history,
          loading: payload.historyOffset || state.history.loading,
        },
        newMessages: {
          ...state.newMessages,
          loading: payload.newMessagesOffset || state.newMessages.loading,
        },
      };
    }

    case ARCHIVE_EBAY_MESSAGE: {
      const { id } = payload;

      const { newMessages } = state;
      const archivedMessage = newMessages.messages.find(x=>x.id === id)

      return {
        ...state,
        newMessages: {
          ...newMessages,
          messages: newMessages.messages.filter(message => message != archivedMessage),
        }
      }
    }
    case GET_EBAY_ARCHIVE_MAILS: {
      const { mails } = payload;

      return {
        ...state,
        archive: {
          mails: mails.map(({ date, ...mail }) => ({
            ...mail,
            date: `${getDateOfFormat(date, TABLE_DATE_FORMAT)} ${getTimezoneAbbr()}`
          })),
          isFetched: true,
        }
      }
    }
    case RESET_EBAY_ARCHIVE_MAILS: {
      return {
        ...state,
        archive: INITIAL_ARCHIVE,
      }
    }
    case SET_TOKEN_STATUS: {
      return {
        ...state,
        tokenStatus: payload
      }
    }
    case SET_SESSION_ID: {
      window.localStorage.setItem('sessionId', payload);
      return {
        ...state,
        sessionId: payload
      }
    }
    default: {
      return state;
    }
  }
}
