import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import cn from "classnames";
import { setPictureError } from '../../appRedux/actions';
import { showNotification } from 'util/notifications'
import AlertCircle from '@2fd/ant-design-icons/lib/AlertCircle';

import "./content-form.less";

const ContentForm = ({ title, children, onClick, buttonLabel, error, setPictureError, withNotification, className }) => {
  useEffect(() => {
    if (withNotification && error) {
      showNotification({ message: error, type: 'error' }, {
        className: 'content-form__toastr',
        icon: <AlertCircle />
      })
    }
    
    setTimeout(() => setPictureError(''), 3000)
  }, [error]);

  return (
    <div className={cn('content-form', className)}>
      <div className="content-form__header">
        <span className="content-form__title">{title}</span>
        {onClick && (
          <Button className="content-form__button" type="primary" onClick={onClick}>
            {buttonLabel}
          </Button>
        )}
        {error && ( 
          <div className="content-form__error-message"> 
            <ExclamationCircleOutlined size={20} />
            {error}
          </div>
        )}
      </div>
      <div className="content-form__form"> {children}</div>
    </div>
  )
};

const mapStateToProps = ({ picture: { error } }) => ({ error });

export default connect(mapStateToProps, { setPictureError })(ContentForm);
