import o2x from "object-to-xml";
import moment from "moment";
import { AuthenticationCode } from "./GlobalConstants";
import { RoomTypes } from "constants/RoomTypes";
import { checkAndConvertMandatoryToXmlField } from 'util/ebayOffers/filters';
import { getRuName, isModeSandbox } from "constants/Ebay/api";

export const vouchersXML = ({ objectId, page = 0 }) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ListOfVouchersRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        Range: {
          "@": {
            lowerLimit: page * 50,
            upperLimit: (page + 1) * 50
          }
        }
      }
    }
  });

export const voucherPreviewXML = data =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    VoucherServiceRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: data.objectId,
        ErrorLang: "en",
        ItemId: data.itemId,
        OrderId: data.orderId,
        VoucherId: data.id
      }
    }
  });

export const redeemVoucherXML = data =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    VoucherRedemptionRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: data.objectId,
        ErrorLang: "en",
        ItemId: data.itemId,
        OrderId: data.orderId,
        VoucherId: data.id,
        Action: "Redeem",
        TravellerName: data.travellerName,
        Period: {
          "@": {
            From: moment(data.from).format("YYYY-MM-DD hh:mm:ss"),
            To: moment(data.to).format("YYYY-MM-DD hh:mm:ss")
          }
        }
      }
    }
  });

export const voucherDetailsXML = data =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    VoucherDetailsRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: data.objectId,
        ErrorLang: "en",
        ItemId: data.itemId,
        OrderId: data.orderId,
        VoucherId: data.id
      }
    }
  });

export const ObjectMetaData = ({
  authenticationCode,
  sourceId,
  channelId,
  objectId,
  errorLang,
  siteId,
  requestParameters
}) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ObjectMetaDataRQ: {
      "@": {
        TimeStamp: fixupDateForChannelWS(new Date())
      },
      "#": {
        AuthenticationCode: authenticationCode,
        SourceId: sourceId,
        ChannelId: channelId,
        ObjectId: objectId,
        ErrorLang: errorLang,
        SiteId: siteId,
        RequestParameters: requestParameters
      }
    }
  });

export const ListPictures = ({
  authenticationCode,
  sourceId,
  channelId,
  objectId,
  category,
  errorLang
}) => {
  let payload = {
    AuthenticationCode: authenticationCode,
    SourceId: sourceId,
    ChannelId: channelId,
    ObjectId: objectId,
    ErrorLang: errorLang
  };
  if (category) {
    payload.Category = category;
  }
  return o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ListOfPicturesRQ: {
      "@": {
        TimeStamp: fixupDateForChannelWS(new Date())
      },
      "#": payload
    }
  });
};

const fixupDateForChannelWS = date => {
  var newDate = new Date(date).toISOString();
  //strip off the milisecconds and the Z
  return newDate.substr(0, newDate.length - 5).replace("T", " ");
};

export const images = ({ objectId, image, name }) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    OTA_HotelDescriptiveContentNotifRQ: {
      "@": {
        xmlns: "http://www.opentravel.org/OTA/2003/05",
        TimeStamp: new Date(),
        Version: "1.0",
        TransactionIdentifier: "123abcprofile",
        Target: "Production"
      },
      "#": {
        HotelDescriptiveContents: {
          HotelDescriptiveContent: {
            "@": {
              LanguageCode: "EN",
              HotelCode: objectId,
              HotelName: name,
              CurrencyCode: "EUR",
              ChainName: ""
            },
            "#": {
              HotelInfo: {
                Descriptions: {
                  MultimediaDescriptions: {
                    MultimediaDescription: {
                      ImageItems: {
                        ImageItem: {
                          ImageFormat: {
                            "@": {
                              Format: "5"
                            },
                            "#": {
                              URL: image
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });


export const amenities = ({
  objectId,
  codes,
  name
}) => `<?xml version="1.0" encoding="UTF-8"?>
<OTA_HotelDescriptiveContentNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05" TimeStamp="2020-11-01T22:51:21" Version="1.0" TransactionIdentifier="123abcprofile" Target="Production">
  <HotelDescriptiveContents>
    <HotelDescriptiveContent LanguageCode="EN" HotelCode="${objectId}" CurrencyCode="EUR" ChainName="" HotelName="${name}">
      <HotelInfo>
        <Services>
          ${codes
            .map(code => '<Service Code="' + code + '" />')
            .toString()
            .replaceAll(",", "")}
        </Services>
      </HotelInfo>
    </HotelDescriptiveContent>
  </HotelDescriptiveContents>
</OTA_HotelDescriptiveContentNotifRQ>`;

export const getProperty = objectId =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    OTA_HotelDescriptiveInfoRQ: {
      "@": {
        xmlns: "http://www.opentravel.org/OTA/2003/05",
        TimeStamp: new Date(),
        Version: "1.0",
        TransactionIdentifier: "123abcprofile",
        Target: "Production"
      },
      "#": {
        HotelDescriptiveInfos: {
          HotelDescriptiveInfo: {
            "@": {
              HotelCode: objectId
            },
            "#": {
              AffiliationInfo: {
                "@": {
                  SendAwards: true
                }
              },
              HotelInfo: {
                "@": {
                  SendData: true
                }
              },
              ContactInfo: {
                "@": {
                  SendData: true
                }
              },
              FacilityInfo: {
                "@": {
                  SendGuestRooms: true
                }
              }
            }
          }
        }
      }
    }
  });

const language = { en: "2", de: "1" };
export const XMLDataFormatting = object => {
  const HotelDescriptiveContent = object.OTA_HotelDescriptiveInfoRS.HotelDescriptiveContents[0].HotelDescriptiveContent[0];

  const nameAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[0];
  const billingAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[1];
  const legalAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[2];
  const services = HotelDescriptiveContent.HotelInfo[0].Services[0];
  const rooms = HotelDescriptiveContent.FacilityInfo ? HotelDescriptiveContent.FacilityInfo[0].GuestRooms[0].GuestRoom : [];

  const {TextItems: [text], ImageItems: [imageItems]} = HotelDescriptiveContent.HotelInfo[0].Descriptions[0].MultimediaDescriptions[0].MultimediaDescription[0]
  const hotelImagesInfo = {
    hotelImages: imageItems.ImageItem
    .filter(({Description}) => Description[0]['$'])
    .map(({Description, ImageFormat}) => ({
      captionCode: parseInt(Description[0]['$']['Caption']),
      imageUrls: ImageFormat.filter(({URL}) => URL).map(({URL}) => URL[0])
    }))
  };

  const nameAddressInfo = {};
  if (nameAddress.Addresses) {
    const address = nameAddress.Addresses[0].Address[0];
    address.AddressLine[0] && (nameAddressInfo.street = address.AddressLine[0]);
    address.StreetNmbr[0] && (nameAddressInfo.street_number = address.StreetNmbr[0]);
    address.CityName[0] && (nameAddressInfo.city = address.CityName[0]);
    address.PostalCode[0] && (nameAddressInfo.postcode = address.PostalCode[0]);
    nameAddress.Emails && (nameAddressInfo.email = nameAddress.Emails[0].Email[0]);
    nameAddress.URLs && (nameAddressInfo.website = nameAddress.URLs[0].URL[0]);
    nameAddress.Phones && (nameAddressInfo.phone = nameAddress.Phones[0].Phone[0]['$'].PhoneNumber.replace('+', ''));
    nameAddress.Phones && (nameAddressInfo.fax = nameAddress.Phones[0].Phone[1]['$'].PhoneNumber.replace('+', ''));
  }

  const billingAddressInfo = {};
  if (billingAddress.Addresses) {
    const address = billingAddress.Addresses[0].Address[0];
    address.CityName[0] && (billingAddressInfo.billing_city = address.CityName[0]);
    address.AddressLine[0] && (billingAddressInfo.billing_street = address.AddressLine[0]);
    address.StreetNmbr[0] && (billingAddressInfo.billing_street_number = address.StreetNmbr[0]);
    address.PostalCode[0] && (billingAddressInfo.billing_post_code = address.PostalCode[0]);
  }

  const legalAddressInfo = {};
  if (legalAddress.Addresses) {
    const address = legalAddress.Addresses[0].Address[0];
    address.CityName[0] && (legalAddressInfo.legal_city = address.CityName[0]);
    address.AddressLine[0] && (legalAddressInfo.legal_street = address.AddressLine[0]);
    address.StreetNmbr[0] && (legalAddressInfo.legal_street_number = address.StreetNmbr[0]);
    address.PostalCode[0] && (legalAddressInfo.legal_post_code = address.PostalCode[0]);
    billingAddress.Emails && (legalAddressInfo.legal_email = billingAddress.Emails[0].Email[0]);
  }

  const amenitiesInfo = {};
  if (services) {
    let codeInfo = {};
    services.Service.forEach(s => Object.assign(codeInfo, {[s['$'].Code]: true}));
    amenitiesInfo.amenities = codeInfo;
  }

  const description = {
    description_content: text.TextItem[0] && text.TextItem[0].Description[0]['_'],
    description_language: text.TextItem[0] && language[text.TextItem[0].Description[0]['$'].Language]
  }

  const roomsInfo = {rooms: rooms.map((guestRoom) => {
    let images = [];
    if (guestRoom.MultimediaDescriptions && guestRoom.MultimediaDescriptions.length > 0 && guestRoom.MultimediaDescriptions[0]['MultimediaDescription']) {
      const imageItems = guestRoom.MultimediaDescriptions[0]['MultimediaDescription'][0]['ImageItems'].filter(imageItem => imageItem);
      if (imageItems.length > 0) {
        images = imageItems[0]['ImageItem'].map((imageItem) => ({url: imageItem.ImageFormat[0]['URL'][0]}))
      }
    }
    return {
      id: guestRoom['$']['ID'],
      roomType: {
        id: guestRoom['$']['RoomTypeCode'],
        name: guestRoom['$']['RoomTypeName']
      },
      amenities: guestRoom.Amenity ? guestRoom.Amenity.map((amenity) => amenity['$']['RoomAmenityCode']).map(amenity => parseInt(amenity)) : [],
      name: guestRoom['DescriptiveText'][0],
      images
    }
  }).sort((room1, room2) => parseInt(room1.id) > parseInt(room2.id) ? -1 : 1)}

  return {
    ...nameAddressInfo,
    ...description,
    ...billingAddressInfo,
    ...legalAddressInfo,
    ...amenitiesInfo,
    ...roomsInfo,
    ...hotelImagesInfo
  }
}

export const createRoomXML = ({
  objectId,
  name,
  roomType,
  amenities,
  imageUrls,
}) => {
  const now = new Date().toISOString();
  const roomTypeObject = RoomTypes[roomType];
  imageUrls = imageUrls.map(imageUrl =>
    imageUrl.indexOf("http") !== 0 ? "https:" + imageUrl : imageUrl
  );
  const imagesXML = imageUrls.length > 0 ? imageUrls
    .map(
      imageUrl =>
        `<Description Name="Picture"><Image>${imageUrl}</Image></Description>`
    )
    .toString()
    .replaceAll(",", "") : '<Description Name="Picture"><Image></Image></Description>';
  return `<OTA_HotelInvNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05" Target="Production" TimeStamp="${now.substr(
    0,
    now.length - 5
  )}" Version="1.0">
  <SellableProducts HotelCode="${objectId}">
     <SellableProduct InvStatusType="" InvCode="">
        <Description Name="RoomName">
           <Text>${name}</Text>
        </Description>
        <GuestRoom>
           <Occupancy MaxOccupancy="${roomTypeObject['stdOccupancy']}" />
           <Room RoomType="${roomType}"/>
           <Amenities>
              ${amenities
                .map(amenityCode => `<Amenity AmenityCode="${amenityCode}" />`)
                .toString()
                .replaceAll(",", "")}
           </Amenities>
           ${imagesXML}
        </GuestRoom>
     </SellableProduct>
  </SellableProducts>
</OTA_HotelInvNotifRQ>`;
};

export const updateRoomXML = ({
  roomId,
  objectId,
  name,
  roomType,
  amenities,
  imageUrls,
}) => {
  const roomTypeObject = RoomTypes[roomType];
  const now = new Date().toISOString();
  imageUrls = imageUrls.map(imageUrl =>
    imageUrl.indexOf("http") !== 0 ? "https:" + imageUrl : imageUrl
  );
  const imagesXML = imageUrls.length > 0 ? imageUrls
    .map(
      imageUrl =>
        `<Description Name="Picture"><Image>${imageUrl}</Image></Description>`
    )
    .toString()
    .replaceAll(",", "") : '<Description Name="Picture"><Image></Image></Description>';
  return `<OTA_HotelInvNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05" Target="Production" TimeStamp="${now.substr(
    0,
    now.length - 5
  )}" Version="1.0">
  <SellableProducts HotelCode="${objectId}">
     <SellableProduct InvStatusType="Active" InvCode="${roomId}">
        <Description Name="RoomName">
           <Text>${name}</Text>
        </Description>
        <GuestRoom>
           <Occupancy MaxOccupancy="${roomTypeObject['stdOccupancy']}" />
           <Room RoomType="${roomType}"/>
           <Amenities>
              ${amenities
                .map(amenityCode => `<Amenity AmenityCode="${amenityCode}" />`)
                .toString()
                .replaceAll(",", "")}
           </Amenities>
           ${imagesXML}
        </GuestRoom>
     </SellableProduct>
  </SellableProducts>
</OTA_HotelInvNotifRQ>`;
};

export const removePictureXML = ({ objectId, errorLang, imageId }) => {
  const timestamp = fixupDateForChannelWS(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
  <DeletePictureRQ TimeStamp="${timestamp}">
    <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
    <SourceId>2</SourceId>
    <ChannelId>1</ChannelId>
    <ObjectId>${objectId}</ObjectId>
    <ErrorLang>${errorLang}</ErrorLang>
    <ImageId>${imageId}</ImageId>
  </DeletePictureRQ>`;
};

export const XMLDataVouchersFormatting = object => {
  if (
    object.ListOfVouchersRS.TotalVouchers &&
    object.ListOfVouchersRS.TotalVouchers[0] === "0"
  ) {
    return [];
  }

  const total = object.ListOfVouchersRS.TotalVouchers[0];

  const vouchers = object.ListOfVouchersRS.Vouchers[0].Voucher.map(voucher => {
    const id = voucher.VoucherId ? voucher.VoucherId[0] : "";
    const paidDate = voucher.PaymentDate ? voucher.PaymentDate[0] : undefined;
    const validUntil = voucher.ValidUntil ? voucher.ValidUntil[0] : moment();
    const status = voucher.Status ? voucher.Status[0] : 1;
    const price = voucher.Price ? voucher.Price[0] : "";
    const itemId = voucher.ItemId ? voucher.ItemId[0] : "";
    const orderId = voucher.OrderId ? voucher.OrderId[0] : "";
    const checkIn = voucher.CheckIn ? voucher.CheckIn[0] : "";
    const checkOut = voucher.CheckOut ? voucher.CheckOut[0] : "";
    const productOffer = voucher.ProductOffer ? voucher.ProductOffer[0] : "";
    const currency = voucher.Currency ? voucher.Currency[0] : "";
    const offerSiteId = voucher.OfferSiteId ? voucher.OfferSiteId[0] : "";
    const travelPeriod = {
      start: checkIn,
      end: checkOut
    };
    const buyer = {
      username: voucher.BuyerId ? voucher.BuyerId[0] : "",
      fullName: voucher.BuyerName ? voucher.BuyerName[0] : ""
    };

    return {
      id,
      itemId,
      orderId,
      paidDate,
      buyer,
      status,
      travelPeriod,
      price,
      productOffer,
      currency,
      offerSiteId,
      validUntil,
    }
  });

  return {
    vouchers,
    total,
  };
};

export const XMLDataVoucherFormatting = object => {
  const voucher = object.VoucherDetailsRS;
  let res = {};

  const buyer = {
    fullName: voucher.BuyerName ? voucher.BuyerName[0] : ""
  };

  res.buyer = buyer;
  res.id = voucher.VoucherId ? voucher.VoucherId[0] : "";
  res.itemId = voucher.ItemId ? voucher.ItemId[0] : "";
  res.orderId = voucher.OrderId ? voucher.OrderId[0] : "";
  res.paidDate = voucher.PaidDate ? voucher.PaidDate[0] : undefined;
  res.price = voucher.Price ? voucher.Price[0] : '';
  res.currency = voucher.Currency ? voucher.Currency[0] : '';

  return res;
};

export const listTemplatesXML = ({objectId, errorLang, offset, limit}) => {
  const timestamp = fixupDateForChannelWS(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
  <ListOfTemplatesRQ TimeStamp="${timestamp}">
    <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
    <SourceId>2</SourceId>
    <ChannelId>1</ChannelId>
    <ObjectId>${objectId}</ObjectId>
    <ErrorLang>${errorLang}</ErrorLang>
    <Range lowerLimit="${offset}" upperLimit="${offset + limit}">
    </Range>
  </ListOfTemplatesRQ>`;
}

export const XMLTemplatesFormatting = object => {
  const data = object.ListOfTemplatesRS;
  if (! data.Ack || ! data.Ack[0] || data.Ack[0] !== 'Success') {
    return {};
  }

  const totalTemplateCount = parseInt(data.TotalNoOfTemplates[0]);
  const templates = data.Templates ? data.Templates[0].Template.map(template => {
    let offerErrorMessage = '';
    if (template.Offers[0] && template.Offers[0].Offer && template.Offers[0].Offer[0]) {
      const offer = template.Offers[0].Offer[0];
      if (offer.EBayErrorMessage) {
        offerErrorMessage = offer.EBayErrorMessage[0]
      } else if (offer.EBayLongErrorMessage) {
        offerErrorMessage = offer.EBayLongErrorMessage[0]
      }
    }
    return {
      id: parseInt(template.$.id) ,
      currency: template.Currency[0],
      designTemplateId: parseInt(template.DesignTemplate[0]),
      futureOffersCount: parseInt(template.FutureOffersCount[0]),
      offerCount: parseInt(template.OfferCount[0]),
      pastOffersCount: parseInt(template.PastOffersCount[0]),
      failedOffersCount: parseInt(template.FailedOffersCount[0]),
      price: parseFloat(template.Price[0]),
      productId: parseInt(template.ProductId[0]),
      runningOffersCount: parseInt(template.RunningOffersCount[0]),
      status: parseInt(template.Status[0]),
      name: template.TemplateName[0],
      siteId: parseInt(template.SiteId[0]),
      offerErrorMessage
    };
  }) : [];

  return {
    count: totalTemplateCount,
    templates
  }
}


export const inventoryFetcherXML = ({ objectId, month }) => {
  const date = new Date();
  let startDate;
  let endDate;

  if (month) {
    startDate = new Date(date.getFullYear(), date.getMonth(), date.getMonth() === month ? date.getDay : 1);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  } else {
    startDate = date;
    endDate = moment(date).add(3, 'years').subtract(1, 'days');
  }

  return o2x({
    '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
    OTA_HotelAvailRQ: {
      '@': {
        xmlns: 'http://www.opentravel.org/OTA/2003/05',
        TimeStamp: new Date(),
        Version: '1.0',
        TransactionIdentifier: '123abcnotif',
        Target: 'Production',
        PrimaryLangID: 'EN'
      },
      '#': {
        AvailRequestSegments: {
          AvailRequestSegment: {
            HotelSearchCriteria: {
              Criterion: {
                HotelRef: {
                  '@': {
                    HotelCode: objectId
                  }
                }
              }
            },
            StayDateRange: {
              '@': {
                Start: moment(startDate).format('YYYY-MM-DD'),
                End: moment(endDate).format('YYYY-MM-DD')
              }
            }
          }
        }
      }
    }
  });
}

export const XMLDataInventoryFetcher = (object, packageInfo) => {
  try {
    const hotelAvailResponse = object.OTA_HotelAvailRS;
    const roomRatesList = hotelAvailResponse.RoomStays[0].RoomStay[0].RoomRates[0].RoomRate || [];

    const serializedRates = roomRatesList.map(roomRate => {
      let roomRateObj = {};

      roomRateObj.id = roomRate['$'].RatePlanID;

      const packageName = packageInfo && packageInfo[roomRateObj.id] ? packageInfo[roomRateObj.id]['ProductName'] : `Test ${roomRate['$'].RatePlanID}`;
      roomRateObj.name = packageName;

      roomRateObj.roomID = roomRate['$'].RoomID;

      roomRateObj.reservedDates = roomRate.Rates && (roomRate.Rates[0] === '')
        ? []
        : roomRate.Rates[0].Rate.map(rate => {
          let reservedDate = {};
          reservedDate.date = moment(rate['$'].EffectiveDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
          reservedDate.quantity = Number(rate['$'].NumberOfUnits);
          reservedDate.price = (rate.Base && rate.Base[0] && Number(rate.Base[0]['$'].AmountAfterTax)) || 0;

          if (rate.TPA_Extensions && rate.TPA_Extensions[0] && rate.TPA_Extensions[0].RestrictionStatus) {
            const restrictionStatus = rate.TPA_Extensions[0].RestrictionStatus;
            reservedDate.isClosed = restrictionStatus[0]['$'].Status !== 'Open';
            reservedDate.cta = restrictionStatus[1]['$'].Status !== 'Open';
            reservedDate.ctd = restrictionStatus[2]['$'].Status !== 'Open';
          } else {
            reservedDate.isClosed = true;
            reservedDate.cta = true;
            reservedDate.ctd = true;
          }

          return reservedDate;
        });

      return roomRateObj;
    });

    return serializedRates;

  } catch (err) {
    return [];
  }
}

export const inventoryReceiverXML = requestProps => {

  const {
    id,
    startDate,
    endDate,
    isAvailable = null,
    roomId,
    availability = null,
    selectedDays = [],
    cta,
    ctd,
    objectId,
  } = requestProps;

  const parsedSelectedDays = {};

  selectedDays && selectedDays.forEach(selectedDay => {
    const fixedSelectedDay =
    selectedDay === 'Wed' ? 'Weds' :
    selectedDay === 'Thu' ? 'Thur' :
    selectedDay;

    parsedSelectedDays[fixedSelectedDay] = 1;
  });

  const statusNode = isAvailable !== null ? {
    RestrictionStatus: {
      '@': {
        Status: isAvailable ? 'Open' : 'Close'
      }
    }
  }
  : {};

  const ctaNode = cta !== null ? {
    RestrictionStatus: {
      '@': {
        Restriction: 'Arrival',
        Status: cta ? 'Close' : 'Open'
      }
    }
  }
  : {};

  const ctdNode = ctd !== null ? {
    RestrictionStatus: {
      '@': {
        Restriction: 'Departure',
        Status: ctd ? 'Close' : 'Open'
      }
    }
  }
  : {};

  const StatusApplicationControl = {
    '@': {
      Start: startDate.format('YYYY-MM-DD'),
      End: endDate.format('YYYY-MM-DD'),
      ...parsedSelectedDays
    }
  };
  if (null !== id) {
    StatusApplicationControl['@']['RatePlanCode'] = id;
  }
  if (null !== roomId) {
    StatusApplicationControl['@']['InvTypeCode'] = roomId;
  }

  const AvailStatusMessage = {
    '#': {
      StatusApplicationControl,
      ...statusNode,
      ...ctaNode,
      ...ctdNode,
    }
  }
  if (null !== availability) {
    AvailStatusMessage['@'] = {
      BookingLimit: availability
    }
  }

  return o2x({
    '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
    OTA_HotelAvailNotifRQ: {
      '@': {
        xmlns: 'http://www.opentravel.org/OTA/2003/05',
        TimeStamp: new Date(),
        Version: '1.0',
        TransactionIdentifier: '123abcnotif',
        Target: 'Production',
      },
      '#': {
        AvailStatusMessages: {
          '@': {
            HotelCode: objectId
          },
          '#': {
            AvailStatusMessage
          }
        }
      }
    }
  });
}

export const invalidInventoryReceiverResponseXML = object => {
  return {
    message: object.OTA_HotelAvailNotifRS.Errors[0].Error[0]['$'].ShortText || null
  };
}

export const invalidRatesReceiverResponseXML = object => {
  return {
    message: object.OTA_HotelRatePlanNotifRS.Errors[0].Error[0]['$'].ShortText || null
  };
}



export const productPullXML = (objectId) => {
  return o2x({
    '?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?': null,
    OTA_HotelRatePlanRQ: {
      '@': {
        xmlns: 'http://www.opentravel.org/OTA/2003/05',
        TimeStamp: new Date(),
        Version: '1.0',
        TransactionIdentifier: '123abcnotif',
        Target: 'Production',
      },
      '#': {
        RatePlans: {
          RatePlan: {
            HotelRef: {
              '@': {
                HotelCode: objectId
              }
            }
          }
        }
      }
    }
  });
}

export const XMLDataBasicProductPull = object => {
  const hotelRatePlanResponse = object.OTA_HotelRatePlanRS;
  const ratePlanList = hotelRatePlanResponse.RatePlans ? hotelRatePlanResponse.RatePlans[0].RatePlan : [];

  let ratePlanObj = {};

  ratePlanList && ratePlanList.forEach(ratePlan => {
    const ratePlanCode = ratePlan['$'].RatePlanCode;
    ratePlanObj[ratePlanCode] = {};

    ratePlan.Description.forEach(descriptionNode => {
      if (descriptionNode.Text) {
        ratePlanObj[ratePlanCode][descriptionNode['$'].Name] = descriptionNode.Text[0];
      }
    });
  });

  return ratePlanObj;
}



export const ratesReceiverXML = ({objectId, roomID, id, startDate, endDate, price, currency}) => {
  return o2x({
    '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
    OTA_HotelRatePlanNotifRQ: {
      '@': {
        xmlns: 'http://www.opentravel.org/OTA/2003/05',
        TimeStamp: new Date(),
        Version: '1.0',
        TransactionIdentifier: '123456abc',
        Target: 'Production',
      },
      '#': {
        RatePlans: {
          '@': {
            HotelCode: objectId
          },
          '#': {
            RatePlan: {
              '@': {
                RatePlanCode: id,
                RatePlanNotifType: 'Overlay'
              },
              '#': {
                Rates: {
                  Rate: {
                    '@': {
                      Start: startDate.format('YYYY-MM-DD'),
                      End: endDate.format('YYYY-MM-DD'),
                      // InvCode: roomID,
                    },
                    '#': {
                      BaseByGuestAmts: {
                        BaseByGuestAmt: {
                          '@': {
                            CurrencyCode: currency,
                            AmountAfterTax: price
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        }
      }
    }
  });
}

export const savePackageXML = ({objectId, packageId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, availabilityPrice, calendarOffer, description, voucherDescription, imageUrls, marketPlaceCurrencyCode, propertyCurrencyCode}) => {
  const now = new Date().toISOString();
  imageUrls = imageUrls.map(imageUrl =>
    imageUrl.indexOf("http") !== 0 ? "https:" + imageUrl : imageUrl
  );
  const ratePlanCodeAttribute = packageId ? `RatePlanCode="${packageId}"` : '';
  const availabilityCondition = availabilityPrice > 0 ? `<AvailabilityCondition Price="${availabilityPrice}" CurrencyCode="${propertyCurrencyCode}"/>` : '';
  const ratePlanNotifyTypeAttribute = packageId  ? 'Overlay' : 'New';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OTA_HotelRatePlanNotifRQ Target="Production" TimeStamp="${now.substr(0,now.length - 5)}" TransactionIdentifier="3d60cb8d-3936-49f1-9b6a-d275e7e94dca-1468675469" Version="1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <RatePlans HotelCode="${objectId}">
    <RatePlan MarketCode="${marketplaceId}" RatePlanNotifType="${ratePlanNotifyTypeAttribute}" ${ratePlanCodeAttribute}>
      <Rates>
        <Rate InvCode="${roomId}">
          <BaseByGuestAmts>
            <BaseByGuestAmt AmountAfterTax="${price}" CurrencyCode="${propertyCurrencyCode}" NumberOfGuests="${numberOfGuests}"/>
          </BaseByGuestAmts>
        </Rate>
      </Rates>
      <BookingRules>
        <BookingRule OffsetDuration="${voucherValidity}">
          <LengthsOfStay>
            <LengthOfStay MinMaxMessageType="FixedLOS" Time="${numberOfNights}" TimeUnit="Day"/>
          </LengthsOfStay>
        </BookingRule>
      </BookingRules>
      <Description Name="ProductName">
        <Text><![CDATA[${name}]]></Text>
      </Description>
      <Description Name="ProductDescription">
        <Text><![CDATA[${description}]]></Text>
      </Description>
      <Description Name="VoucherDescription">
        <Text><![CDATA[${voucherDescription}]]></Text>
      </Description>
      ${imageUrls
        .map(
          imageUrl =>
            `<Description Name="Pictures"><Image>${imageUrl}</Image></Description>`
        )
        .toString()
        .replaceAll(",", "")}
    </RatePlan>
  </RatePlans>
  <TPA_Extensions>
    <OfferPrice CurrencyCode="${marketPlaceCurrencyCode}" Price="${price}"/>
    <ListingType>Fixed</ListingType>
    ${availabilityCondition}
    <CalenderOffer>${calendarOffer ? 'True' : 'False'}</CalenderOffer>
  </TPA_Extensions>
</OTA_HotelRatePlanNotifRQ>`;
}

export const packageDetailsXML = ({objectId, packageId}) => {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OTA_HotelRatePlanRQ xmlns="http://www.opentravel.org/OTA/2003/05" TimeStamp="${now.substr(0,now.length - 5)}" Version="1.0" TransactionIdentifier="123abcnotif" Target="Production">
	<RatePlans>
		<RatePlan>
			<HotelRef HotelCode="${objectId}">
			</HotelRef>
			<RatePlanCandidates>
				<RatePlanCandidate RatePlanCode="${packageId}">
				</RatePlanCandidate>
			</RatePlanCandidates>
		</RatePlan>
	</RatePlans>
</OTA_HotelRatePlanRQ>
  `;
}

export const invalidSavePackageResponseXML = object => {
  return {
    message: object.OTA_HotelRatePlanNotifRS.Errors[0].Error[0]['$'].ShortText || null
  };
}

export const XMLPackageDetailFormatting = object => {
  const ratePlanObject = object.OTA_HotelRatePlanRS.RatePlans[0]['RatePlan'][0] || null;
  if (! ratePlanObject) {
    return null;
  }
  const extensionsObject = object.OTA_HotelRatePlanRS.TPA_Extensions[0];

  let packageDetail = {};
  packageDetail.marketPlaceId = ratePlanObject['$']['MarketCode'];
  packageDetail.packageId = parseInt(ratePlanObject['$']['RatePlanCode']);

  const rateObject = ratePlanObject.Rates[0]['Rate'][0] || null;
  if (rateObject) {
    packageDetail.roomId = rateObject['$']['InvCode'];
    const guestData = rateObject.BaseByGuestAmts[0]['BaseByGuestAmt'][0] || null;
    if (guestData) {
      packageDetail.price = parseFloat(guestData['$']['AmountAfterTax']);
      packageDetail.currencyCode = guestData['$']['CurrencyCode'];
      packageDetail.numberOfGuests = parseInt(guestData['$']['NumberOfGuests']);
    }
  }

  const bookingRuleObject = ratePlanObject.BookingRules[0]['BookingRule'][0] || null;
  if (bookingRuleObject) {
    packageDetail.voucherValidity = bookingRuleObject['$']['OffsetDuration'];
    const lengthOfStayObject = bookingRuleObject.LengthsOfStay[0]['LengthOfStay'][0] || null;
    if (lengthOfStayObject) {
      packageDetail.numberOfNights = parseInt(lengthOfStayObject['$']['Time']);
    }
  }

  packageDetail.name = ratePlanObject.Description.find((descriptionObject) => descriptionObject['$']['Name'] === 'ProductName')['Text'][0];
  packageDetail.availabilityPrice = extensionsObject.AvailabilityCondition && extensionsObject.AvailabilityCondition[0] && extensionsObject.AvailabilityCondition[0]['$'] && extensionsObject.AvailabilityCondition[0]['$']['Price'] ? parseFloat(extensionsObject.AvailabilityCondition[0]['$']['Price']) : null;
  packageDetail.calendarOffer = extensionsObject.CalenderOffer[0] === 'True';
  packageDetail.listingType = extensionsObject.ListingType[0] || '';
  packageDetail.description = ratePlanObject.Description.find((descriptionObject) => descriptionObject['$']['Name'] === 'ProductDescription')['Text'][0];
  packageDetail.voucherDescription = ratePlanObject.Description.find((descriptionObject) => descriptionObject['$']['Name'] === 'VoucherDescription')['Text'][0];
  packageDetail.imageUrls = ratePlanObject.Description.filter((descriptionObject) => descriptionObject['$']['Name'] === 'Pictures').map((descriptionObject) => descriptionObject.Image[0]);
  
  /** some packages have no roomName description */
  const roomNameDescription = ratePlanObject.Description.find((descriptionObject) => descriptionObject['$']['Name'] === 'RoomName') || {Text: ['']};
  packageDetail.roomName = roomNameDescription['Text'][0];

  return packageDetail;

}

export const packageCalendarXML = ({objectId, packageId, roomId}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <OTA_HotelAvailRQ xmlns="http://www.opentravel.org/OTA/2003/05" TimeStamp="${moment().format("YYYY-MM-DDThh:mm:ss")}" Version="1.0" TransactionIdentifier="123abcnotif" Target="Production" PrimaryLangID="EN">
    <AvailRequestSegments>
      <AvailRequestSegment>
        <HotelSearchCriteria>
          <Criterion>
            <HotelRef HotelCode="${objectId}">
            </HotelRef>
          </Criterion>
        </HotelSearchCriteria>
        <RatePlanCandidates>
          <RatePlanCandidate RatePlanID="${packageId}">
          </RatePlanCandidate>
        </RatePlanCandidates>
        <RoomStayCandidates>
          <RoomStayCandidate RoomID="${roomId}">
          </RoomStayCandidate>
        </RoomStayCandidates>
        <StayDateRange Start="${moment().format("YYYY-MM-DD")}" End="${moment().add(2, 'years').format('YYYY-MM-DD')}">
        </StayDateRange>
      </AvailRequestSegment>
    </AvailRequestSegments>
  </OTA_HotelAvailRQ>`;
}

export const XMLPackageCalendarFormatting = object => {
  const roomRatesList = object.OTA_HotelAvailRS.RoomStays[0].RoomStay[0].RoomRates[0].RoomRate[0].Rates[0].Rate || [];
  let reservedDates = [];
  reservedDates = roomRatesList.map((rate) => ({
    quantity: parseInt(rate['$']['NumberOfUnits']),
    isClosed: rate.TPA_Extensions[0].RestrictionStatus[0]['$'].Status !== 'Open',
    date: moment(rate['$'].EffectiveDate, 'YYYY-MM-DD').format('MM-DD-YYYY')
  }))

  return reservedDates;
}

export const offerCreationXML = ({objectId, errorLang, marketPlaceId, currency, templateId, listingType, listingDuration, startTime, price, retailPrice, offerRepeat}) => {
  const retailPriceXML = retailPrice ? `<RetailPrice>${retailPrice}</RetailPrice>` : '';
  const priceXML = price ? `<Price>${price}</Price>` : '';
  const quantityXML = listingType == 'Fixed Price Offer' ? `<Quantity>25</Quantity>` : `<Quantity>1</Quantity>`;
  const listingDurationXML = listingType == 'Fixed Price Offer' ? `<ListingDuration>GTC</ListingDuration>` : `<ListingDuration>${listingDuration}</ListingDuration>`
  return `<?xml version="1.0" encoding="UTF-8"?>
  <OfferCreationRQ TimeStamp="${moment().format("YYYY-MM-DD hh:mm:ss")}">
    <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
    <SourceId>2</SourceId>
    <ChannelId>1</ChannelId>
    <ObjectId>${objectId}</ObjectId>
    <ErrorLang>${errorLang}</ErrorLang>
    <SiteId>${marketPlaceId}</SiteId>
    <TemplateId>${templateId}</TemplateId>
    <ListingType>${listingType}</ListingType>
    <StartTime>${startTime}</StartTime>
    ${listingDurationXML}
    ${quantityXML}
    ${priceXML}
    ${retailPriceXML}
    <Currency>${currency}</Currency>
    <!--<ShopObjectId>0</ShopObjectId>
    <CollectionObjectId>0</CollectionObjectId>-->
    <OfferRepeat>${offerRepeat ? 'true' : 'false'}</OfferRepeat>
  </OfferCreationRQ>`;
}

export const templateDetailsXML = ({objectId, templateId, errorLang}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<TemplateDetailsRQ TimeStamp="${moment().format("YYYY-MM-DD hh:mm:ss")}">
  <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
  <SourceId>2</SourceId>
  <ChannelId>1</ChannelId>
  <ObjectId>${objectId}</ObjectId>
  <TemplateId>${templateId}</TemplateId>
  <ErrorLang>${errorLang}</ErrorLang>
</TemplateDetailsRQ>`;
}

export const templatePreviewXML = ({objectId, templateId, errorLang}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<TemplatePreviewRQ TimeStamp="${moment().format("YYYY-MM-DD hh:mm:ss")}">
  <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
  <SourceId>2</SourceId>
  <ChannelId>1</ChannelId>
  <ObjectId>${objectId}</ObjectId>
  <TemplateId>${templateId}</TemplateId>
  <ErrorLang>${errorLang}</ErrorLang>
</TemplatePreviewRQ>`;
}

export const XMLTemplateDetailsFormatting = object => {
  const detailList = object.TemplateDetailsRS.Categories[0].PrimaryCategoryDetails[0].PrimaryItemSpecifics[0]['NameValueList'] || [];
  const descriptions = detailList.map((detailObject) => {
    return {
      label: detailObject.Name[0] || null,
      value: detailObject.SValue[0] || detailObject.Value[0] || null
    }
  })
  const images = object.TemplateDetailsRS.PictureDetails[0]['PictureURL'] || [];
  return {descriptions, images};
}

export const XMLTemplatePreviewFormatting = object => {
  return {
    htmlContent: object.TemplatePreviewRS.HtmlContent[0] || null
  }
}

// currently localization is hardcoded
export const updateFAQItemXML = (objectId, items) => {
  const faqItems = items.map((item) => ({
    '@': {
      name: item.question.en ? item.question.en : item.question.de,
      language: item.question.en ? 'en' : 'de',
    },
    '#': item.answer.en ? `<![CDATA[${item.answer.en}]]>` : `<![CDATA[${item.answer.de}]]>`
  }))

  return o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ObjectConfigurationRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        InformationTypes: {
          FAQ: {
            Value: faqItems
          }
        }
      }
    }
  });
}

export const updateTCItemXML = (objectId, items) => {
  const mandatoryItems = {
    StandardBusinessTerms: [
      items[0],
      items[1]
    ],
    CheckoutService: [
      items[2],
      items[3]
    ],
    PaymentService: [
      items[4],
      items[5]
    ],
    VoucherService: [
      items[6],
      items[7]
    ]
  };

  const filteredItems = items.filter((item)=>!checkAndConvertMandatoryToXmlField(item.question.en + item.question.de) && item.question.en + item.question.de)
  
  let additionalValues = ['de', 'en']
    .map(language => {
      let values = filteredItems
        .filter(item => item.question[language])
        .map(item => `<Value language="${language}" name="${item.question[language]}"><![CDATA[${item.answer[language]}]]></Value>`);
      if (values.length > 0) {
        values = values.toString().replaceAll(",", "");
      } else {
        values = `<Value language="${language}" name="" />`;
      }
      return values;
    })
    .toString()
    .replaceAll(',', '');

  return `<?xml version="1.0" encoding="utf-8"?>
  <ObjectConfigurationRQ TimeStamp="${moment().format("YYYY-MM-DD hh:mm:ss")}">
    <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
    <SourceId>2</SourceId>
    <ChannelId>1</ChannelId>
    <ObjectId>${objectId}</ObjectId>
    <InformationTypes>
      <TermsAndConditions>
      ${Object.keys(mandatoryItems).map((key) => {
        return mandatoryItems[key].map(item => {
          return `<${key} language="${item.answer.en ? 'en' : 'de'}"><![CDATA[${item.answer.en ? item.answer.en : item.answer.de}]]></${key}>`
        })
        .toString()
        .replaceAll(",", "")
      })
      .toString()
      .replaceAll(",", "")
    }
        <AdditionalValues>
          ${additionalValues}
        </AdditionalValues>
      </TermsAndConditions>
    </InformationTypes>
    <ErrorLang>en</ErrorLang>
  </ObjectConfigurationRQ>`;
}

export const objectConfigDetailsFetcherXML = (objectId) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ObjectConfigurationDetailsRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
      }
    }
  });




export const reputizeXML = (objectId, data) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ObjectConfigurationRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        Settings: {
          Setting: {
            Name: "Reputize",
            Key: data
          }
        }
      }
    }
  });

  export const offersXML = ({objectId, status = null}) => {
    const payload = {
      AuthenticationCode,
      SourceId: 2,
      ChannelId: 1,
      ObjectId: objectId,
      ErrorLang: "en",
      TemplateId: 0,
      Range: {
        '@': {
          lowerLimit: 0,
          upperLimit: 50,
        }
      }
    };
    if (null !== status) {
      payload.Status = status;
    }
    return o2x({
      '?xml version="1.0" encoding="UTF-8"?': null,
      ListOfOffersRQ: {
        "@": {
          TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
        },
        "#": payload
      }
    });
  }

  export const deleteOfferXML = (objectId, offerId) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    OfferEndItemRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        OfferId: offerId,
      }
    }
  });

  export const stopOfferXML = (objectId, offerId, itemId) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    OfferEndItemRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        OfferId: offerId,
        ItemId: itemId,
      }
    }
  });

  export const memberMessageXML = ({objectId, status, offset, limit}) =>
  o2x({
    '?xml version="1.0" encoding="UTF-8"?': null,
    ListOfMemberMessagesRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        Status: status, 
        ErrorLang: "en",
        Period: {
          '@': {
            From: moment().subtract(20, 'years').format("YYYY-MM-DD hh:mm:ss"),
            To: moment().format("YYYY-MM-DD hh:mm:ss")
          }
        },
        Range: {
          '@': {
            lowerLimit: offset,
            upperLimit: offset + limit,
          }
        }
      }
    }
  });


export const listOfDesignTemplatesXMLRequest = ({objectId, errorLang}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <ListOfDesignTemplatesRQ TimeStamp="${moment().format("YYYY-MM-DD hh:mm:ss")}">
    <AuthenticationCode>${AuthenticationCode}</AuthenticationCode>
    <SourceId>2</SourceId>
    <ChannelId>1</ChannelId>
    <ObjectId>${objectId}</ObjectId>
    <ErrorLang>${errorLang}</ErrorLang>
  </ListOfDesignTemplatesRQ>`;
}

export const formatDesignTemplatesXMLResponse = ({objectId, languageId, response}) => {
  const templates = response.ListOfDesignTemplatesRS.DesignTemplates[0].DesignTemplate
    .filter(template => template.ObjectId[0] == objectId && template.designTemplateLangId[0] == languageId)
    .map(templateObject => {
      let template = {};
      template.categories = [];
      if (templateObject.Categories[0].category) {
        template.categories = templateObject.Categories[0].category.map((categoryObject) => ({
          categoryId: categoryObject.categoryId[0],
          categoryName: categoryObject.categoryName[0],
          footerURL: categoryObject.footerURL[0]
        }))
      }
      template.objectId = objectId;
      template.id = parseInt(templateObject.Id[0]);
      return template;
    });
  return templates;
}

export const savePropertyImagesXMLRequest = ({objectId, imageUrlsByCaptionCode}) => {
  let imageItems = '';
  for (let captionCode of Object.keys(imageUrlsByCaptionCode)) {
    imageItems += `<ImageItem><Description Caption="${captionCode}"/>${(
      imageUrlsByCaptionCode[captionCode]
        .map((imageUrl) => `<ImageFormat><URL>${imageUrl}</URL></ImageFormat>`)
        .toString()
        .replaceAll(",", "")
    )}</ImageItem>`;
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <OTA_HotelDescriptiveContentNotifRQ Target="Production" TimeStamp="${moment().format("YYYY-MM-DDThh:mm:ss")}" TransactionIdentifier="3c1eba87-ebdf-43ba-b26a-0a3450302efd-726220380" Version="1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
    <HotelDescriptiveContents>
      <HotelDescriptiveContent HotelCode="${objectId}">
        <HotelInfo>
          <Descriptions>
            <MultimediaDescriptions>
              <MultimediaDescription>
                <ImageItems>
                ${imageItems}
                </ImageItems>
              </MultimediaDescription>
            </MultimediaDescriptions>
          </Descriptions>
        </HotelInfo>
      </HotelDescriptiveContent>
    </HotelDescriptiveContents>
  </OTA_HotelDescriptiveContentNotifRQ>`;
}

export const formatSavePropertyImagesXMLResponse = object => {
  const result = object.OTA_HotelDescriptiveContentNotifRS.Success ? true : false;
  return { result };
}

  export const sendAnswerXML = (objectId, sellerName, question, answer, messageID, doNotAnswer) => {
    let answerPayload = {
      SellerName: sellerName,
      Question: question,
      DoNotAnswer: doNotAnswer
    };
    if (! doNotAnswer) {
      answerPayload.Answer = answer;
    }
    return o2x({
      '?xml version="1.0" encoding="UTF-8"?': null,
      AnswerBuyerMessageRQ: {
        "@": {
          TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
        },
        "#": {
          AuthenticationCode,
          SourceId: 2,
          ChannelId: 1,
          ObjectId: objectId,
          ErrorLang: "en",
          MemberMessages: {
            '#': {
              MemberMessage: {
                '@': {
                  id: messageID
                },
                '#' : answerPayload
              }
            }
          }
        }
      }
    });
  }
  

  export const paymentXML = (PaymentOption, objectId) =>
  o2x({
    '?xml version="1.0" encoding="utf-8"?': null,
    ObjectConfigurationRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        PaymentOptions: {
          "@" : {
            paymentToHotelier: true
          },
          "#" : {
            PaymentOption,
          }
        },
        ErrorLang: "en",
      }
    }
  });

  export const answerMessageXML = (messageId, objectId) =>
  o2x({
    '?xml version="1.0" encoding="utf-8"?': null,
    MemberMessageDetailsRQ: {
      "@": {
        TimeStamp: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      "#": {
        AuthenticationCode,
        SourceId: 2,
        ChannelId: 1,
        ObjectId: objectId,
        ErrorLang: "en",
        MessageId: messageId
      }
    }
  });

export const eBayGetSessionIdRequestXML = (languageId) => {
  return `<?xml version="1.0" encoding="utf-8"?>
  <GetSessionIDRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <!-- Call-specific Input Fields -->
    <RuName>${getRuName()}</RuName>
    <!-- Standard Input Fields -->
    <ErrorLanguage>${languageId === 'eng' ? 'en_GB' : 'de_DE'}</ErrorLanguage>
    <WarningLevel>${isModeSandbox() ? 'High' : 'Low'}</WarningLevel>
    <!--<MessageID> string </MessageID>
    <Version> string </Version>-->
  </GetSessionIDRequest>`;
}

export const inventoryFetcherByRoomRequestXML = ({ roomId, startDate, endDate }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <OTA_HotelAvailRQ PrimaryLangID="EN" Target="Production" TimeStamp="2011-07-05T09:40:00" TransactionIdentifier="123abcnotif" Version="1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
    <AvailRequestSegments>
      <AvailRequestSegment>
        <RoomStayCandidates>
          <RoomStayCandidate RoomID="${roomId}"/>
        </RoomStayCandidates>
        <StayDateRange End="${endDate}" Start="${startDate}"/>
      </AvailRequestSegment>
    </AvailRequestSegments>
  </OTA_HotelAvailRQ>`;
}