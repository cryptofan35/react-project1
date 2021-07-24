import {
  GET_EBAY_SETTINGS,SET_INITIAL_EBAY_SETTINGS, CHANGE_EBAY_SETTINGS, ADD_MARKET_PLACE,
  REMOVE_MARKET_PLACE, ADD_EMAIL_ITEM,
  GET_CONFIG_DETAILS, CHANGE_FAQ, CHANGE_TC,
  GET_EBAY_OFFERS, GET_EBAY_OFFERS_LOADING, STOP_EBAY_OFFER, REMOVE_EBAY_OFFER,
  GET_EBAY_MESSAGES, GET_EBAY_MESSAGES_LOADING, ARCHIVE_EBAY_MESSAGE,
  GET_EBAY_ARCHIVE_MAILS, RESET_EBAY_ARCHIVE_MAILS, CHANGE_REPUTIZE, GET_DEFAULT_FAQ_TC, SET_TOKEN_STATUS, SET_NOTIFICATION_MESSAGE, SET_SESSION_ID, SET_USERNAME, SET_TOTAL_OFFER_COUNT
} from "../../constants/ActionTypes";
import {
  fetchEbaySettings, updateEbaySettings, deleteMarketPlace, fetchConfigDetails, updateFAQ,
  fetchEbayOffers, stopOffer, deleteOffer, getMessages, fetchDefaultFAQandTC,
  archiveMessage, sendAnswer, fetchArchiveMails, updateEmailSettings, updateTC, updateReputize,
  getTokenStatus as getTokenStatusByApi, setToken as setTokenByApi, getSessionId as getSessionIdByApi, fetchToken as fetchTokenByApi
} from "../../API/Ebay";
import { showNotification } from "../../util/notifications";
import { parseString } from 'xml2js';
import { fetchStart, fetchSuccess, fetchError, setNotificationMessage } from './Common';
import moment from 'moment';

export const getEbaySettings = (objectId) => async dispatch => {
  try {
    dispatch(fetchStart());
    const settings = await fetchEbaySettings(objectId);
    dispatch(fetchSuccess());
    dispatch({
      type: GET_EBAY_SETTINGS,
      payload: { settings }
    });
  } catch (error) {
    console.log('Could not get ebay settings. Error: ', error);
    dispatch(fetchError());
  }
};


export const setInitialEbaySettings = () => dispatch => {
  return dispatch({
    type: SET_INITIAL_EBAY_SETTINGS
  })
};

export const changeEbaySettings = (data) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;

  return updateEbaySettings(data, objectId).then((response) => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: CHANGE_EBAY_SETTINGS,
      payload: { data }
    })
  })
};



export const changeReputize = (objectId, data) => dispatch => {
  return updateReputize(objectId, data).then((data) => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: CHANGE_REPUTIZE,
      payload: data
    })
  })
};


export const changeEmailSettings = (data) => dispatch => {
  return updateEmailSettings(data).then((data) => {
    showNotification({ message: 'Saved' });
  })
  .catch(err => console.log(err))
  .finally(() => {
    return dispatch({
      type: CHANGE_EBAY_SETTINGS,
      payload: { data }
    })
  })
}

export const updatedEmailSettings = (data) => dispatch => {
  return dispatch({
    type: CHANGE_EBAY_SETTINGS,
    payload: { data }
  })
}


export const addMarketPlace = (accountID, accountType) => {
  return {
    type: ADD_MARKET_PLACE,
    payload: { accountID, accountType }
  }
};

export const setSessionId = (sessionId) => dispatch => {
  return dispatch({
    type: SET_SESSION_ID,
    payload: sessionId
  })
}


export const removeMarketPlace = (accountID, marketPlaceID, marketPlaces) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;

  return deleteMarketPlace(accountID, marketPlaceID, marketPlaces, objectId).then(() => {
    showNotification({ message: 'Removed' });
    return dispatch({
      type: REMOVE_MARKET_PLACE,
      payload: { accountID, marketPlaceID }
    })
  })
};

export const addEmailItem = () => {
  return {
    type: ADD_EMAIL_ITEM
  }
};


export const getConfigDetails =  (objectId) => async dispatch => {
  try {
    dispatch(fetchStart());
    const data = await fetchConfigDetails(objectId);
    dispatch(fetchSuccess());
    dispatch({
      type: GET_CONFIG_DETAILS,
      payload: data
    });
    return data;
  } catch (error) {
    console.log('Could not get config details. Error: ', error);
    dispatch(fetchError());
  }

};

export const getDefaultFAQandTC = (objectId) => async dispatch => {
  return await fetchDefaultFAQandTC(objectId).then((data) => {
    dispatch({
      type: GET_DEFAULT_FAQ_TC,
      payload: data
    })
  })
}


export const updateFAQList = (items) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
   
  return updateFAQ(objectId, items).then(() => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: CHANGE_FAQ,
      payload: items
    })
  })
};


export const updateTCList = (items) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
   
  return updateTC(objectId, items).then(() => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: CHANGE_TC,
      payload: items
    })
  })
};


export const getOffersList = ({status}) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
  dispatch({type: GET_EBAY_OFFERS_LOADING, payload: true})

  return fetchEbayOffers({objectId, status}).then((response) => {
    let offers = null;
    
    parseString(response.data, (err, result) => {
      offers = result.ListOfOffersRS.Offers[0].Offer; 
    })

    const temp = offers;

    if (temp) {
      temp.forEach(item => {
        item.name = item.Title;
        item.price = item.Price;
        item.visits = item.NoOfViews;
        item.id = item.Id;
      })
  
      offers = temp;
    } else {
      offers = []
    }

    dispatch({type: GET_EBAY_OFFERS_LOADING, payload: false})
    return dispatch({
      type: GET_EBAY_OFFERS,
      payload: { offers }
    })
  })
};

export const getTotalOfferCount = () => async (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
  
  const response = await fetchEbayOffers({objectId});
  const offers = await new Promise((resolve, reject) => parseString(response.data, (err, result) => {
    if (err) reject(err);
    else resolve(result.ListOfOffersRS.Offers[0].Offer);
  }));
  dispatch({type: SET_TOTAL_OFFER_COUNT, payload: offers ? offers.length : 0});
}

export const stopRunningOffer = (id, itemId) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;

  return stopOffer(objectId, id, itemId).then(() => {
    showNotification({ message: 'Saved' });
    return dispatch({
      type: STOP_EBAY_OFFER,
      payload: { id },
    })
  })
};

export const removeOffer = id => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;

  return deleteOffer(objectId, id).then(() => {
    showNotification({ message: 'Removed' });
    return dispatch({
      type: REMOVE_EBAY_OFFER,
      payload: { id },
    })
  })
};



export const getEbayMessages = (options) => async ( dispatch, getState ) => {
  await dispatch({type: GET_EBAY_MESSAGES_LOADING, payload: options});
  return getMessages(options).then((response) => {
    return dispatch({
      type: GET_EBAY_MESSAGES,
      payload: response,
    })
  }).catch((err)=>{
    console.log(err);
  })
};


export const archiveEbayMessage = (messageID, buyerId, question) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
  return archiveMessage(messageID, objectId, buyerId, question).then(() => {
    showNotification({ message: 'Archived' });
    return dispatch({
      type: ARCHIVE_EBAY_MESSAGE,
      payload: { id: messageID }
    })
  })
};

export const answerEbayQuestion = (historyID, messageID, answer, buyerId, question) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;
  
  return sendAnswer(historyID, messageID, answer, objectId, buyerId, question).then(() => {
    showNotification({ message: 'Answered' });
    return dispatch({
      type: ARCHIVE_EBAY_MESSAGE,
      payload: { id: historyID }
    })
  })
};

export const getEbayArchiveMails = (itemID, withContent) => (dispatch, getState) => {
  const { property } = getState();
  const objectId = property && property.property && property.property.objectId;
  if(!objectId) return;

  return fetchArchiveMails(itemID, objectId, withContent).then((response) => {
    const mails = response.data;

    return dispatch({
      type: GET_EBAY_ARCHIVE_MAILS,
      payload: { mails },
    })
  })
};

export const resetEbayArchiveMails = () => {
  return {
    type: RESET_EBAY_ARCHIVE_MAILS
  }
};

export const getTokenStatus = () => async (dispatch, getState) => {
  const { 
    property: {
      property: {
        objectId
      }
    }
  } = getState();
  try {
    dispatch(fetchStart());
    const response = await getTokenStatusByApi(objectId);
    await dispatch({
      type: SET_TOKEN_STATUS,
      payload: response.data
    })
    dispatch(fetchSuccess());
    const {
      ebay: {
        tokenStatus
      }
    } = getState();
    if (tokenStatus && tokenStatus.isTokenSet) {
      dispatch(setNotificationMessage());
    }
  } catch (error) {
    const data = error.response.data
    dispatch({
      type: SET_TOKEN_STATUS,
      payload: data
    })
    if (data.error && data.error[0] && data.error[0]['error']) {
      dispatch(setNotificationMessage('Error', data.error[0]['error']))
    }
    dispatch(fetchError());
  }
  
}

export const setTokenStatus = (token, expiryDate, tokenStatus) => async (dispatch, getState) => {
  const { 
    property: {
      property: {
        objectId
      }
    }
  } = getState();
  dispatch(fetchStart());
  await setTokenByApi({token, expiryDate, objectId, tokenStatus});
  dispatch(fetchSuccess());
  dispatch(getTokenStatus());
}

export const getSessionId = (siteId = 0) => async (dispatch, getState) => {
  const {
    settings: {
      locale: {
        languageId
      }
    }
  } = getState();
  dispatch(fetchStart());
  const sessionId = await getSessionIdByApi({languageId, siteId});
  dispatch(fetchSuccess());
  dispatch(setSessionId(sessionId));
}

export const fetchToken = (siteId = 0) => async (dispatch, getState) => {
  const {
    settings: {
      locale: {
        languageId
      }
    }
  } = getState();
  const sessionId = window.localStorage.getItem('sessionId');
  if ('null' === sessionId || null === sessionId) {
    return;
  }
  dispatch(fetchStart());
  const tokenData = await fetchTokenByApi({languageId, sessionId, siteId});
  dispatch(setTokenStatus(tokenData.token, moment(tokenData.expiryDate).format('YYYY-MM-DD hh:mm:ss'), 1));
  dispatch(setSessionId(null));
  dispatch(fetchSuccess());
}