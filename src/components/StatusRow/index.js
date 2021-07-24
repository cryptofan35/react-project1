import React, { useState, useEffect } from "react";
import cls from 'classnames';
import PropTypes from 'prop-types';
import { useFormatMessage } from 'react-intl-hooks';
import { getStatus } from "util/packages/filters";

import "./status.less";

const StatusRow = ({ runningOffersCount, pastOffersCount, futureOffersCount, failedOffersCount, className, showStatus, inline }) => {
  const [statusText, setStatusText] = useState(null);
  const t = useFormatMessage();

  useEffect(() => {
    const status = getStatus({runningOffersCount, pastOffersCount, futureOffersCount, failedOffersCount});
    setStatusText(status);
    return;
    if (runningOffersCount > 0) {
      setStatusText('running');
      return;
    }

    if (futureOffersCount > 0) {
      setStatusText('future');
      return;
    }

    if (failedOffersCount > 0) {
      setStatusText('failed');
      return;
    }

    if (pastOffersCount > 0) {
      setStatusText('past');
      return;
    }

    if (failedOffersCount == 0 && runningOffersCount == 0 && futureOffersCount == 0 && pastOffersCount == 0) {
      setStatusText('new');
      return;
    }

    setStatusText();
    return;
  }, [runningOffersCount, pastOffersCount, futureOffersCount])

  const classNames = cls({
    'status-row': true,
    [`status-row__${statusText}`]: statusText !== null,
    [className]: className && className.length > 0,
  });

  return (
    <div className={classNames}>
      <span className="status-row-bullet"/>
      {
        showStatus && <span className="status-row-label">{` - ${statusText ? t({id: `app.packages.list.status_${statusText}`}) : ''}`}</span>
      }
    </div>
  )
};

StatusRow.propTypes = {
  //status: PropTypes.oneOf(['new', 'future', 'running', 'failed', 'past']),
  className: PropTypes.string,
  showStatus: PropTypes.bool
};

export default StatusRow;
