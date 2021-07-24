import { ListPictures } from "constants/xmlBody";
import { AuthenticationCode } from "constants/GlobalConstants";
import { cultbayChannelWebServicesApi } from "util/Api";

export const getAllPictures = async ({objectId, errorLang}) => {
  const payload = ListPictures({
    authenticationCode: AuthenticationCode,
    sourceId: "2",
    channelId: "1",
    objectId,
    errorLang
  });
  const response = await cultbayChannelWebServicesApi.post("/pictureslist", payload);
  if (response.data.ack !== 'Success') {
    console.log(response);
    throw new Error('Could not list pictures');
  }
  return response.data.images.image.map(image => {
    let thumbnailURL = image.thumbnailURL;
    if (thumbnailURL.search('http://') !== 0 && thumbnailURL.search('https://') !== 0) {
      thumbnailURL = '//' + thumbnailURL
    }
    let imageURL = image.url;
    if (imageURL.search('http://') !== 0 && imageURL.search('https://') !== 0) {
      imageURL = '//' + imageURL;
    }
    return {
      uid: image.imageId,
      name: image.name,
      thumbUrl: thumbnailURL,
      url: imageURL,
      category: image.category
    };
  });
}