import { ROOMS_DATA, ROOM_AMENITIES, SIGNOUT_USER_SUCCESS, ROOM_AVAILABILITY_CALENDAR } from "../../constants/ActionTypes";

const initialState = {
  rooms: [],
  amenities: [],
  availabilityCalendar: []
}

export default (state = initialState, action) => {
  switch(action.type) {
    case ROOMS_DATA: {
      return {
        ...state,
        rooms: action.payload
      }
    }

    case SIGNOUT_USER_SUCCESS: {
      return { ...state, rooms: [] };
    }

    case ROOM_AMENITIES: {
      return {
        ...state,
        amenities: action.payload
      }
    }

    case ROOM_AVAILABILITY_CALENDAR: {
      return {
        ...state,
        availabilityCalendar: action.payload
      }
    }

    default:
      return {
        ...state
      };
  }
}