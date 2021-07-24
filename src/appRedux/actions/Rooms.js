import { ROOMS_DATA, ROOM_AMENITIES, ROOM_AVAILABILITY_CALENDAR } from "../../constants/ActionTypes";
import { getAmenities as getAmenitiesCall } from "../../API/Rooms";
import { fetchPropertyXML } from "../../API/Property";
import { fetchCalendarByRoom, updateRoomQuantity, updateRoomAvailability as updateRoomAvailabilityViaAPI, getUserCalendarSettings, updateUserCalendarSettings } from "API/Calendars";
import { showNotification } from "../../util/notifications";
import { fetchStart, fetchSuccess } from "appRedux/actions";
import moment from "moment";

export const clearRooms = () => dispatch => dispatch({type: ROOMS_DATA, payload: []})

export const getRooms = objectId => async dispatch => {
  const propertyXML = await fetchPropertyXML(objectId);
  dispatch({type: ROOMS_DATA, payload: propertyXML.rooms});
}

export const getRoomAmenities = () => async dispatch => {
  const amenities = await getAmenitiesCall();
  dispatch({type: ROOM_AMENITIES, payload: amenities})
}

export const setAvailabilityCalendar = payload => ({ type: ROOM_AVAILABILITY_CALENDAR, payload });

export const fetchAvailabilityCalendar = (roomId, startDate, endDate) => async (dispatch, getState) => {
  dispatch(fetchStart());
  const { 
    property: {
      property: {
        objectId
      }
    },
    settings: {
      locale: {
        locale
      }
    }
  } = getState();
  const [payload, userCalendarSettings] = await Promise.all([
    fetchCalendarByRoom({roomId, startDate, endDate}),
    getUserCalendarSettings({objectId, roomId, errorLang: locale})
  ]);
  let availabilityCalendar = {};
  const activeUserCalendarSettings = userCalendarSettings.filter(({calendarStatus}) => calendarStatus);
  for (let availabilityData of payload) {
    for (let reservedDate of availabilityData.reservedDates) {
      let date = moment(reservedDate.date, "MM-DD-YYYY");
      const userCalendarSetting = activeUserCalendarSettings.find(({fromDate, toDate}) => {
        return date.isSameOrAfter(moment(fromDate, "YYYY-MM-DD")) && date.isSameOrBefore(moment(toDate, "YYYY-MM-DD"));
      });
      reservedDate.hasUserSetting = userCalendarSetting && userCalendarSetting.calendarStatus || false;
      availabilityCalendar[reservedDate.date] = reservedDate;
    }
  }
  dispatch(setAvailabilityCalendar(availabilityCalendar));
  dispatch(fetchSuccess());
}

export const changeQuantityOnAvailabilityCalendar = (roomId, quantity, date, hasChannelManager) => async (dispatch, getState) => {
  const {
    rooms: {
      availabilityCalendar
    },
    property: {
      property: {
        objectId
      }
    },
    settings: {
      locale: {
        locale
      }
    }
  } = getState();
  let newAvailabilityCalendar = {...availabilityCalendar};
  try {
    await updateRoomQuantity(roomId, objectId, quantity, date);
  } catch (error) {
    showNotification({message: error.message ? error.message : 'Could not save'});
    return;
  }
  const day = date.format('MM-DD-YYYY');
  const oldAvailability = availabilityCalendar[day] ? !availabilityCalendar[day]['isClosed'] : false;
  if (hasChannelManager) {
    const updateDay = date.format('YYYY-MM-DD');
    updateUserCalendarSettings({objectId, roomId, errorLang: locale, fromDate: updateDay, toDate: updateDay, status: true});
  }
  if (availabilityCalendar[day]) {
    newAvailabilityCalendar[day]['quantity'] = quantity;
    newAvailabilityCalendar[day]['hasUserSetting'] = true;
  } else {
    newAvailabilityCalendar[day] = {
      isClosed: false,
      quantity,
      date: day,
      price: 0,
      cta: false,
      ctd: false,
      hasUserSetting: true
    }
  }
  try {
    await dispatch(setAvailabilityCalendar(newAvailabilityCalendar));
    if (quantity == 0) {
      await dispatch(updateRoomAvailability(roomId, false, date, hasChannelManager));
      showNotification({message: 'Saved'});
      return;
    }
    if (! oldAvailability) {
      await dispatch(updateRoomAvailability(roomId, true, date));
      showNotification({message: 'Saved'});
      return;
    }
    showNotification({message: 'Saved'});
  } catch (error) {
    showNotification({message: 'Could not save'});
  }
}

export const updateRoomAvailability = (roomId, isAvailable, date, hasChannelManager) => async (dispatch, getState) => {
  const {
    rooms: {
      availabilityCalendar
    },
    property: {
      property: {
        objectId
      }
    },
    settings: {
      locale: {
        locale
      }
    }
  } = getState();
  try {
    await updateRoomAvailabilityViaAPI(roomId, objectId, isAvailable, date);
  } catch (error) {
    showNotification({message: error.message ? error.message : 'Could not save'});
    return;
  }
  
  const day = date.format('MM-DD-YYYY');
  let newAvailabilityCalendar = {...availabilityCalendar};
  const oldQuantity = availabilityCalendar[day] ? availabilityCalendar[day]['quantity'] : 0;
  if (hasChannelManager) {
    const updateDay = date.format('YYYY-MM-DD');
    updateUserCalendarSettings({objectId, roomId, errorLang: locale, fromDate: updateDay, toDate: updateDay, status: true});
  }
  if (availabilityCalendar[day]) {
    newAvailabilityCalendar[day]['isClosed'] = !isAvailable;
    newAvailabilityCalendar[day]['hasUserSetting'] = true;
  } else {
    newAvailabilityCalendar[day] = {
      isClosed: !isAvailable,
      quantity: isAvailable ? 1 : 0,
      date: day,
      price: 0,
      cta: false,
      ctd: false,
      hasUserSetting: true
    }
  }
  try {
    await dispatch(setAvailabilityCalendar(newAvailabilityCalendar));
    if (isAvailable && 0 == oldQuantity) {
      await dispatch(changeQuantityOnAvailabilityCalendar(roomId, 1, date, hasChannelManager));
      showNotification({message: 'Saved'});
      return;
    }
    showNotification({message: 'Saved'});
  } catch (error) {
    showNotification({message: 'Could not save'});
  }
  
}

export const reloadRoomAvailability = (roomId, date) => async (dispatch, getState) => {
  const {
    rooms: {
      availabilityCalendar
    },
    property: {
      property: {
        objectId
      }
    },
    settings: {
      locale: {
        locale
      }
    }
  } = getState();
  let newAvailabilityCalendar = {...availabilityCalendar};
  const day = date.format('MM-DD-YYYY');
  const updateDay = date.format('YYYY-MM-DD');
  updateUserCalendarSettings({objectId, roomId, errorLang: locale, fromDate: updateDay, toDate: updateDay, status: false});
  newAvailabilityCalendar[day]['hasUserSetting'] = false;
  await dispatch(setAvailabilityCalendar(newAvailabilityCalendar));
}