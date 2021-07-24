import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import Data from "./Data";
import Packages from "./Packages";
import Property from "./Property";
import Picture from "./Picture";
import Users from "./Users";
import Calendars from "./Calendars";
import { reducer as toastrReducer } from "react-redux-toastr";
import Ebay from "./Ebay";
import RunningPackages from "./RunningPackages";
import Views from "./Views";
import DashboardVouchers from "./DashboardVouchers";
import Buyers from "./Buyers";
import vouchersReducer from "./Voucher";
import GlobalReducer from "./Global";
import uploadTemplateReducer from "./UploadTemplate";
import Rooms from "./Rooms";
import Amenities from './Amenities';

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  commonData: Common,
  data: Data,
  packages: Packages,
  property: Property,
  picture: Picture,
  users: Users,
  calendars: Calendars,
  toastr: toastrReducer,
  ebay: Ebay,
  voucher: vouchersReducer,
  global: GlobalReducer,
  uploadTemplate: uploadTemplateReducer,
  rooms: Rooms,
  runningPackages: RunningPackages,
  views: Views,
  dashboardVouchers: DashboardVouchers,
  buyers: Buyers,
  amenities: Amenities,
});

export default reducers;
