import { GET_CALENDAR_PACKAGES, GET_CALENDAR_PACKAGE_AVAILABILITIES, TOGGLE_RESERVING, CHANGE_PACKAGE_DATE_DATA, RESET_LOADING } from "../../constants/ActionTypes";
import { DEFAULT_DATE } from "../../components/Calendars/Package/Calendar/helpers";

const INITIAL_STATE = {
  loading: true,
  packages: [],
  packageAvailabilities: []
};

export default (state = INITIAL_STATE, { type: actionType, payload }) => {
  switch (actionType) {
    case GET_CALENDAR_PACKAGES: {
      const { packages } = payload;

      return {
        ...state,
        loading: false,
        packages
      }
    }
    case GET_CALENDAR_PACKAGE_AVAILABILITIES: {
      const { packages } = payload;
      return {
        ...state,
        loading: false,
        packageAvailabilities: packages
      }
    }
    case TOGGLE_RESERVING: {
      const { id, date } = payload;
      const { packages } = state;
      const pack = packages.find(({ id: _id }) => _id === id);
      const { reservedDates } = pack;

      const reservedDate = reservedDates.find(({ date: _date }) => date === _date);

      const updatedReservedDates = reservedDate
        ? reservedDates.map((_reservedDate) => {
          if (_reservedDate.date === date) {
            return {
              ..._reservedDate,
              quantity: _reservedDate.quantity > 0 ? _reservedDate.quantity : 1,
              isClosed: !_reservedDate.isClosed
            }
          }

          return _reservedDate;
        })
        : [...reservedDates, { ...DEFAULT_DATE, date, quantity: 1 }];

      const updatedPackage = {
        ...pack,
        reservedDates: updatedReservedDates
      }

      return {
        ...state,
        packages: packages.map((pack) => pack.id === id ? updatedPackage : pack)
      }
    }

    case RESET_LOADING: {
      return {
        ...state,
        ...INITIAL_STATE
      }
    }

    case CHANGE_PACKAGE_DATE_DATA: {
      const { id, date, key, value } = payload;
      const { packages } = state;
      const pack = packages.find(({ id: _id }) => String(_id) === id);
      const { reservedDates } = pack;

      const reservedDate = reservedDates.find(({ date: _date }) => _date === date);

      const updatedReservedDates = reservedDate
        ? reservedDates.map((_reservedDate) => {
          if (_reservedDate.date === date) {
            return {
              ..._reservedDate,
              [key]: value
            }
          }

          return _reservedDate;
        })
        : [...reservedDates, { ...DEFAULT_DATE, date, [key]: value }];

      const updatedPackage = {
        ...pack,
        reservedDates: updatedReservedDates
      }

      return {
        ...state,
        packages: packages.map((pack) => String(pack.id) === id ? updatedPackage : pack)
      }
    }
    default: {
      return state;
    }
  }
};
