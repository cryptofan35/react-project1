import React from "react";
import { connect } from "react-redux";
import PreviewDetails from './PreviewDetails';
import PreviewSlider from "./PreviewSlider";
import "./index.less";

import headerImage from "../../../assets/images/preview-header.png";
import optionsImage from "../../../assets/images/preview-options.png";

import headerImageDE from "../../../assets/images/preview-header-de.png";
import optionsImageDE from "../../../assets/svg/right_block.svg";

const PreviewPackage = ({preview, packageDetails, templateLanguage}) => {

  return (
    <div className="preview-background">
      <div className="preview-container">
        <div><img className="preview-image" src={templateLanguage === 'en' ? headerImage : headerImageDE} alt="header" /></div>

        <div className="content">
          {preview && preview.details && preview.details.images &&
            (<PreviewSlider images={preview.details.images} />)
          }

          <div className="content-options">
            <h1>{packageDetails && packageDetails.name}</h1>
            <img className="preview-image" src={templateLanguage === 'en' ? optionsImage : optionsImageDE} alt="options" />
          </div>
        </div>

        <PreviewDetails templateLanguage={templateLanguage} />
      </div>
    </div>
  );
}

const mapStateToProps = ({packages}) => {
  const { preview,packageDetails } = packages;

  //TODO - marketPlaceId is temporary. Please change to template language when available on the API
  // marketPlaceIds: 77 = Germany, 16 = Austria, 193 = Switzerland
  const templateLanguage = ['77', '16', '193'].includes(packages.packageDetails.marketPlaceId) ? 'de' : 'en';

  return { preview, packageDetails, templateLanguage }
}

export default connect(mapStateToProps)(PreviewPackage);
