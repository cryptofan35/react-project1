import { 
  listTemplatesXML, 
  XMLTemplatesFormatting, 
  ObjectMetaData, 
  savePackageXML, 
  packageDetailsXML, 
  XMLPackageDetailFormatting, 
  packageCalendarXML, 
  XMLPackageCalendarFormatting,
  offerCreationXML,
  templateDetailsXML,
  XMLTemplateDetailsFormatting,
  templatePreviewXML,
  XMLTemplatePreviewFormatting,
  invalidSavePackageResponseXML,
  inventoryFetcherXML, 
  XMLDataInventoryFetcher
 } from "../constants/xmlBody";
import { cultbayChannelWebServicesApi } from "../util/Api";
import { parseString } from "xml2js";
import axios, { placeHoldersApi } from "util/Api";
import { AuthenticationCode, AgentDutyCode, AgentSine  } from "constants/GlobalConstants"
import moment from "moment"

const fetchPackagesList = async ({objectId, errorLang, offset, limit}) => {
  const payload = listTemplatesXML({objectId, errorLang, offset, limit});
  const response = await cultbayChannelWebServicesApi.post("/ListOfTemplates", payload);
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) {
        return reject(err);
      }
      
      return resolve(XMLTemplatesFormatting(result));
    })
  })

};

const fetchSellerAccounts = async ({objectId, siteId, errorLang}) => {
  const payload = ObjectMetaData({
    authenticationCode: AuthenticationCode,
    sourceId: 2,
    channelId: 1,
    objectId,
    siteId,
    errorLang,
    requestParameters: "SellerAccounts"
  });
  const response = await cultbayChannelWebServicesApi.post("/ObjectMetaData", payload);
  if (response.data.sellerAccounts) {
    return response.data.sellerAccounts.sellerAccount;
  }
  return [];
}

const createPackage = async ({objectId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, availabilityPrice, calendarOffer, description, voucherDescription, imageUrls, marketPlaceCurrencyCode, propertyCurrencyCode}) => {
  const payload = savePackageXML({objectId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, availabilityPrice, calendarOffer, description, voucherDescription, imageUrls, marketPlaceCurrencyCode, propertyCurrencyCode});
  try {
    await axios.post("https://api.cultbay.com/ProductsAndRooms/products/create", payload, {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidSavePackageResponseXML(result);

        throw new Error(message);
      })
    });
  }
  

}

const updatePackage = async ({objectId, packageId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, availabilityPrice, calendarOffer, description, voucherDescription, imageUrls, marketPlaceCurrencyCode, propertyCurrencyCode}) => {
  const payload = savePackageXML({objectId, packageId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, availabilityPrice, calendarOffer, description, voucherDescription, imageUrls, marketPlaceCurrencyCode, propertyCurrencyCode});
  try {
    await axios.post("https://api.cultbay.com/ProductsAndRooms/products/create", payload, {
      headers: {
        'Content-Type': 'application/xml',
        'Agentdutycode': AgentDutyCode,
        'Agentsine': AgentSine
      }
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      parseString(error.response.data, (err, result) => {
        if (err) {
          return reject(err);
        }
        const {message} = invalidSavePackageResponseXML(result);

        throw new Error(message);
      })
    });
  }

}

const fetchPackageDetails = async ({objectId, packageId}) => {
  const payload = packageDetailsXML({objectId, packageId});
  const response = await axios.post("https://api.cultbay.com/ProductsAndRooms/products/pull", payload, {
    headers: {
      'Content-Type': 'application/xml',
      'Agentdutycode': AgentDutyCode,
      'Agentsine': AgentSine
    }
  });
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        error: null,
        data: XMLPackageDetailFormatting(result)
      })
    })

  })
};

const createOffer = async ({objectId, errorLang, marketPlaceId, currency, templateId, listingType, listingDuration, startTime, price, retailPrice, offerRepeat}) => {
  const payload = offerCreationXML({objectId, errorLang, marketPlaceId, currency, templateId, listingType, listingDuration, startTime, price, retailPrice, offerRepeat});
  const response = await cultbayChannelWebServicesApi.post("/OfferCreation", payload, {
    headers: {
      'Content-Type': 'application/xml',
    }
  });
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (result.OfferCreationRS.Ack[0] !== 'Success') {
        const errorMessages = result.OfferCreationRS.Errors[0].Error.map((error) => error.ErrorMessage[0]);
        return reject(errorMessages.join(' - '));
      }

      return resolve();
    })
  })
  
}

const fetchTemplateDetails = async ({objectId, templateId, errorLang}) => {
  const payload = templateDetailsXML({objectId, templateId, errorLang});
  const response = await cultbayChannelWebServicesApi.post("/detailsTemplate", payload, {
    headers: {
      'Content-Type': 'application/xml',
    }
  });
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) {
        return reject(err);
      }

      const details = XMLTemplateDetailsFormatting(result);
      return resolve(details);

    })
  })
}

const fetchTemplatePreview = async ({objectId, packageId, templateId, roomId, errorLang}) => {
  const url = `/offers/replace/property/${objectId}/package/${packageId}/template/${templateId}/room/${roomId}/lang/${errorLang}`;
  const response = await placeHoldersApi.get(url);
  return response.data.html;
}

const getAvailabilityStatus = async ({productId, fromDate, endDate}) => {
  const response = await axios.get("https://api.cultbay.com/InventoryRatesServices/inventory/availabilitystatus", {
    params: {
      fromdate: fromDate,
      enddate: endDate,
      productid: productId
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data.availData;
}

const getAvailabilityStatuses = async (productIds) => {
  const fromDate = moment().format("YYYY-MM-DD")
  const endDate = moment().add(3, 'years').subtract(1, 'days').format("YYYY-MM-DD")
  const statuses = await Promise.all(productIds.map(productId => getAvailabilityStatus({productId, fromDate, endDate})));
  return productIds.reduce((map, productId, index) => {
    map[productId] = statuses[index];
    return map;
  }, {});
}

const fetchInventory = async ({objectId, basicProductInfo}) => {
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
  const result = await new Promise((resolve, reject) => parseString(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));
  parsedResult = XMLDataInventoryFetcher(result, basicProductInfo);
  const productIds = parsedResult.map(({id}) => parseInt(id));
  return productIds.reduce((map, productId, index) => {
    map[productId] = parsedResult[index];
    return map;
  }, {});
}

export {
  fetchPackagesList,
  fetchPackageDetails,
  fetchSellerAccounts,
  createPackage,
  updatePackage,
  createOffer,
  fetchTemplateDetails,
  fetchTemplatePreview,
  getAvailabilityStatus,
  getAvailabilityStatuses,
  fetchInventory
}