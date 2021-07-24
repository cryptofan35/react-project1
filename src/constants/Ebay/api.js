export const SANDBOX_URL = 'https://api.sandbox.ebay.com/ws/api.dll';

/*export const SANDBOX_RU_NAME = 'sedat_sevgili-sedatsev-TryOut-nycriiz';
export const SANDBOX_APP_ID = 'sedatsev-TryOut-SBX-bd4af8740-6100da2e';
export const SANDBOX_DEV_ID = '4d24d8ea-eab3-46d3-b84f-727862699b60';
export const SANDBOX_CERT_ID = 'SBX-d4af8740242d-19b2-440d-b690-8a03';
*/

export const SANDBOX_RU_NAME = 'CDM-v1zz1-Cultuzz-CultBay-Kolibri';
export const SANDBOX_APP_ID = 'v1zz1';
export const SANDBOX_DEV_ID = 'npcltzzdgtl';
export const SANDBOX_CERT_ID = 'npcltzzdgtl9996';

export const PRODUCTION_URL = 'https://api.ebay.com/ws/api.dll';
export const PRODUCTION_RU_NAME = 'Cultuzz_Digital-CULTUZZDIGK8E44-uieznlom';
export const PRODUCTION_APP_ID = 'CULTUZZDIGK8E44XH4HRN8C1SM1UEE';
export const PRODUCTION_DEV_ID = 'npcltzzdgtl';
export const PRODUCTION_CERT_ID = 'E196J7F87FS$5KX6X8GZO-7A8I7152';

export const MODE_SANDBOX = 'MODE_SANDBOX';
export const MODE_PRODUCTION = 'MODE_PRODUCTION';

// toggle this to try production
export const MODE = MODE_PRODUCTION;

export const isModeSandbox = () => {
  return MODE === MODE_SANDBOX;
}

export const getUrl = () => {
  return isModeSandbox() ? SANDBOX_URL : PRODUCTION_URL;
}

export const getRuName = () => {
  return isModeSandbox() ? SANDBOX_RU_NAME : PRODUCTION_RU_NAME;
}

export const getAppId = () => {
  return isModeSandbox() ? SANDBOX_APP_ID : PRODUCTION_APP_ID;
}

export const getDevId = () => {
  return isModeSandbox() ? SANDBOX_DEV_ID : PRODUCTION_DEV_ID;
}

export const getCertId = () => {
  return isModeSandbox() ? SANDBOX_CERT_ID : PRODUCTION_CERT_ID;
}

export const getSigninUrl = (sessionId) => {
  if (isModeSandbox()) {
    return `https://signin.sandbox.ebay.com/ws/eBayISAPI.dll?SignIn&RUName=${getRuName()}&SessID=${sessionId}`;
  }

  return `https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&RUName=${getRuName()}&SessID=${sessionId}`;
}