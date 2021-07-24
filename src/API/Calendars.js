// import { PACKAGES } from "../mocks/Calendar/Packages";
import { showNotification } from "../util/notifications";
import {
  inventoryFetcherXML,
  XMLDataInventoryFetcher,
  inventoryReceiverXML,
  productPullXML,
  XMLDataBasicProductPull,
  ratesReceiverXML,
  invalidInventoryReceiverResponseXML,
  invalidRatesReceiverResponseXML,
  inventoryFetcherByRoomRequestXML
} from "../constants/xmlBody";
import { AgentDutyCode, AgentSine, AuthenticationCode  } from "../constants/GlobalConstants";
import axios from 'axios';
import xml2js from 'xml2js';
import { parseString } from "xml2js";
import moment from "moment";
import { getAvailabilityStatuses, fetchInventory } from "API/Packages";
import { cultbayApi } from "util/Api";

export const fetchCalendarPackages = async (objectId) => {
  const parser = new xml2js.Parser();
  const packagesPayload = productPullXML(objectId);

  const {data : packagesData} = await axios.post('https://api.cultbay.com/ProductsAndRooms/products/pull',
    packagesPayload,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    }
  );

  const packagesResult = await new Promise((resolve, reject) => parser.parseString(packagesData, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

  const basicProductInfo = XMLDataBasicProductPull(packagesResult);
  const payload = inventoryFetcherXML({objectId});
  const { data } = await axios.post('https://api.cultbay.com/InventoryRatesServices/inventory/fetcher',
    payload,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    }
  );

  let parsedResult = [];
  const result = await new Promise((resolve, reject) => parser.parseString(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));
  parsedResult = XMLDataInventoryFetcher(result, basicProductInfo);
  return parsedResult;
};

export const fetchCalendarPackagesFromAvailabilityStatus = async (objectId, pageIndex = 0, itemsPerPage = 10) => {
  const parser = new xml2js.Parser();
  const packagesPayload = productPullXML(objectId);

  const {data : packagesData} = await axios.post('https://api.cultbay.com/ProductsAndRooms/products/pull',
    packagesPayload,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    }
  );

  const packagesResult = await new Promise((resolve, reject) => parser.parseString(packagesData, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

  const basicProductInfo = XMLDataBasicProductPull(packagesResult);
  const productIds = Object.keys(basicProductInfo);

  const paginatedProductIds =  productIds.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage);

  const [availabilityStatuses, inventoryFetcherResponse] = await Promise.all([
    getAvailabilityStatuses(paginatedProductIds),
    fetchInventory({objectId, basicProductInfo})
  ]);

  const parsedResult = productIds.map(productId => ({
    id: productId,
    name: basicProductInfo[productId]['ProductName'],
    roomID: null,
    reservedDates: availabilityStatuses[productId] && Object.keys(availabilityStatuses[productId])
      .map(date => {
        const inventoryForPackage = inventoryFetcherResponse[productId] || null;
        const reservedDates = inventoryForPackage ? inventoryForPackage.reservedDates : [];
        const quantityForDate = reservedDates.reduce((sum, {date: dateInReservedDates, isClosed, quantity}) => {
          if (moment(dateInReservedDates, "MM-DD-YYYY").format("MM-DD-YYYY") !== moment(date, "YYYY-MM-DD").format("MM-DD-YYYY") || isClosed) {
            return sum;
          }
          return sum + quantity;
        }, 0);
        return {
          cta: false,
          ctd: false,
          date: moment(date).format("MM-DD-YYYY"),
          isClosed: availabilityStatuses[productId][date] ? false : true,
          price: 0,
          quantity: quantityForDate
        };
      })
  }));

  return parsedResult;
};


export const updatePackageDate = async (id, date, isAvailable, roomID, objectId, quantity) => {
  const requestProps = {
    id,
    startDate: moment(date, 'MM-DD-YYYY'),
    endDate: moment(date, 'MM-DD-YYYY'),
    isAvailable,
    roomID,
    availability: quantity,
    selectedDays: [],
    price: null,
    cta: null,
    ctd: null,
    objectId,
    currency: null,
  };

  const payload = inventoryReceiverXML(requestProps);

  try {
    await axios.post('https://api.cultbay.com/InventoryRatesServices/inventory/receiver',
      payload,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Agentdutycode': AgentDutyCode,
          'Agentsine': AgentSine
        }
      }
    );

    return { id, date };

  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidInventoryReceiverResponseXML(result);

        throw new Error(message);
      })
    });
  }
};

export const updatePackageData = async (id, data, roomID, objectId, currency) => {
  const { date, key, value } = data;

  const startDate = moment(date, 'MM-DD-YYYY');
  const endDate = moment(date, 'MM-DD-YYYY');
  const selectedDays = [];
  let availability = null;
  let price = null;
  let cta = null;
  let ctd = null;
  let isAvailable = null;

  switch (key) {
    case 'quantity':
      availability = value;
    break;
    case 'price':
      price = value;
    break;
    case 'cta':
      cta = value;
    break;
    case 'ctd':
      ctd = value;
    break;
    case 'isClosed':
      isAvailable = !value;
    break;
  }

  const requestProps = {id, startDate, endDate, isAvailable, roomID, availability, selectedDays, price, cta, ctd, objectId, currency};
  const receiverPayload = inventoryReceiverXML(requestProps);

  const requestHeaders = {
    'Content-Type': 'application/xml',
    'Agentdutycode': AgentDutyCode,
    'Agentsine': AgentSine
  }

  try {

    const resultReceiver = await axios.post('https://api.cultbay.com/InventoryRatesServices/inventory/receiver',
      receiverPayload,
      {
        headers: requestHeaders
      }
    );

  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidInventoryReceiverResponseXML(result);

        throw new Error(message);
      })
    });
  }

  if (key === 'price') {


    try {
      const receiverPayload = ratesReceiverXML(requestProps);
      await axios.post('https://api.cultbay.com/InventoryRatesServices/rates/receiver',
        receiverPayload,
        {
          headers: requestHeaders
        }
      );
    } catch(error) {
      return new Promise((resolve, reject) => {
        parseString(error.response.data, (err, result) => {
          if (err) {
            return reject(err);
          }
          const {message} = invalidRatesReceiverResponseXML(result);

          throw new Error(message);
        })
      });
    }
  }

  return { id, data, roomID };
};

export const updateQuickly = async ({
  rooms,
  period,
  selectedDays,
  availability,
  objectId,
  closed,
  hasChannelManager
}) => {
  const requestPromises = rooms.map(roomId => {
    const requestProps = {
      roomId,
      startDate: period[0],
      endDate: period[1],
      isAvailable: !closed,
      availability,
      selectedDays,
      cta: null,
      ctd: null,
      objectId,
    }
    const receiverPayload = inventoryReceiverXML(requestProps);
    const requestHeader = {
      'Content-Type': 'application/xml',
      'Agentdutycode': AgentDutyCode,
      'Agentsine': AgentSine
    }

    const resultPromises = [];

    if (availability) {
      const receiverPromise = axios.post('https://api.cultbay.com/InventoryRatesServices/inventory/receiver',
        receiverPayload,
        {
          headers: requestHeader
        }
      );

      resultPromises.push(receiverPromise);
    }

    return resultPromises;
  });

  let showingError = false;

  //Run promises of all packages at once
  const results = await Promise.all(requestPromises.flat().map(p => p.catch(error => {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = result.OTA_HotelRatePlanNotifRS
          ? invalidRatesReceiverResponseXML(result)
          : invalidInventoryReceiverResponseXML(result);
        if (!showingError) {
          showingError = true;
          showNotification({ message });
        }
      })
    });
  })));

  if (hasChannelManager) {
    const userSettingsRequestPromises = rooms.map(roomId => updateUserCalendarSettings({
      objectId,
      roomId,
      errorLang: 'en',
      fromDate: period[0].format('YYYY-MM-DD'),
      toDate: period[1].format('YYYY-MM-DD'),
      status: true
    }));
    try {
      await Promise.all(userSettingsRequestPromises)
    } catch (error) {
      showNotification({message: 'Could not update'});
      return;
    }
  }

  //const validResults = results.filter(result => !(result instanceof Error));

  showNotification({ message: 'Updated' });
}

export const fetchCalendarByRoom = async ({roomId, startDate, endDate}) => {
  const payload = inventoryFetcherByRoomRequestXML({roomId, startDate, endDate});
  const { data } = await axios.post('https://api.cultbay.com/InventoryRatesServices/inventory/fetcher',
    payload,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    }
  );
  const parser = new xml2js.Parser();
  const result = await new Promise((resolve, reject) => parser.parseString(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));
  return XMLDataInventoryFetcher(result);
}

export const updateRoomQuantity = async (roomId, objectId, quantity, date) => {
  const startDate = moment(date, 'MM-DD-YYYY');
  const endDate = moment(date, 'MM-DD-YYYY');
  const payload = inventoryReceiverXML({
    startDate,
    endDate,
    availability: quantity,
    roomId,
    cta: null,
    ctd: null,
    objectId
  });
  const requestHeaders = {
    'Content-Type': 'application/xml',
    'Agentdutycode': AgentDutyCode,
    'Agentsine': AgentSine
  }
  try {
    await axios.post(
      'https://api.cultbay.com/InventoryRatesServices/inventory/receiver',
      payload,
      {
        headers: requestHeaders
      }
    );
  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidInventoryReceiverResponseXML(result);

        throw new Error(message);
      })
    });
  }
}

export const updateRoomAvailability = async (roomId, objectId, isAvailable, date) => {
  const startDate = moment(date, 'MM-DD-YYYY');
  const endDate = moment(date, 'MM-DD-YYYY');
  const payload = inventoryReceiverXML({
    startDate,
    endDate,
    isAvailable,
    roomId,
    cta: null,
    ctd: null,
    objectId
  });
  const requestHeaders = {
    'Content-Type': 'application/xml',
    'Agentdutycode': AgentDutyCode,
    'Agentsine': AgentSine
  }
  try {
    await axios.post(
      'https://api.cultbay.com/InventoryRatesServices/inventory/receiver',
      payload,
      {
        headers: requestHeaders
      }
    );
  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidInventoryReceiverResponseXML(result);

        throw new Error(message);
      })
    });
  }
}

export const getUserCalendarSettings = async ({objectId, roomId, errorLang}) => {
  const payload = {
    authenticationCode: AuthenticationCode,
    objectId,
    roomId,
    errorLang
  };
  const response = await cultbayApi.post("/getUserCalendarSettings", payload);
  return response.data.rooms ? response.data.rooms : [];
}

export const updateUserCalendarSettings = ({objectId, roomId, errorLang, fromDate, toDate, status}) => {
  const payload = {
    authenticationCode: AuthenticationCode,
    objectId,
    roomId,
    errorLang,
    fromDate,
    toDate,
    status
  };
  return cultbayApi.post("/userCalendarSettings", payload);
}
