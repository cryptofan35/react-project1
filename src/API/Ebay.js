import axios from "axios";
import { EBAY_SETTINGS_DATA } from "../mocks/Ebay/settings";
import { FAQ_DATA } from "../mocks/Ebay/faq";
import { TC_DATA } from "../mocks/Ebay/t&c";
import { OFFERS } from "../mocks/Ebay/offers";
import { EBAY_MESSAGES } from "../mocks/Ebay/messages";
import { ARCHIVE_MAILS } from "../mocks/Ebay/archive";
import { AgentDutyCode, AgentSine, AuthenticationCode } from '../constants/GlobalConstants';
import { MARKET_PLACES } from "../constants/Ebay/marketPlaces";
import { PAYMENT_ACCOUNTS } from '../mocks/Ebay/settings';
import { parseString } from 'xml2js';
import { cultbayChannelWebServicesApi } from "util/Api";
import { objectConfigDetailsFetcherXML, updateFAQItemXML, updateTCItemXML, reputizeXML, offersXML, stopOfferXML, deleteOfferXML, memberMessageXML, sendAnswerXML, paymentXML, answerMessageXML } from '../constants/xmlBody';
import api from "util/Api";


const headers = {
  headers: {
    'Agentdutycode': AgentDutyCode,
    'Agentsine': AgentSine,
  }
}

const headersJSON = {
  headers: {
    "Content-Type": "application/json",
    // 'Agentdutycode': AgentDutyCode,
    // 'Agentsine': AgentSine,
  }
}

const headersJSON_xml = {
  headers: {
    "Content-Type": "application/xml",
    // 'Agentdutycode': AgentDutyCode,
    // 'Agentsine': AgentSine,
  }
}

const getTnCAdditionalFieldsName = (key,lang) => {
  switch(key){
    case 'CheckoutService': {
      return lang=='en' ? 'Checkout Service' : 'Angebotsabwicklung/Check-Out';
    }
    case 'StandardBusinessTerms': {
      return lang=='en' ? 'Standard Business Terms' : 'Standard Geschäftsbedingungen';
    }
    case 'PaymentService': {
      return lang=='en' ? 'Payment Service' : 'Zahlungsabwicklung';
    }
    case 'VoucherService': {
      return lang=='en' ? 'Voucher Service' : 'Gutschein/Versand';
    }
  }
};

const formatFaq = (data) => {
  try {
    let formattedFaq = data.InformationTypes[0].FAQ[0].Value
      .filter(Boolean)
      .map(item => ({
        answer: { en: item.$.language === 'en'? item._.replaceAll('<![CDATA[', '').replaceAll(']]>', '') : '', de: item.$.language === 'de'? item._.replaceAll('<![CDATA[', '').replaceAll(']]>', '') : '' },
        question: { en: item.$.language === 'en' ? item.$.name : '', de: item.$.language === 'de' ? item.$.name : '' }
      }))

    let isEmptyFlag = true;

    formattedFaq.forEach(item => {
      if (item.question.en || item.question.de) {
        isEmptyFlag = false;
      } 
    })

    if (isEmptyFlag) {
      formattedFaq = []
    } 
    
    return formattedFaq;
  } catch(err) {
    return []
  }
}


const formatTc = (data) => {
  try {
    let formattedTc = data.InformationTypes[0].TermsAndConditions[0].AdditionalValues[0].Value
      .map(item => ({
        answer: { en: item.$.language === 'en'? item._.replaceAll('<![CDATA[', '').replaceAll(']]>', '') : '', de: item.$.language === 'de'? item._.replaceAll('<![CDATA[', '').replaceAll(']]>', '') : '' },
        question: { en: item.$.language === 'en' ? item.$.name : '', de: item.$.language === 'de' ? item.$.name : '' }
      }))

    const additionalItems = { 
                              StandardBusinessTerms: data.InformationTypes[0].TermsAndConditions[0].StandardBusinessTerms,
                              CheckoutService: data.InformationTypes[0].TermsAndConditions[0].CheckoutService,
                              PaymentService: data.InformationTypes[0].TermsAndConditions[0].PaymentService,
                              VoucherService: data.InformationTypes[0].TermsAndConditions[0].VoucherService
                            };


   const formattedAdditionalItems = Object.entries(additionalItems).map(([key,item])=>item.map((value)=>({
        answer: { en: value.$.language === 'en' && value._ ? value._.replaceAll('<![CDATA[', '').replaceAll(']]>', ''):'', de:  value.$.language === 'de' && value._ ? value._.replaceAll('<![CDATA[', '').replaceAll(']]>', ''):'' , disabledToRemove: true},
        question: { en: value.$.language === 'en' ? getTnCAdditionalFieldsName(key,'en'):'', de: value.$.language === 'de' ? getTnCAdditionalFieldsName(key,'de'): ''},
      })))                   

    let isEmptyFlag = true;

    formattedTc.forEach(item => {
      if (item.question.en || item.question.de) {
        isEmptyFlag = false;
      } 
    })

    if (isEmptyFlag) {
      formattedTc = []
    } 
    
    return [...formattedAdditionalItems.flat(2),...formattedTc];
  } catch(err) {
    console.log(err);
    
    return []
  }
}


const formatReputize = (data) => {
  try {
    const setting = data.Settings[0].Setting[0];
    return setting.Name[0] === 'Reputize' ? setting.Key[0] : ''
  } catch(err) {
    return null
  }
}

const formatPaymentOptions = (data) => {
  const temp = data[0].PaymentOption;
  
  if (temp) {
    const finalData = []

    temp.forEach((item, index) => {
      item.id = index;
      item.name = item.PaymentType;
    })

    temp.forEach((item, index) => {
      if (item.PaymentId[0]) {
        finalData.push({
          email: item.PaymentId[0],
          id: item.MarketPlace[0], 
          hotelier: true,
        })
      }
    })

    temp[0].marketPlaces = finalData;
    temp[0].accounts = PAYMENT_ACCOUNTS
    return [temp[0]];
  } else {
    const returnedValue = [{
      name: ['Hotelier Account'],
      marketPlaces: [],
      accounts: PAYMENT_ACCOUNTS
    }]
    return returnedValue;
  }
}



export const fetchEbaySettings = async (objectId) => {
  const ebaySettingsReq = cultbayChannelWebServicesApi.get(`/ebaySettings/${objectId}`, headersJSON);
  const emailSettingsReq = cultbayChannelWebServicesApi.get(`/emailSettings/${objectId}`, headersJSON);


  return await Promise.all([ebaySettingsReq, emailSettingsReq])
    .then(responses => {
      
      const ebaySettingsData = responses[0].data;
      const emailSettingsData = responses[1].data;
      

      const emailSettings = {
        emails: (emailSettingsData && emailSettingsData.emailSettingList) || []
      }


      const result = {
        ...ebaySettingsData,
        ...emailSettings
      }

      return Promise.resolve(result)
    })
    .catch(errors => Promise.reject(errors))
};



export const updateEbaySettings = async (temp, objectId) => {
  if (temp.objectId) {
      const { objectId, userName, password, token, expiryDate } = temp;

      const payload = { userName, password, token, expiryDate }
      const request = cultbayChannelWebServicesApi.post(`/ebaySettings/${objectId}`, payload, headersJSON);

      return await request
      .then(res => Promise.resolve(payload))
      .catch(err => Promise.reject(err.message))
    } else {
      let final = []

      temp.paymentAccounts[0].marketPlaces.forEach(item => {
        final.push({
          PaymentType: 'Paypal',
          PaymentId: `<![CDATA[${item.email}]]>`,
          MarketPlace: (item.id && typeof item.id === 'string' )? item.id : MARKET_PLACES.find(el => el.value === item.country).id,
        })
      })

      const finalResult = paymentXML(final, objectId)
      const request = cultbayChannelWebServicesApi.post('/objectConfiguration', finalResult, headersJSON_xml);

      return await request
      .then(res => Promise.resolve(res))
      .catch(err => Promise.reject(err.message))
    }
};


export const updateEmailSettings = async ({ objectId, emails }) => {
  const payload = { emailSettingList: emails }
  const request = cultbayChannelWebServicesApi.post(`/emailSettings/${objectId}`, payload, headersJSON);

  return await request
    .then(res => Promise.resolve(emails))
    .catch(err => Promise.reject(err.message))
};


export const updateReputize = async (objectId, data) => {
  const payload = reputizeXML(objectId, data)
  const request = cultbayChannelWebServicesApi.post('/objectConfiguration', payload, headersJSON_xml);

  return await request
    .then(res => Promise.resolve(data))
    .catch(err => Promise.reject(err.message))
};


export const fetchConfigDetails = async (objectId) => {
  const configDetailsReqXML = objectConfigDetailsFetcherXML(objectId);
  const { data } = await cultbayChannelWebServicesApi.post('/objectConfigurationDetails', configDetailsReqXML, headersJSON_xml)

  return new Promise((resolve, reject) => {


    parseString(data, (err, result) => {
      if(err) reject(err);

      const mainData = result.ObjectConfigurationDetailsRS;
      const faq = formatFaq(mainData);
      const tc = formatTc(mainData)
      const reputize = formatReputize(mainData);
      const paymentAccounts = formatPaymentOptions(mainData.PaymentOptions);

      resolve({ faq, tc, reputize, paymentAccounts })
    });

  })
};

export const fetchDefaultFAQandTC = async (objectId) => {
  const configDetailsReqXML = objectConfigDetailsFetcherXML(objectId);
  
  const { data } = await cultbayChannelWebServicesApi.post('/objectConfigurationDetails', configDetailsReqXML, headersJSON_xml)

  return new Promise((resolve, reject) => {
    parseString(data, (err, result) => {
      if(err) reject(err);

      const mainData = result.ObjectConfigurationDetailsRS;
      const faq = formatFaq(mainData);
      const tc = formatTc(mainData)

      resolve({ faq, tc })
    });
  })
}


export const updateFAQ = async (objectId, items) => {
  const payload = updateFAQItemXML(objectId, items);
  const request = cultbayChannelWebServicesApi.post('/objectConfiguration', payload, headersJSON_xml);

  return await request
    .then(res => Promise.resolve(items))
    .catch(err => Promise.reject(err.message))
}


export const updateTC = async (objectId, items) => {
 const payload = updateTCItemXML(objectId, items);
 
 const request = cultbayChannelWebServicesApi.post('/objectConfiguration', payload, headersJSON_xml);

  return await request
    .then(res => Promise.resolve(items))
    .catch(err => Promise.reject(err.message))
}



export const deleteMarketPlace = async (accountID, marketPlaceID, marketPlaces, objectId) => {
  const foundedItem = marketPlaces.find(item => item.id === marketPlaceID)
  foundedItem.email = ""

  let final = []

  marketPlaces.forEach(item => {
    final.push({
      PaymentType: 'Paypal',
      PaymentId: `<![CDATA[${item.email}]]>`,
      MarketPlace: item.id ? item.id : MARKET_PLACES.find(el => el.value === item.country).id,
    })
  })

  const finalResult = paymentXML(final, objectId)
  const request = cultbayChannelWebServicesApi.post('/objectConfiguration', finalResult, headersJSON_xml);

  return await request
  .then(res => Promise.resolve({ accountID, marketPlaceID }))
  .catch(err => Promise.reject(err.message))
};

export const fetchEbayOffers = async ({objectId, status = null}) => {
  const payload = offersXML({objectId, status})
  const request = cultbayChannelWebServicesApi.post('/ListOfOffers', payload, headersJSON_xml);

  return await request
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err.message))
};

export const stopOffer = async (objectId, offerId, itemId) => {
  const payload = stopOfferXML(objectId, offerId, itemId);
  const request = cultbayChannelWebServicesApi.post('/offerEnd', payload, headersJSON_xml)

  return await request
    .then(res => Promise.resolve({ objectId, offerId, itemId }))
    .catch(err => Promise.reject(err.message))
};

export const deleteOffer = async (objectId, offerId) => {
  const payload = deleteOfferXML(objectId, offerId);
  const request = cultbayChannelWebServicesApi.post('/offerEnd', payload, headersJSON_xml)

  return await request
    .then(res => Promise.resolve({ objectId, offerId }))
    .catch(err => Promise.reject(err.message))
};

export const getMessages = async ({objectId, newMessagesOffset, historyOffset}) => {
  return {
    newMessages: newMessagesOffset ? await fetchMessages({objectId, ...newMessagesOffset}): null,
    history: historyOffset ? await fetchMessages({objectId, ...historyOffset}): null,
  };
}

const fetchMessages = async (xmlOptions) => {
  const payload = memberMessageXML(xmlOptions);

  try {
    const response = await cultbayChannelWebServicesApi.post(
      "/listMemberMessages",
      payload,
      headersJSON_xml
    );
    const result = await new Promise((resolve, reject) => {
      parseString(response.data, (err, result) => {
        if (!result || err) reject(err);
        resolve(result);
      });
    });

    if (result.ListOfMemberMessagesRS && result.ListOfMemberMessagesRS.Ack && result.ListOfMemberMessagesRS.Ack[0] === 'Failure') {
      return { messages: [], total: 0 };
    }

    let total = 0;
    if (result.ListOfMemberMessagesRS && result.ListOfMemberMessagesRS.TotalMessagesCount) {
      total = Number(result.ListOfMemberMessagesRS.TotalMessagesCount[0]);
    }
    const messages =
      result.ListOfMemberMessagesRS.MemberMessages[0].MemberMessage;
    messages.forEach((item) => {
      item.buyerID = item.BuyerName;
      item.itemID = item.ItemId;
      item.date = item.CreationDate;
      item.subject = item.Subject;
      item.id = item.$.id;
      item.isNew = Number(item.Status[0]) ? false : true;
      item.history = [
        {
          question: item.Question[0],
          id: item.$.id,
        },
      ];
    });

    const historyMessages = messages
      .filter((item) => item.Status[0] === "1")
      .map((el) => el.$.id);

    await Promise.all(
      historyMessages.map(async (item) => {
        const historyPayload = answerMessageXML(item, xmlOptions.objectId);
        const historyResponse = await cultbayChannelWebServicesApi.post(
          "/MemberDetails",
          historyPayload,
          headersJSON_xml
        );

        if (!historyResponse.data || !historyResponse.data.memberMessage) {
          console.error("Bad MemberDetails response:", historyResponse);
          return;
        }

        const foundedItem = messages.find(
          (el) => el.id === historyResponse.data.memberMessage.id
        );
        foundedItem.history[0].answer =
          historyResponse.data.memberMessage.answer;
        foundedItem.history[0].repliedDate =
          historyResponse.data.memberMessage.repliedDate;
      })
    );

    return { messages, total };
  } catch (err) {
    console.error(err);
  }
};

export const archiveMessage = async (messageID, objectId, buyerId, question) => {
  const payload = sendAnswerXML(objectId, buyerId, question, "", messageID, 1)

  const request = cultbayChannelWebServicesApi.post('/answerMemberMessages', payload, headersJSON_xml)

  return await request
    .then(res => Promise.resolve({ messageID }))
    .catch(err => Promise.reject(err.message))
};

export const sendAnswer = async (historyID, messageID, answer, objectId, buyerId, question) => {
  const payload = sendAnswerXML(objectId, buyerId, question, answer, messageID, 0)

  const request = cultbayChannelWebServicesApi.post('/answerMemberMessages', payload, headersJSON_xml)

  return await request
    .then(res => Promise.resolve({ historyID, messageID, answer }))
    .catch(err => Promise.reject(err.message))
};

export const fetchArchiveMails = async (itemID, objectId, withContent) => {
  const [archiveMailId, czId] = itemID.split('-')
  const contentUrl = withContent ? 'withContent' : 'withOutContent'; 
  
  const request = cultbayChannelWebServicesApi.get(`/emails/${archiveMailId}/${czId}/${contentUrl}/${objectId}`)

  return await request
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err.message))
    
};

export const getTokenStatus = async (objectId)=>{
   const requestBody = { authenticationCode:AuthenticationCode, objectId };
   return await cultbayChannelWebServicesApi.post(`/getTokenStatus`, requestBody, headersJSON);
}

export const setToken = async ({token, expiryDate, objectId, tokenStatus}) => {
  const payload = {
    authenticationCode: AuthenticationCode,
    token,
    expiryDate,
    objectId,
    tokenStatus
  };
  return await cultbayChannelWebServicesApi.post('/setToken', payload, headersJSON)
}

export const getSessionId = async ({languageId, siteId = 0}) => {
  const response = await api.post('/ebay/get-session-id', {languageId, siteId});
  return response.data.sessionId;
}

export const fetchToken = async({languageId, sessionId, siteId = 0}) => {
  const response = await api.post('/ebay/fetch-token', {languageId, sessionId, siteId});
  return response.data;
}