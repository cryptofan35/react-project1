import { cultbayApi } from "util/Api";

const fetchBookingInfo = async (requestData) => {
  const {
    property: { objectId },
    language,
  } = requestData;

  const defineUrl = `/importData/${objectId}/${language}`;
  const response = await cultbayApi.get(defineUrl);

  return response;
};

const fetchBookingStatus = async (requestData) => {
  const { objectId } = requestData;

  const defineUrl = `/importStatus/${objectId}`;

  const response = await cultbayApi.get(defineUrl);
  return response;
};

const createBookingInfo = async (requestData) => {
  const {
    property: { objectId },
    language,
    values,
    importDataFlag,
  } = requestData;

  const defineUrl = `/importData/${objectId}/${language}`;
  const postData = {
    ...values,
    importDataFlag,
    lang: language,
  };

 const response = await cultbayApi.post(defineUrl, postData);
  return response;
};

export { fetchBookingInfo, fetchBookingStatus, createBookingInfo };
