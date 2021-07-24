import React from "react";

import ViewDashboard from "@2fd/ant-design-icons/lib/ViewDashboard";
import Domain from "@2fd/ant-design-icons/lib/Domain";
import CalendarRange from "@2fd/ant-design-icons/lib/CalendarRange";
import AccountBox from "@2fd/ant-design-icons/lib/AccountBox";
import AccountMultiplePlus from "@2fd/ant-design-icons/lib/AccountMultiplePlus";
import Bed from "@2fd/ant-design-icons/lib/Bed";
import Cart from "@2fd/ant-design-icons/lib/Cart";
import Image from "@2fd/ant-design-icons/lib/Image";
import CreditCardOutline from "@2fd/ant-design-icons/lib/CreditCardOutline";
import HelpBox from "@2fd/ant-design-icons/lib/HelpBox";
import { ReactComponent as ObjectAdmin } from "../assets/svg/object-administration.svg";
import { ReactComponent as Packages } from "../assets/svg/packages.svg";
import { ReactComponent as Voucher } from "../assets/svg/voucher.svg";
import roleNames, { allRoleNames } from "../util/roleNames";

const omitLinks = ["property/import"];

export const ebayMenuData = (property) => [
  ...(property && property.objectId
    ? [
        {
          key: "dashboard",
          name: "sidebar.dashboard",
          pathname: "/dashboard",
          icon: <ViewDashboard style={{ fontSize: 24, opacity: 0.8 }} />,
          allowedRoles: allRoleNames,
          childs: [],
        },
      ]
    : []),
  {
    key: "property",
    name: "app.sidebar.property_data",
    pathname: "/property",
    icon: <Domain style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    requires: ["property"],
    hasMarker: ({property}) => !property || !property.objectId,
    childs: [
      {
        key: "property/name",
        name: "app.sidebar.property.name_address",
        pathname: "/property/name",
      },
      {
        key: "property/billing",
        name: "app.sidebar.property.billing_address",
        pathname: "/property/billing",
        requires: ["propertyObjectId"],
      },
      {
        key: "property/legal",
        name: "app.sidebar.property.legal_address",
        pathname: "/property/legal",
        requires: ["propertyObjectId"],
      },
      {
        key: "property/description",
        name: "app.sidebar.property.description",
        pathname: "/property/description",
        requires: ["propertyObjectId"],
      },
      {
        key: "property/pictures",
        name: "app.sidebar.property.pictures",
        pathname: "/property/pictures",
        requires: ["propertyObjectId"],
        requires: ["propertyObjectId"],
      },
      {
        key: "property/amenities",
        name: "app.sidebar.property.amenities",
        pathname: "/property/amenities",
        requires: ["propertyObjectId"],
      },
      {
        key: "property/import",
        name: "app.sidebar.property.import",
        pathname: "/property/import",
        requires: ["propertyObjectId"],
      },
    ].filter(({ key }) => {
      return property && property.objectId === null
        ? !omitLinks.includes(key)
        : true;
    }),
  },
  {
    key: "rooms",
    name: "sidebar.rooms",
    pathname: "/rooms",
    icon: <Bed style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    childs: [],
    requires: ["propertyObjectId"],
    hasMarker: ({rooms}) => rooms.length === 0
  },
  {
    key: "packages",
    name: "sidebar.packages",
    pathname: "/packages",
    icon: (
      <span
        role="img"
        className="anticon"
        style={{ fontSize: 24, opacity: 0.8 }}
      >
        <Packages />
      </span>
    ),
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    hasMarker: ({packages, totalOfferCount}) => packages.length === 0 || totalOfferCount === 0,
    childs: [
      {
        key: "packages/templates",
        name: "sidebar.packages.templates",
        pathname: "/packages/templates"
      },
      {
        key: "packages/offers",
        name: "sidebar.packages.offers_on_ebay",
        pathname: "/packages/offers",
      },
    ],
    requires: ["propertyObjectId"],
  },
  {
    key: "calendars",
    name: "sidebar.calendars",
    pathname: "/calendars",
    icon: <CalendarRange style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    requires: ["propertyObjectId"],
    childs: [
      {
        key: "calendars/packages",
        name: "app.calendars.packages.packages_calendar",
        pathname: "/calendars/packages",
      },
      {
        key: "calendars/rooms",
        name: "app.calendars.availability.availability_calendar",
        pathname: "/calendars/rooms"
      },
      {
        key: "calendars/update",
        name: "app.calendars.quick_update.quick_update",
        pathname: "/calendars/update"
      },
    ],
  },
  ...(property && property.objectId
    ? [
        {
          key: "ebay",
          name: "sidebar.ebay",
          pathname: "/ebay",
          icon: <Cart style={{ fontSize: 24, opacity: 0.8 }} />,
          allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
          hasMarker: ({hasEbayToken}) => !hasEbayToken,
          childs: [
            {
              key: "ebay/settings",
              name: "app.ebay.settings.settings",
              pathname: "/ebay/settings",
            },
            {
              key: "ebay/faq",
              name: "app.ebay.faq.faq_tc",
              pathname: "/ebay/faq",
            },
            {
              key: "ebay/messages",
              name: "app.ebay.messages.ebay_messages",
              pathname: "/ebay/messages",
            },
            {
              key: "ebay/mailArchive",
              name: "app.ebay.messages.mail_archive",
              pathname: "/ebay/mailArchive",
            },
          ],
        },
      ]
    : []),
  ...(property && property.objectId
    ? [
        {
          key: "voucher",
          name: "app.ebay.vouchers.voucher_administration",
          pathname: "/vouchers",
          icon: (
            <span
              role="img"
              className="anticon"
              style={{ fontSize: 24, opacity: 0.8 }}
            >
              <Voucher />
            </span>
          ),
          allowedRoles: allRoleNames,
          childs: [],
        },
      ]
    : []),
  {
    key: "pictures",
    name: "sidebar.pictures",
    pathname: "/pictures",
    icon: <Image style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    childs: [],
    requires: ["propertyObjectId"],
  },
];

export const accountMenuData = (property) => [
  {
    key: "profile",
    name: "sidebar.my_profile",
    pathname: "/profile",
    icon: <AccountBox style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: allRoleNames,
    childs: [],
  },
  {
    key: "objects",
    name: "sidebar.object_administration",
    pathname: "/objects",
    icon: (
      <span
        role="img"
        className="anticon"
        style={{ fontSize: 24, opacity: 0.8 }}
      >
        <ObjectAdmin />
      </span>
    ),
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    childs: [],
  },
  {
    key: "users",
    name: "sidebar.user_administration",
    pathname: "/users",
    icon: <AccountMultiplePlus style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    childs: [],
  },
  {
    key: "billingplan",
    name: "sidebar.billing_plan",
    pathname: "/billingplan",
    icon: <CreditCardOutline style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: [roleNames.ADMIN, roleNames.OPERATOR],
    hasMarker: () => false,
    childs: [
      {
        key: "billingplan/plan",
        name: "sidebar.billing_plan.plan",
        pathname: "/billingplan/plan",
      },
      {
        key: "billingplan/billing",
        name: "sidebar.billing_plan.billing",
        pathname: "/billingplan/billing",
      },
      {
        key: "billingplan/invoices",
        name: "sidebar.billing_plan.invoices",
        pathname: "/billingplan/invoices",
      },
    ],
  },
  {
    key: "helpcenter",
    name: "sidebar.help_center",
    pathname: "/helpcenter",
    icon: <HelpBox style={{ fontSize: 24, opacity: 0.8 }} />,
    allowedRoles: allRoleNames,
    childs: [],
  },

];
