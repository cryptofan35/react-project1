import o2x from "object-to-xml";
import moment from "moment";


// /HotelDataServices/HotelData/ProfileCreate
// OTA_ProfileCreateRQ
// Property create first call
export const address = (values) => o2x({
  '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
  OTA_ProfileCreateRQ: {
    '@': {
      xmlns: 'http://www.opentravel.org/OTA/2003/05',
      TimeStamp: new Date(),
      Version: '1.0',
      TransactionIdentifier: '123abcprofile',
      Target: 'Production'
    },
    '#': {
      Profile: {
        '@': {
          ProfileType: 12,
          CreateDateTime: new Date()
        },
        CompanyInfo: {
          '@': {
            CurrencyCode: values.currency
          },
          CompanyName: {
            '@': {
              TravelSector: 3
            },
            '#': values.name
          },
          AddressInfo: {
            '@': {
              Type: 2,
              UseType: 12
            },
            '#': {
              StreetNmbr: values.street_number,
              CityName: values.city,
              State: values.region,
              PostalCode: values.postcode,
              CountryName: {
                '@': {
                  Code: values.country
                },
              },
              AddressLine: values.street,
              AddressLine2: values.street2
            }
          },
          TelephoneInfo: {
            '@': {
              PhoneNumber: values.phone,
              PhoneTechType: 1,
            }
          },
          // TelephoneInfo: {
          //   '@': {
          //     PhoneNumber: values.fax,
          //     PhoneTechType: 2,
          //   }
          // },
          Email: values.email,
          URL: values.website.split("/").splice(0, 3).join("/")
        }
      }
    }
  },
});

// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Property Name
export const updateNameXML = values => {
  return o2x({
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
              HotelCode: values.objectId,
              HotelName: values.hotelName,
            }
          }
        }
      }
    }
  });
}


// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Secondary fields on Name&Address
export const updateNameAddress = values => o2x({
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
            LanguageCode: values.language,
            HotelCode: values.objectId,
            HotelName: values.name,
            ChainName: values.chain_name ? values.chain_name : " ",
          },
          "#": {
            AffiliationInfo: {
              Awards: {
                Award: {
                  "@": {
                    Rating: values.stars
                  }
                }
              }
            },

            HotelInfo: {
              CategoryCodes: {
                HotelCategory: {
                  "@": {
                    Code: values.type,
                  }
                }
              },

              Position: {
                "@": {
                  Longitude: values.lng,
                  Latitude: values.lat,
                  PositionAccuracyCode: values.zoom,
                }
              },

              TPA_Extensions: {
                ChannelManager: values.manager
              }
            },

            ContactInfos: {
              ContactInfo: {
                "@": {
                  ContactProfileID: "1"
                },
                "#": {
                  Addresses: {
                    Address: {
                      "@": {
                        Type: "1",
                      },
                      "#": {
                        AddressLine: {
                        "#":[values.street,values.street2]
                        },
                        StreetNmbr: values.street_number,
                        CityName: values.city,
                        State: values.region,
                        PostalCode: values.postcode,
                        CountryName: {
                          "@": {
                            Code: values.country
                          }
                        }
                      }
                    }
                  },
                  Phones: {
                    "#": {
                      Phone: {
                        "#": [
                          {
                            "@": {
                              PhoneNumber: values.phone,
                              PhoneTechType: 1,
                            }
                          },
                          {
                            "@": {
                              PhoneNumber: values.fax ? values.fax : 0,
                              PhoneTechType: 3,
                            }
                          },
                        ],
                      },
                    }
                  },
                  Emails: {
                    "#": {
                      Email: {
                        "#": [values.email, values.email2]
                      }
                    }
                  },
                  URLs: {
                    URL: values.website.split("/").splice(0, 3).join("/")
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



// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Billing Address
export const billingAddress = values => o2x({
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
            HotelCode: values.objectId,
          },
          "#": {
            ContactInfos: {
              ContactInfo: {
                "@": {
                  ContactProfileID: "2"
                },
                "#": {
                  CompanyName: {
                    '@': {
                      CodeContext: 'InvoiceRecipient'
                    },
                    '#': values.billing_invoice_recipient || ' ',
                  },
                  Addresses: {
                    Address: {
                      "@": {
                        Type: "2",
                      },
                      "#": {
                        AddressLine: {
                        "#":[values.billing_street,values.billing_street2]
                        },
                        StreetNmbr: values.billing_street_number,
                        CityName: values.billing_city,
                        State: values.billing_region,
                        PostalCode: values.billing_postcode,
                        CountryName: {
                          "@": {
                            Code: values.billing_country,
                          }
                        }
                      }
                    }
                  },
                  Emails: {
                    Email: values.billing_email,
                  },
                }
              }
            }
          }
        }
      }
    }
  }
});

// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Legal Address
export const legalAddress = values => o2x({
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
            HotelCode: values.objectId,
          },
          "#": {
            HotelInfo: {
              "@": {
                TaxID: values.legal_vat_number,
              }
            },
            ContactInfos: {
              ContactInfo: {
                "@": {
                  ContactProfileID: "3"
                },
                "#": {
                  CompanyName: {
                    '@': {
                      CodeContext: 'RegisterNumber',
                      Code: values.legal_register_no,
                    },
                    '#': values.legal_property_name || ' ',
                  },
                  Addresses: {
                    Address: {
                      "@": {
                        Type: "3",
                      },
                      "#": {
                        AddressLine: {
                        "#":[values.legal_street,values.legal_street2]
                        },
                        StreetNmbr: values.legal_street_number,
                        CityName: values.legal_city,
                        State: values.legal_region,
                        PostalCode: values.legal_postcode,
                        CountryName: {
                          "@": {
                            Code: values.legal_country,
                          }
                        }
                      }
                    }
                  },
                  Emails: {
                    Email: values.legal_email,
                  },
                }
              }
            }
          }
        }
      }
    }
  }
});

// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Description
export const description = (values) => {
  return o2x({
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
            HotelCode: values.objectId,
          },
          "#": {
            HotelInfo: {
              Descriptions: {
                MultimediaDescriptions: {
                  MultimediaDescription: {
                    TextItems: {
                      TextItem: {
                        Description: {
                          "@": {
                            TextFormat: "HTML",
                            Language: values.description_language,
                          },
                          "#": values.description_content
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
}

// /HotelDataServices/HotelData/HotelDescriptive
// OTA_HotelDescriptiveContentNotifRQ
// Update of Amenities
export const amenities = ({objectId, codes}) => `<?xml version="1.0" encoding="UTF-8"?>
<OTA_HotelDescriptiveContentNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05" TimeStamp="2020-11-01T22:51:21" Version="1.0" TransactionIdentifier="123abcprofile" Target="Production">
  <HotelDescriptiveContents>
    <HotelDescriptiveContent HotelCode="${objectId}">
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

// /HotelDataServices/HotelData/HotelDescriptiveInfo
// OTA_HotelDescriptiveInfoRQ
// Request body to fetch property based on objectId
export const getProperty = objectId => o2x({
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

export const createProfileWithCurrencyXML = ({currency, propertyName}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <OTA_ProfileCreateRQ xmlns="http://www.opentravel.org/OTA/2003/05" TimeStamp="2021-02-09T07:50:02" Version="1.0" TransactionIdentifier="123abcprofile" Target="Production">
  <Profile ProfileType="12" CreateDateTime="${moment().format("YYYY-MM-DDThh:mm:ss")}">
  <CompanyInfo CurrencyCode="${currency}">
  <CompanyName TravelSector="3">${propertyName}</CompanyName>
  <ChannelManager>Sync with booking.com</ChannelManager>
  <AddressInfo Type="2" UseType="12">
  </AddressInfo>
  </CompanyInfo>
  </Profile>
  </OTA_ProfileCreateRQ>`;
}

const language = { en: "2", de: "1" };

// /HotelDataServices/HotelData/HotelDescriptiveInfo
// OTA_HotelDescriptiveInfoRS
// Parse the Response of OTA_HotelDescriptiveInfoRQ

export const XMLDataFormatting = object => {
  const HotelDescriptiveContent = object.OTA_HotelDescriptiveInfoRS.HotelDescriptiveContents[0].HotelDescriptiveContent[0];

  const nameAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[0];
  const billingAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[1];
  const legalAddress = HotelDescriptiveContent.ContactInfos[0].ContactInfo[2];
  const categoryCodes = HotelDescriptiveContent.HotelInfo[0].CategoryCodes;
  const hotelInfo = HotelDescriptiveContent.HotelInfo[0];
  const services = HotelDescriptiveContent.HotelInfo[0].Services[0];
  const position = HotelDescriptiveContent.HotelInfo[0].Position[0];
  const awards = HotelDescriptiveContent.AffiliationInfo[0].Awards[0];
  const tpaExtensions = HotelDescriptiveContent.HotelInfo[0].TPA_Extensions;
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

  if (awards && awards.Award && awards.Award[0] && awards.Award[0]['$'] && awards.Award[0]['$'].Rating) {
    const rating = awards.Award[0]['$'].Rating;
    rating && (nameAddressInfo.stars = rating > 0 ? rating : null);
  }

  nameAddressInfo.name = HotelDescriptiveContent['$'].HotelName;
  nameAddressInfo.currency = HotelDescriptiveContent['$'].CurrencyCode;
  nameAddressInfo.chain_name = HotelDescriptiveContent['$'].ChainName;

  if (position) {
    position['$'] && position['$'].Longitude && (nameAddressInfo.lng = position['$'].Longitude);
    position['$'] && position['$'].Latitude && (nameAddressInfo.lat = position['$'].Latitude);
    position['$'] && position['$'].PositionAccuracyCode && (nameAddressInfo.zoom = position['$'].PositionAccuracyCode);
  }

  if (categoryCodes && categoryCodes[0] && categoryCodes[0].HotelCategory && categoryCodes[0].HotelCategory[0]['$'] && categoryCodes[0].HotelCategory[0]['$'].Code) {
    const category = categoryCodes[0].HotelCategory[0]['$'].Code;
    category && (nameAddressInfo.type = category);
  }

  if (nameAddress.Addresses) {
    const address = nameAddress.Addresses[0].Address[0];
    address.AddressLine[0] && (nameAddressInfo.street = address.AddressLine[0]);
    address.AddressLine[1] && (nameAddressInfo.street2 = address.AddressLine[1]);
    address.StreetNmbr[0] && (nameAddressInfo.street_number = address.StreetNmbr[0]);
    address.CityName[0] && (nameAddressInfo.city = address.CityName[0]);
    address.State[0] && (nameAddressInfo.region = address.State[0]);
    address.CountryName[0] && (nameAddressInfo.country = address.CountryName[0]['$'].Code);
    address.PostalCode[0] && (nameAddressInfo.postcode = address.PostalCode[0]);

    const email = nameAddress.Emails[0].Email;

    email && email[0] && email[0] && (nameAddressInfo.email = email[0]);
    email && email[1] && email[1]['_'] && (nameAddressInfo.email2 = email[1]['_']);
    nameAddress.URLs && (nameAddressInfo.website = nameAddress.URLs[0].URL[0]);
    nameAddress.Phones && (nameAddressInfo.phone = nameAddress.Phones[0].Phone[0]['$'].PhoneNumber.replace('+', ''));
    nameAddress.Phones && (nameAddressInfo.fax = nameAddress.Phones[0].Phone[1]['$'].PhoneNumber.replace('+', ''));
  }

  const billingAddressInfo = {};

  if (billingAddress.CompanyName) {
    const company = billingAddress.CompanyName;
    company[0] && company[0]['_'] && (billingAddressInfo.billing_invoice_recipient = company[0]['_']);
  }

  if (billingAddress.Addresses) {
    const address = billingAddress.Addresses[0].Address[0];
    address.AddressLine[0] && (billingAddressInfo.billing_street = address.AddressLine[0]);
    address.AddressLine[1] && (billingAddressInfo.billing_street2 = address.AddressLine[1]);
    address.StreetNmbr[0] && (billingAddressInfo.billing_street_number = address.StreetNmbr[0]);
    address.CityName[0] && (billingAddressInfo.billing_city = address.CityName[0]);
    address.State[0] && (billingAddressInfo.billing_region = address.State[0]);
    address.CountryName[0] && (billingAddressInfo.billing_country = address.CountryName[0]['$'].Code);
    address.PostalCode[0] && (billingAddressInfo.billing_postcode = address.PostalCode[0]);
    const email = billingAddress.Emails[0].Email;
    email && email[0] && email[0] && (billingAddressInfo.billing_email = email[0]);
  }

  const legalAddressInfo = {};

  if (hotelInfo) {
    hotelInfo['$'] && hotelInfo['$'].TaxID && (legalAddressInfo.legal_vat_number = hotelInfo['$'].TaxID);
  }

  if (legalAddress.CompanyName) {
    const company = legalAddress.CompanyName;
    company[0] && company[0]['_'] && (legalAddressInfo.legal_property_name = company[0]['_']);
    company[0] && company[0]['$'] && company[0]['$']['Code'] && (legalAddressInfo.legal_register_no = company[0]['$']['Code']);
  }

  if (legalAddress.Addresses) {
    const address = legalAddress.Addresses[0].Address[0];
    address.AddressLine[0] && (legalAddressInfo.legal_street = address.AddressLine[0]);
    address.AddressLine[1] && (legalAddressInfo.legal_street2 = address.AddressLine[1]);
    address.StreetNmbr[0] && (legalAddressInfo.legal_street_number = address.StreetNmbr[0]);
    address.CityName[0] && (legalAddressInfo.legal_city = address.CityName[0]);
    address.State[0] && (legalAddressInfo.legal_region = address.State[0]);
    address.CountryName[0] && (legalAddressInfo.legal_country = address.CountryName[0]['$'].Code);
    address.PostalCode[0] && (legalAddressInfo.legal_postcode = address.PostalCode[0]);
    const email = legalAddress.Emails[0].Email;
    email && email[0] && email[0] && (legalAddressInfo.legal_email = email[0]);
  }

  const amenitiesInfo = {};
  if (services) {
    let codeInfo = {};
    services.Service.forEach(s => Object.assign(codeInfo, {[s['$'].Code]: true}));
    amenitiesInfo.amenities = codeInfo;
  }

  const descriptionNode = text.TextItem[0].Description;

  const descriptionsInfo = {};
  if (descriptionNode) {
    let descriptions = {};
    descriptionNode.forEach(description => Object.assign(descriptions, {[description['$'].Language]: description['_']}));
    descriptionsInfo.descriptions = descriptions;
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

  let channelManagerInfo = { manager: 'no' }
  if (tpaExtensions && tpaExtensions[0].ChannelManager[0]) {
    channelManagerInfo = { manager: tpaExtensions[0].ChannelManager[0] };
  }

  return {
    ...nameAddressInfo,
    ...descriptionsInfo,
    ...billingAddressInfo,
    ...legalAddressInfo,
    ...amenitiesInfo,
    ...roomsInfo,
    ...channelManagerInfo,
    ...hotelImagesInfo,
  }
}
