import { GET_CALENDAR_PACKAGES, GET_CALENDAR_PACKAGE_AVAILABILITIES, TOGGLE_RESERVING, CHANGE_PACKAGE_DATE_DATA, RESET_LOADING } from "../../constants/ActionTypes";
import { fetchCalendarPackages, fetchCalendarPackagesFromAvailabilityStatus, updatePackageDate, updatePackageData } from "../../API/Calendars";
import { showNotification } from "../../util/notifications";

export const getCalendarPackageAvailabilities = (objectId, pageIndex = 0, itemsPerPage = 10) => dispatch => {
  dispatch({type: RESET_LOADING});

  return fetchCalendarPackagesFromAvailabilityStatus(objectId, pageIndex, itemsPerPage).then((packages) => {
    return dispatch({
      type: GET_CALENDAR_PACKAGE_AVAILABILITIES,
      payload: {
        packages
      }
    })
  }).catch(({ message = ''}) => {
    console.error("Error****:", message)
    showNotification({ message, type: 'error'})
  })
}

export const getCalendarPackages = (objectId) => dispatch => {
  dispatch({type: RESET_LOADING});

  return fetchCalendarPackages(objectId).then((packages) => {
    return dispatch({
      type: GET_CALENDAR_PACKAGES,
      payload: {
        packages
      }
    })
  }).catch(({ message = '' }) => {
    console.error("Error****:", message)
    showNotification({ message, type: 'error' })
  })
};

export const togglePackageDate = (id, date, isAvailable, roomID, objectId, quantity = 0) => dispatch => {
  return updatePackageDate(id, date, isAvailable, roomID, objectId, quantity).then(() => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: TOGGLE_RESERVING,
      payload: {
        id, date
      }
    })
  }).catch(({ message = '' }) => {
    console.error("Error****:", message)
    showNotification({ message, type: 'error' })
  })
};

export const changePackageDate = (id, data, roomID, objectId, currency) => dispatch => {
  const { date, key, value } = data;

  return updatePackageData(id, data, roomID, objectId, currency).then(() => {
    showNotification({ message: 'Saved' });

    return dispatch({
      type: CHANGE_PACKAGE_DATE_DATA,
      payload: {
        id, date, key, value, roomID
      }
    })
  }).catch(({ message = '' }) => {
    console.error("Error****:", message)
    showNotification({ message, type: 'error' })
  })
};
