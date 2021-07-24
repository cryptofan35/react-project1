import { createRoomXML, updateRoomXML } from '../constants/xmlBody';
import axios from "util/Api";
import { parseString } from "xml2js";
import { AgentDutyCode, AgentSine } from '../constants/GlobalConstants';

export const createRoom = async ({objectId, name, roomType, amenities, imageUrls}) => {
  const payload = createRoomXML({objectId, name, roomType, amenities, imageUrls, maxOccupancy: 5});
  const response = await axios.post("https://api.cultbay.com/ProductsAndRooms/rooms/createRoom", payload, {
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

      return resolve();
    })
  })

};

export const updateRoom = async ({roomId, objectId, name, roomType, amenities, imageUrls}) => {
  const payload = updateRoomXML({roomId, objectId, name, roomType, amenities, imageUrls, maxOccupancy: 5});
  const response = await axios.post("https://api.cultbay.com/ProductsAndRooms/rooms/createRoom", payload, {
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

      return resolve();
    })
  })

};

export const getAmenities = async () => {
  const response = await axios.get('/2/amenities')
  return response.data
}