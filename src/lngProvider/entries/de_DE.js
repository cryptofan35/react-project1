import antdDe from "antd/lib/locale-provider/de_DE";
import appLocaleData from "react-intl/locale-data/de";
import enMessages from "../locales/de_DE.json";

const DeLang = {
  messages: {
    ...enMessages
  },
  antd: antdDe,
  locale: 'de',
  data: appLocaleData
};

export default DeLang;
