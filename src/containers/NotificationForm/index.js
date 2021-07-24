import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AlertCircleOutline from "@2fd/ant-design-icons/lib/AlertCircleOutline";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { getTokenStatus } from "appRedux/actions/Ebay";
import { setNotificationMessage } from "appRedux/actions";
import { useFormatMessage } from 'react-intl-hooks';
import roleNames from "../../util/roleNames";

const messagesList = {
  addEbayAccount: {
    title: "Add your eBay and PayPal account",
    description: `To be able start selling on eBay, please, add your existing eBay Seller account.
                If you do not have it, go first to eBay system to create one.
                The revenue will be transferred to your PayPal account. Please, add the PayPal account or create new if you don not have it yet.`,
    showLink: true,
  }
};

const NotificationForm = (props) => {
  const { property, tokenStatus, getTokenStatus, setNotificationMessage, notificationMessage, roleName} = props;
  const [ showLink, setShowLink ] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const t = useFormatMessage();
  const isGuestUser = roleName === roleNames.GUEST;

  useEffect(() => {
    setShowMessageForm((notificationMessage.title.length > 0 || notificationMessage.message.length > 0) && !isGuestUser);
  }, [notificationMessage]);

  useEffect(() => {
    if (property && property.objectId) {
      getTokenStatus();
    }
  }, [property]);

  useEffect(() => {
    setShowLink(false);
    if (property && !property.objectId) {
      setNotificationMessage();
      return;
    }
    if (tokenStatus && !tokenStatus.isTokenSet) {
      setNotificationMessage(
        'app.notifications.add_ebay.title',
        'app.notifications.add_ebay.message'
      );
      setShowLink(true);
      return;
    }
  }, [property, tokenStatus]);

  return (
    <>
      {showMessageForm && (
        <section className="notification-message">
          <div className="wrapper">
            <AlertCircleOutline />
            <div className="content">
              <div className="title">{notificationMessage.title && t({id: notificationMessage.title, defaultMessage: notificationMessage.title})}</div>
              <p className="description">{notificationMessage.message && t({id: notificationMessage.message, defaultMessage: notificationMessage.message})}</p>
            </div>
          </div>
          {showLink && (
            <Link to="/ebay/settings">
              <Button type="primary" className="link">
                {t({id: 'app.dashboard.add_ebay_account'})}
              </Button>
            </Link>
          )}
        </section>
      )}
    </>
  );

}

const mapStateToProps = ({ ebay, property, commonData, auth }) => {
  const {
    tokenStatus
  } = ebay;

  const { notificationMessage } = commonData;

  return {
    property: property.property,
    tokenStatus, notificationMessage,
    roleName: auth.user.role.name,
  };
};

const mapDispatchToProps = {
  getTokenStatus,
  setNotificationMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationForm);
