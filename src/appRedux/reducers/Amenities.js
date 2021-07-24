import { AMENITIES_DATA } from "../../constants/ActionTypes";

const initialState = []

export default (state = initialState, action) => {
  switch(action.type) {
    case AMENITIES_DATA:
      return {
        ...state,
        amenities: action.payload
      }


    default:
      return {
        ...state
      };
  }
}
