import { AMENITIES_DATA } from "../../constants/ActionTypes";
import { fetchAmenities } from "../../API/Property";

export const fetchAllAmenities = ({userLanguageId}) => async dispatch => {
  const amenities = await fetchAmenities({userLanguageId});
  dispatch({type: AMENITIES_DATA, payload: amenities});
}
