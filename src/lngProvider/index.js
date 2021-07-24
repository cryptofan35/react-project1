import enLang from "./entries/en-US";
import arLang from "./entries/ar_SA";
import deLang from "./entries/de_DE";
import {addLocaleData} from "react-intl";

const AppLocale = {
  en: enLang,
  ar: arLang,
  de: deLang
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.ar.data);
addLocaleData(AppLocale.de.data);

export default AppLocale;
