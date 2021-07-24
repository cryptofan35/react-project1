import React from "react";
import { useFormatMessage } from 'react-intl-hooks';

function NoDataAvailable(props) {
  const t = useFormatMessage();
  return (
    <div className="recharts-no-data">
      <p>{t({id: 'app.dashboard.no_data_available'})}</p>
    </div>
  );
}

export default NoDataAvailable;