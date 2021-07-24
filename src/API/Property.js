import * as xmlBodies from "../constants/xml/xmlProperty";
import * as xmlTypes from "../constants/xmlTypes";
import axios from "axios";
import baseAPI, {cultbayChannelWebServicesApi} from "util/Api";
import { parseString } from "xml2js";
import {
  listOfDesignTemplatesXMLRequest,
  formatDesignTemplatesXMLResponse,
  savePropertyImagesXMLRequest,
  formatSavePropertyImagesXMLResponse
 } from "../constants/xmlBody";
import { AgentDutyCode, AgentSine, AuthenticationCode } from "../constants/GlobalConstants";
import { XMLDataFormatting } from "../constants/xml/xmlProperty";
import amenityCategories from '../constants/AmenityCategories';

const updateList = {
  [xmlTypes.HOTEL_NAME]: (values) => xmlBodies.updateNameXML(values),
  [xmlTypes.UPDATE_NAMEADDRESS]: (values) => xmlBodies.updateNameAddress(values),
  [xmlTypes.BILLING_ADDRESS]: (values) => xmlBodies.billingAddress(values),
  [xmlTypes.LEGAL_ADDRESS]: (values) => xmlBodies.legalAddress(values),
  [xmlTypes.DESCRIPTION]: (values) => xmlBodies.description(values),
  [xmlTypes.AMENITIES]: (values) => xmlBodies.amenities(values),
  //[xmlTypes.IMAGES]: (values) => images(values),
};

const profileCreate = values => {
  return axios.post('https://api.cultbay.com/HotelDataServices/HotelData/ProfileCreate',
    xmlBodies.address(values),
    {headers:
        {'Content-Type': 'application/xml', 'Agentdutycode': AgentDutyCode, 'Agentsine': AgentSine}
    })
    .then(res => {
      return new Promise((resolve, reject) => {
        parseString(res.data, (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result.OTA_ProfileCreateRS.UniqueID[0]['$'].ID);
        });
      });
    })
    .catch(err=>{
      console.error('Error creating property', err);
      return {error:'Error creating property'};
    });
};

const updatePropertyXML = (values, type) => {
  return axios.post('https://api.cultbay.com/HotelDataServices/HotelData/HotelDescriptive',
    updateList[type](values),
    {headers:
        {'Content-Type': 'application/xml', 'Agentdutycode': AgentDutyCode, 'Agentsine': AgentSine}
    })
    .then(res => {
      return new Promise((resolve, reject) => {
        parseString(res.data, (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve({status:'Success', result:values});
        });
      });
    })
    .catch(err=>{
      console.error('Error updating property data', err);
      return {error:'Error updating property data'};
    });
};

const fetchPropertyXML = objectId => {
  return axios.post('https://api.cultbay.com/HotelDataServices/HotelData/HotelDescriptiveInfo',
    xmlBodies.getProperty(objectId),
    {headers:
        {'Content-Type': 'application/xml', 'Agentdutycode': AgentDutyCode, 'Agentsine': AgentSine}
    })
    .then(res => {
      return new Promise((resolve, reject) => {
        parseString(res.data, (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(XMLDataFormatting(result));
        });
      });
    })
    .catch(err=>{
      console.error('Error fetching property data', err);
      return {error:'Error fetching property data'};
    });
};


const fetchAmenities = async ({userLanguageId}) => {
  try {
    const requestPromises = amenityCategories.map(({id, name}) => {
      return baseAPI.get(`/${id}/amenities`);
    })

    const response = await Promise.all(requestPromises);

    const flattedAmenitiesArray = response.reduce((acc, value) => {
      const visibleAmenities = value.data.filter(amenity => amenity.visible && amenity.languageId === userLanguageId);

      return [...acc, ...visibleAmenities]
    }, []);

    return flattedAmenitiesArray;

  } catch (err) {
    console.error('Error fetching amenities', err);
    return {error:'Error fetching amenities'};
  }

}

const fetchDesignTemplates = async ({objectId, errorLang}) => {
  const payload = listOfDesignTemplatesXMLRequest({objectId, errorLang});
  const response = await cultbayChannelWebServicesApi.post("/ListOfDesignTemplates", payload);
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) {
        return reject(err);
      }

      const languageMap = {
        "de": 1,
        "en": 2,
      }

      const designTemplates = formatDesignTemplatesXMLResponse({objectId, languageId: languageMap[errorLang] || 2, response: result,});
      return resolve(designTemplates);

    })
  })
}

const saveDesignTemplateDetail = async ({objectId, designTemplateId, languageId, footerImageUrl}) => {
  if (footerImageUrl && footerImageUrl.search('http') !== 0) {
    footerImageUrl = 'https:' + footerImageUrl;
  }
  if (! footerImageUrl) {
    footerImageUrl = '';
  }
  const payload = {
    activeStatus: true,
    authenticationCode: AuthenticationCode,
    bezeichnung: languageId === 'eng' ? 'CultbayDefaultTemplate_EN' : 'CultbayDefaultTemplate_DE',
    category: null,
    cusebeda_objekt_id: objectId,
    designTemplate: languageId === 'eng' ? 'template_740.html' : 'template_741.html',
    footer_url: footerImageUrl,
    header_url: null,
    id: designTemplateId || 0,
    langId: languageId === 'eng' ? 2 : 1,
    sampledesign: null,
    tempcatstatus: false,
    templatechangeflag: false
  };
  await axios.post("https://ws.cultbay.com/ChannelWS/CultbayChannelWSs/designTemplateDetails", payload);
}

const saveImages = async ({objectId, imageUrlsByCaptionCode}) => {
  const payload = savePropertyImagesXMLRequest({objectId, imageUrlsByCaptionCode});
  const response = await axios.post("https://api.cultbay.com/HotelDataServices/HotelData/HotelDescriptive", payload, {
    headers: {'Content-Type': 'application/xml', 'Agentdutycode': AgentDutyCode, 'Agentsine': AgentSine}
  });
  return new Promise((resolve, reject) => {
    parseString(response.data, (err, parsedResponse) => {
      if (err) {
        return reject(err);
      }

      const { result } = formatSavePropertyImagesXMLResponse(parsedResponse);
      if (result) {
        return resolve (result);
      }

      return reject();
    })
  });
}

const createProfileWithCurrency = async ({currency, propertyName}) => {
  const payload = xmlBodies.createProfileWithCurrencyXML({currency, propertyName});
  const response = await axios.post('https://api.cultbay.com/HotelDataServices/HotelData/ProfileCreate', payload, {
    headers: {
      'Content-Type': 'application/xml',
      'Agentdutycode': AgentDutyCode, 
      'Agentsine': AgentSine
    }
  });
  return new Promise((resolve, reject) => parseString(response.data, (err, result) => {
    if (err) {
      return reject(err);
    }
    resolve(result.OTA_ProfileCreateRS.UniqueID[0]['$'].ID);
  })); 
}

export {
  fetchAmenities,
  profileCreate,
  updatePropertyXML,
  fetchPropertyXML,
  fetchDesignTemplates,
  saveDesignTemplateDetail,
  saveImages,
  createProfileWithCurrency
}
