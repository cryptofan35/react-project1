import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../../components/Common/Page";
import "./styles.less";
import Form from "../../../components/Common/Form";
import {
  getEbaySettings,
  changeEbaySettings,
  changeReputize,
  addMarketPlace,
  removeMarketPlace,
  addEmailItem,
  changeEmailSettings,
  updatedEmailSettings,
  getConfigDetails,
  getTokenStatus,
  getSessionId,
  setSessionId,
  fetchToken
} from "../../../appRedux/actions/Ebay";
import { getProperty } from "../../../appRedux/actions/Property";
import {
  marketPlaceSchema,
  emailSettingsSchema,
  validateEmail,
} from "../../../validation/Ebay/settings";
import InfoIcon from "@2fd/ant-design-icons/lib/AlertCircleOutline";
import CloseCircle from "@2fd/ant-design-icons/lib/CloseCircle";
import { SELECT, CUSTOM } from "../../../constants/FormFieldTypes";
import { Select, Checkbox, Button } from "antd";
import Field from "../../../components/Common/FIeld";
import FieldLabel from "../../../components/Common/FieldLabel";
import { MARKET_PLACES } from "../../../constants/Ebay/marketPlaces";
import DropdownIcon from "../../../components/Common/Icons/DropdownIcon";
import { PAYMENT_ACCOUNTS } from "../../../mocks/Ebay/settings";
import { Redirect } from "react-router-dom";
import { removeItemFromObject } from "util/objects/filters";
import { useFormatMessage } from 'react-intl-hooks';
import { ComponentWithLoader } from "../../../components/ComponentWithLoader";
import moment from "moment";
import { getSigninUrl } from "constants/Ebay/api";
import queryString from 'query-string';

const allValuesFalse = (object) =>
  Object.values(object).every((value) => !value);

const SELECT_PLACEHOLDER = "Select";
const CULTUZZ_ACCOUNT = "Cultuzz Account";

const isDisabled = (emails, validationEmails) => {
  const isValidEmail = emails.every((value) => validateEmail(value.email));

  const isEmptyNewEmails = Object.keys(validationEmails).every(
    (_, index) => validationEmails[index]
  );
  const isAllCheckboxesInSomeRawFalse = emails.some((item) => {
    const filteredObject = removeItemFromObject("email", item);
    return allValuesFalse(filteredObject);
  });

  return !isValidEmail || !isEmptyNewEmails || isAllCheckboxesInSomeRawFalse;
};

const EbaySettings = ({
  settings,
  property,
  objectId,
  getEbaySettings,
  changeEbaySettings,
  changeEmailSettings,
  updatedEmailSettings,
  getConfigDetails,
  addMarketPlace,
  removeMarketPlace,
  addEmailItem,
  getProperty,
  loading,
  getTokenStatus,
  tokenStatus,
  getSessionId,
  setSessionId,
  sessionId,
  location,
  fetchToken
}) => {
  const {
    paymentAccounts = PAYMENT_ACCOUNTS,
    emails = [],
  } = settings;
  const [selectedPaymentAccountID, setSelectedPaymentAccountID] = useState(
    null
  );
  let paymentAccount = paymentAccounts.length
    ? paymentAccounts.find(({ id }) => id === selectedPaymentAccountID)
    : null;
  const [countrySelectOptions, setCountrySelectOptions] = useState(
    MARKET_PLACES
  );
  const [paymentAccountType, changePaymentAccounType] = useState(
    "Hotelier Account"
  );
  const [checkHotelier, changeHotelier] = useState(true);

  const [isValidEmailForms, setIsValidEmailForms] = useState({});
  const [isAllFieldsNotChecked, setIsAllFieldsNotChecked] = useState({});
  const [tokenStatusText, setTokenStatusText] = useState(null);
  const [tokenStatusClassName, setTokenStatusClassName] = useState(null);
  const [tokenExpiryDate, setTokenExpiryDate] = useState(null);
  const [tokenButtonText, setTokenButtonText] = useState(null);
  const [showTokenButton, setShowTokenButton] = useState(true);
  const t = useFormatMessage();

  // Set the initial country select options.
  useEffect(() => {
    if (paymentAccount && paymentAccount.marketPlaces) {
      const updatedCountrySelection = countrySelectOptions.filter(
        ({ id }) =>
          !paymentAccount.marketPlaces.find(
            (marketPlace) => marketPlace.id == id
          )
      );

      setCountrySelectOptions(updatedCountrySelection);
    }
  }, [paymentAccount]);

  useEffect(() => {
    if (!objectId) return;
    getEbaySettings(objectId);
    getConfigDetails(objectId);
    getTokenStatus();
  }, [objectId]);

  useEffect(() => {
    getProperty();
  }, []);

  useEffect(() => {
    const account = paymentAccounts[0];
    account && setSelectedPaymentAccountID(account.id);
  }, [paymentAccounts.length]);

  useEffect(() => {
    if (! tokenStatus) {
      setTokenStatusText(null);
      setTokenStatusClassName('none');
      setTokenExpiryDate(null);
      setTokenButtonText(null);
      setShowTokenButton(false);
      return;
    }

    if (tokenStatus.isTokenSet) {
      const now = moment();
      const expiryDate = moment(tokenStatus.expiryDate);
      setTokenExpiryDate(tokenStatus.expiryDate);
      // TODO check the timezone of the expiryDate
      if (expiryDate < now) {
        setTokenStatusText(t({id: 'app.ebay.settings.expired'}));
        setTokenStatusClassName('passive');
        setTokenButtonText(t({id: 'app.ebay.settings.renew_token'}));
        setShowTokenButton(true);
      } else {
        setTokenStatusText(t({id: 'app.ebay.settings.active'}));
        setTokenStatusClassName('active');
        setTokenButtonText(null);
        setShowTokenButton(false);
      }
      return;
    }

    setShowTokenButton(true);
    setTokenStatusText(t({id: 'app.ebay.settings.no_token'}));
    setTokenStatusClassName('none');
    setTokenButtonText(t({id: 'app.ebay.settings.generate_token'}));
    setTokenExpiryDate(null);
    return;
  }, [tokenStatus]);

  useEffect(() => {
    if (! sessionId) {
      return;
    }

    window.location = getSigninUrl(sessionId);
  }, [sessionId])

  useEffect(() => {
    if (! location || ! objectId) {
      return;
    }
    const query = queryString.parse(location.search);
    if (undefined === query.accepted) {
      return;
    }

    const accepted = parseInt(query.accepted);
    if (accepted) {
      fetchToken();
      return;
    }
    setSessionId(null);
  }, [objectId, location])

  const generateToken = () => {
    getSessionId();
  }

  const renewToken = () => {
    getSessionId();
  }

  const onTokenButtonClick = () => {
    if (! tokenStatus) {
      return;
    }
    if (! tokenStatus.isTokenSet) {
      return generateToken();
    }

    return renewToken();
  }

  const onChangeEmailSettings = (emails, idx, fieldName, value) => {
    const currentEmail = emails[idx];

    const newEmails = emails.map((email, emailIdx) => {
      return emailIdx === idx ? { ...currentEmail, [fieldName]: value } : email;
    });

    const payload = { objectId: objectId, emails: newEmails };
    return updatedEmailSettings(payload);
  };

  const submitEmailSettings = () => {
    const payload = { objectId: objectId, emails };
    return changeEmailSettings(payload);
  };

  const removeEmail = (idx) => {
    const newEmails = emails.filter((email, emailIdx) => idx !== emailIdx);
    const payload = { objectId, emails: newEmails };

    delete isValidEmailForms[idx];
    return changeEmailSettings(payload);
  };

  const getIsValidForm = (index) => (isValid) => {
    setIsValidEmailForms({ ...isValidEmailForms, ...{ [index]: isValid } });
  };

  const onMarketplaceFormSubmit = (values, id) => {
    if (values.country === SELECT_PLACEHOLDER) {
      return;
    }

    let updatedMarketPlaces = paymentAccount.marketPlaces.map(
      (place, _index) => {
        const { id: placeID } = place;

        if (placeID === id) {
          return {
            ...place,
            ...values
          };
        }

        return place;
      }
    );

    const temp = updatedMarketPlaces;
    const foundedItem = temp.find(
      (el) => el.country === values.country
    );
    foundedItem.email = values.email;
    foundedItem.id = MARKET_PLACES.find(({value}) => value == foundedItem.country).id;
    updatedMarketPlaces = temp;

    changeEbaySettings({
      paymentAccounts: paymentAccounts.map(
        (account) => {
          if (account.id === paymentAccount.id) {
            return {
              ...account,
              marketPlaces: updatedMarketPlaces,
            };
          }

          return account;
        }
      ),
    });
  }

  if (property && ! objectId) {
    const query = queryString.parse(location.search);
    if (undefined === query.accepted) {
      return <Redirect to="/"/>
    }
  }

  if (!objectId) {
    /**
     * there is no redirect component because when the user comes from eBay auth url,
     * there may not be any property loaded from the api yet.
     */
    return <ComponentWithLoader loading={true}></ComponentWithLoader>
  }

  return (
    <ComponentWithLoader loading={loading}>
      <Page title={t({id: 'app.ebay.settings.settings'})} className={"ebaySettings"}>
      <div className="ebaySettings-form">
        <h3>{t({id: 'app.ebay.settings.ebay_token'})} <span>*</span></h3>
        <div className="ebaySettings-token">
          <div className="status">
            <div className="label">
              <p>{t({id: 'app.ebay.settings.status'})}:</p>
            </div>
            <div className={tokenStatusClassName}>
              {tokenStatusText}
            </div>
          </div>
          <div className="expirationDate">
            <div className="label">
              <p>{t({id: 'app.ebay.settings.expiration_date'})}:</p>
            </div>
            <div>{tokenExpiryDate}</div>
          </div>
          <div className="buttonContainer">
            {showTokenButton && (
              <button className="ant-btn ant-btn-primary" type="button" onClick={onTokenButtonClick}>
                <span>{tokenButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {paymentAccount && (
        <div className={"ebaySettings-form"}>
          <h3>{t({id: 'app.ebay.settings.paypal_account'})}</h3>

          <div className={"ebaySettings-paymentAccount"}>
            {paymentAccountType != CULTUZZ_ACCOUNT ? (
              <div className={"addBtn"}>
                <span
                  onClick={() => {
                    addMarketPlace(paymentAccount.id, paymentAccountType);
                  }}
                >
                  + {t({id: 'app.ebay.settings.add_marketplace'})}
                </span>
              </div>
            ) : null}
          </div>
          <div className={"ebaySettings-marketPlaces"}>
            <div className={"ebaySettings-marketPlaces-labels"}>
              {paymentAccountType != CULTUZZ_ACCOUNT ? (
                <>
                  <FieldLabel text={t({id: 'app.ebay.settings.marketplace'})} />
                  <FieldLabel text={t({id: 'app.ebay.settings.paypal_email_id'})} />
                </>
              ) : null}
            </div>
            {paymentAccount.marketPlaces &&
              paymentAccount.marketPlaces.map((payload, itemIndex) => {
                const {
                  country,
                  email,
                  id,
                  countryOptions,
                  hotelier,
                } = payload;

                if (hotelier === checkHotelier) {
                  return (
                    <div
                      key={id}
                      className={"ebaySettings-marketPlaces-form grouped"}
                    >
                      <CloseCircle
                        className="closer"
                        onClick={() => {
                          removeMarketPlace(
                            paymentAccount.id,
                            id,
                            paymentAccount.marketPlaces
                          );
                        }}
                      />
                      <Form
                        submitAction={"blur"}
                        withReset={false}
                        initialValues={{
                          country: MARKET_PLACES.find(
                            (el) => el.id === Number(id)
                          )
                            ? MARKET_PLACES.find((el) => el.id === Number(id))
                                .value
                            : SELECT_PLACEHOLDER,
                          email,
                        }}
                        onSubmit={(values) => onMarketplaceFormSubmit(values, id)}
                        schema={marketPlaceSchema}
                        rows={[
                          [
                            {
                              name: "country",
                              type: SELECT,
                              options: countrySelectOptions,
                              onSelect: (values, handleSubmit) => {
                                if (country || values.country) {
                                  handleSubmit();
                                }
                              },
                              onChange: (value) => {
                                // Get the place index.
                                const placeIndex = paymentAccount.marketPlaces.findIndex(
                                  (marketPlace) => marketPlace.id === id
                                );
                                // Set the country value.
                                paymentAccount.marketPlaces[
                                  placeIndex
                                ].country = value;
                                // Reset the state.
                                const updatedCountrySelection = countrySelectOptions.filter(
                                  (country) => country.value != value
                                );
                                setCountrySelectOptions(
                                  updatedCountrySelection
                                );
                              },
                            },
                            {
                              name: "email",
                              placeholder: "example@mail.com",
                            },
                          ],
                        ]}
                      />
                    </div>
                  );
                }
              })}
          </div>
        </div>
      )}
      <div className={"ebaySettings-form ebaySettings-emails"}>
        <h3>{t({id: 'app.ebay.settings.email_settings'})}</h3>
        <div className={"addBtn"}>
          <span onClick={addEmailItem}>+ {t({id: 'app.ebay.settings.add_email'})}</span>
        </div>
        <div className={"ebaySettings-emails-items"}>
          {emails.map(
            (
              {
                email,
                payMailOption,
                bookingMailOption,
                eoaMailOption,
                enqMailOption,
                id,
              },
              idx
            ) => {
              const isAllFieldsNotChecked = allValuesFalse(
                removeItemFromObject("email", emails[idx])
              );
              const allInvalid = isAllFieldsNotChecked ? "invalid-field" : "";

              return (
                <div
                  className={"ebaySettings-emails-items-form grouped"}
                  key={id || `idx-${idx}`}
                >
                  <CloseCircle
                    className="closer"
                    onClick={() => removeEmail(idx)}
                  />
                  <Form
                    withReset={false}
                    initialValues={{
                      email,
                      payMailOption,
                      bookingMailOption,
                      eoaMailOption,
                      enqMailOption,
                    }}
                    schema={emailSettingsSchema}
                    submitAction="blur"
                    validateOnChange
                    validateOnMount
                    getIsValidForm={getIsValidForm(idx)}
                    rows={[
                      [
                        {
                          name: "email",
                          placeholder: "example@mail.com",
                          onChange: ({ target }) => {
                            const { value } = target;
                            onChangeEmailSettings(emails, idx, "email", value);
                          },
                        },
                        {
                          name: "settings",
                          type: CUSTOM,
                          component: (
                            <div
                              className={
                                "ebaySettings-emails-items-form-checkboxes"
                              }
                            >
                              <div
                                className={
                                  "ebaySettings-emails-items-form-checkboxes-column"
                                }
                              >
                                <Checkbox
                                  className={allInvalid}
                                  checked={payMailOption}
                                  onChange={async ({ target }) => {
                                    const { checked } = target;

                                    await onChangeEmailSettings(
                                      emails,
                                      idx,
                                      "payMailOption",
                                      checked
                                    );
                                  }}
                                >
                                  {t({id: 'app.ebay.settings.payment_email'})}
                                </Checkbox>
                                <Checkbox
                                  className={allInvalid}
                                  checked={bookingMailOption}
                                  onChange={({ target }) => {
                                    const { checked } = target;

                                    onChangeEmailSettings(
                                      emails,
                                      idx,
                                      "bookingMailOption",
                                      checked
                                    );
                                  }}
                                >
                                  {t({id: 'app.ebay.settings.reservation_email'})}
                                </Checkbox>
                              </div>
                              <div
                                className={
                                  "ebaySettings-emails-items-form-checkboxes-column"
                                }
                              >
                                <Checkbox
                                  className={allInvalid}
                                  checked={eoaMailOption}
                                  onChange={({ target }) => {
                                    const { checked } = target;

                                    onChangeEmailSettings(
                                      emails,
                                      idx,
                                      "eoaMailOption",
                                      checked
                                    );
                                  }}
                                >
                                  {t({id: 'app.ebay.settings.end_of_auction_email'})}
                                </Checkbox>
                                <Checkbox
                                  className={allInvalid}
                                  checked={enqMailOption}
                                  onChange={({ target }) => {
                                    const { checked } = target;

                                    onChangeEmailSettings(
                                      emails,
                                      idx,
                                      "enqMailOption",
                                      checked
                                    );
                                  }}
                                >
                                  {t({id: 'app.ebay.settings.bidder_enquiry_email'})}
                                </Checkbox>
                              </div>
                            </div>
                          ),
                        },
                      ],
                    ]}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
      {emails.length > 0 && (
        <div className={"ebaySettings-emails-button"}>
          <Button
            disabled={isDisabled(emails, isValidEmailForms)}
            type="primary"
            onClick={submitEmailSettings}
          >
            {t({id: 'app.common.submit'})}
          </Button>
        </div>
      )}
    </Page>

    </ComponentWithLoader>
    );
};

const mapStateToProps = ({ ebay, property, commonData }) => ({
  settings: ebay.settings,
  tokenStatus: ebay.tokenStatus,
  property: property && property.property || null,
  objectId:
    (property && property.property && property.property.objectId) || null,
  loading: commonData.loading,
  sessionId: ebay.sessionId
});

const mapDispatchTopProps = {
  getEbaySettings,
  changeEbaySettings,
  addMarketPlace,
  removeMarketPlace,
  addEmailItem,
  getProperty,
  changeEmailSettings,
  updatedEmailSettings,
  changeReputize,
  getConfigDetails,
  getTokenStatus,
  getSessionId,
  setSessionId,
  fetchToken
};

export default connect(mapStateToProps, mapDispatchTopProps)(EbaySettings);
