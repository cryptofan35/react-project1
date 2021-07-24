import React from 'react';
import { connect } from "react-redux";
import { Tabs } from 'antd';
import { Descriptions } from 'antd';
import PreviewHTMLFrame from './PreviewHTMLFrame';
import './previewDetails.less';

import translationEN from '../../../lngProvider/locales/en_US.json';
import translationDE from '../../../lngProvider/locales/de_DE.json';

const PreviewDetails = ({preview, templateLanguage}) => {
  const { TabPane } = Tabs;

  const t = templateLanguage === 'en' ? translationEN : translationDE;

  return (
  <div className="details-container">
    <Tabs type="card">
      <TabPane tab={t['app.packages.preview.tab_description']} className="custom-tab-pane" key="1">
        <div><p>{t["app.packages.preview.seller_responsibility"]}</p></div>
        <div className="description-container">
          <Descriptions size="small" column={2} title={t["app.packages.preview.items_specifics"]}>

            {preview && preview.details && preview.details.descriptions.map((detail, index) =>
              <Descriptions.Item key={index} label={detail.label}>
                {detail.value}
              </Descriptions.Item>
            )}

          </Descriptions>
        </div>

        {preview && preview.preview && preview.preview.htmlContent && (<PreviewHTMLFrame htmlContent={preview.preview.htmlContent} />)}

      </TabPane>

      <TabPane tab={t["app.packages.preview.tab_shipping"]} disabled key="2" />
    </Tabs>
  </div>
  );
}

const mapStateToProps = ({packages}) => {
  return {
    preview: packages.preview,
  }
}

export default connect(mapStateToProps)(PreviewDetails);

