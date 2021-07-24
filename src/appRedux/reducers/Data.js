import { CURRENCIES_DATA, TYPES_DATA, COUNTRIES_DATA, LANGUAGES_DATA, CHANNEL_MANAGERS_DATA, PICTURE_TYPES, PICTURES_DATA, PICTURE_DELETE } from "../../constants/ActionTypes";

const INIT_STATE = {
  currencies: [],
  types: [],
  countries: [],
  regions: [],
  languages: [],
  chanelManagers: [],
  pictureTypes: [],
  pictures: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CURRENCIES_DATA: {
      return { ...state, currencies: action.payload };
    }

    case TYPES_DATA: {
      return { ...state, types: action.payload };
    }

    case LANGUAGES_DATA: {
      return { ...state, languages: action.payload };
    }

    case CHANNEL_MANAGERS_DATA: {
      return { ...state, chanelManagers: action.payload };
    }

    case COUNTRIES_DATA: {
      return {
        ...state,
        countries: action.payload.countries,
        regions: action.payload.regions
      };
    }

    default:
      return state;
  }
};
