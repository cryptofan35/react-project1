import axios from "axios";
import {AuthenticationCode} from "../constants/GlobalConstants";
// export const baseURL = "http://localhost:8000/";
//export const baseURL = "http://95.217.236.14:8000/";
export const baseURL = "https://extranetneo.backend.cultbay.com/";
export const mockUrl = "https://5f782a8d66d4960016c499cc.mockapi.io";
export const cultbayUrl = "https://ws.cultbay.com/ChannelWS/CultbayChannelWSs";
// Add heroku cors middleware for development mode
export const cultbayReportsUrl = `https://ws.cultbay.com/CultbayReports/CultBayReports`;
export const placeHoldersUrl = `https://placeholders.cultbay.com`;

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const mockApi = axios.create({
  baseURL: mockUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

export const cultbayApi = axios.create({
  baseURL: cultbayUrl,
  headers: {
    'accept': 'application/json',
    "Content-Type": "application/json"
  }
});

export const cultbayChannelWebServicesApi = axios.create({
  baseURL: cultbayUrl,
  headers: {
    "Content-Type": "application/xml"
  }
})

export const cultbayReportsApi = axios.create({
  baseURL: cultbayReportsUrl,
  headers: {
    "Content-Type": "application/json",
    authenticationCode: AuthenticationCode
  }
});

export const placeHoldersApi = axios.create({
  baseURL: placeHoldersUrl,
  headers: {
    "Content-Type": "application/json"
  }
})