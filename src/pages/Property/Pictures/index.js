import React, { useEffect, useState, useRef } from "react";
import { Button, Tabs, Upload, Row, Col } from "antd";
import { connect } from "react-redux";
import classNames from "classnames";
import ContentForm from "../../../components/ContentForm";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  getPictureTypes,
  setPicture,
  getPictures,
  removePicture,
  resortPicture,
  setPictureError,
  addUploadedPictureUid,
  removeUploadedPictureUid,
  setUploadingPicture,
  getDesignTemplates,
  selectPicture,
  unSelectPicture,
  setFooterImage,
  saveFooterImage,
  clearSelectedPictures,
  setSelectedPictures,
  getProperty,
} from "../../../appRedux/actions";
import { baseURL } from "../../../util/Api";
import { getAllPictures } from "API/Pictures";

import SortableImagesList from "../../../routes/Pictures/components/PicturesTab/SortableImagesList";
import DeleteModal from "../../../components/DeleteModal";
import showErrorMessage from "util/showErrorMessage";
import { useFormatMessage } from "react-intl-hooks";

import "./pictures.less";
import { Link } from "react-router-dom";
import PropertyPictureCaptions from "constants/PropertyPictureCaptions";

const Pictures = ({
  pictureTypes,
  userLanguageId,
  getPictureTypes,
  removePicture,
  setPictureError,
  history,
  property,
  objectId,
  userId,
  uploadedPictureUids,
  addUploadedPictureUid,
  removeUploadedPictureUid,
  uploadingPicture,
  setUploadingPicture,
  designTemplates,
  getDesignTemplates,
  selectPicture,
  unSelectPicture,
  setSelectedPictures,
  clearSelectedPictures,
  setFooterImage,
  saveFooterImage,
  propertyImages,
  getProperty,
  footerImage,
  selectedPictures,
}) => {
  const [uploadCategory, setUploadCategory] = useState({});
  const [caption, setCaption] = useState({});
  const [fileToRemove, setFileToRemove] = useState();
  const [error, setError] = useState("");
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [isDisabledNext, setDisabledNext] = useState(false);
  const [designTemplateId, setDesignTemplateId] = useState(0);
  const [libraryImages, setLibraryImages] = useState([]);
  const [footerImageInLibrary, setFooterImageInLibrary] = useState({});
  const ref = useRef(uploadedPictures);
  const t = useFormatMessage();

  const loadLibraryImages = async () => {
    if (objectId && userLanguageId) {
      setLibraryImages(
        await getAllPictures({
          objectId,
          errorLang: userLanguageId.substring(0, 2),
        })
      );
    }
  };

  const onPropertyChange = () => {
    clearSelectedPictures();

    getPictureTypes({
      objectId,
      errorLang: userLanguageId.substring(0, 2),
    });

    getDesignTemplates({
      objectId,
      errorLang: userLanguageId.substring(0, 2),
    });

    loadLibraryImages();
  };

  useEffect(() => {
    getProperty();
  }, []);

  useEffect(() => {
    if (property && property.objectId == null) {
      history.push("/property/name");
      return;
    }

    if (objectId && userLanguageId) {
      onPropertyChange();
    }
  }, [objectId]);

  useEffect(() => {
    let newSelectedPictures = {};
    for (let propertyImagesForCaption of propertyImages) {
      if (propertyImagesForCaption.captionCode == 0) {
        continue;
      }
      newSelectedPictures[
        propertyImagesForCaption.captionCode
      ] = libraryImages.filter(
        (libraryImage) =>
          propertyImagesForCaption.imageUrls.indexOf(
            libraryImage.url.indexOf("https:") < 0
              ? "https:" + libraryImage.url
              : libraryImage.url
          ) >= 0
      );
    }

    setSelectedPictures(newSelectedPictures);
  }, [propertyImages, libraryImages]);

  useEffect(() => setUploadedPictures(ref.current), [ref.current]);
  useEffect(() => {
    if (!uploadCategory || !uploadCategory.id) {
      return;
    }

    setCaption(
      PropertyPictureCaptions.find(
        ({ categoryId }) => categoryId == uploadCategory.id
      ) || null
    );
  }, [uploadCategory]);

  useEffect(() => {
    if (!designTemplates.length) {
      setDesignTemplateId(0);
      return;
    }

    const designTemplateHasFooterURL = designTemplates.find(
      ({ categories }) =>
        categories.filter(
          ({ footerURL }) => footerURL !== "" && footerURL !== "https://"
        ).length > 0
    );
    if (!designTemplateHasFooterURL) {
      setDesignTemplateId(0);
      setFooterImage({});
      return;
    }

    const footerImageUrl = designTemplateHasFooterURL.categories.find(
      ({ footerURL }) => footerURL
    ).footerURL;
    setDesignTemplateId(designTemplateHasFooterURL.id);
    setFooterImage({
      category: 3,
      name: "footer",
      thumbUrl: footerImageUrl,
      uid: "footer",
      url: footerImageUrl,
    });
  }, [designTemplates]);

  useEffect(() => {
    if (!pictureTypes.length) {
      setUploadCategory({});
      return;
    }
    const firstUploadCategoryId = PropertyPictureCaptions[0]["categoryId"];
    setUploadCategory(
      pictureTypes.find(({ id }) => id == firstUploadCategoryId)
    );
  }, [pictureTypes]);

  useEffect(() => {
    if (error) {
      setTimeout(setError, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (uploadedPictureUids.length == 0) {
      return;
    }
    const newPicture = libraryImages.find(
      (picture) => uploadedPictureUids.indexOf(picture.uid) >= 0
    );
    if (!newPicture) {
      return;
    }
    handleSelect(newPicture);
    removeUploadedPictureUid(newPicture.uid);
    setUploadingPicture(false);
  }, [libraryImages, uploadedPictureUids]);

  useEffect(() => {
    if (!footerImage.url) {
      setFooterImageInLibrary({});
      return;
    }

    setFooterImageInLibrary(
      libraryImages.find(
        ({ url }) => url === footerImage.url.replace("https:", "")
      )
    );
  }, [footerImage, libraryImages]);

  const handleClickNext = () => {
    history.push("/property/amenities");
  };

  const handleUpload = async ({ file }) => {
    await setUploadingPicture(true);
    const pictureFile = ref.current.find(({ uid }) => file.uid === uid);
    if (pictureFile) {
      pictureFile.percent = file.percent;
      pictureFile.status = file.status;
      if (file.status === "done") {
        pictureFile.uid = file.response.imageId;
      }
      ref.current = [...ref.current];
    } else {
      ref.current = [{ ...file, category: uploadCategory.id }, ...ref.current];
    }
    setUploadedPictures([...ref.current]);
    if (file.status === "done") {
      await addUploadedPictureUid(file.response.imageId);
      await getProperty();
      await loadLibraryImages();
    } else if (file.status === "error") {
      await setUploadingPicture(false);
      ref.current = [...ref.current.filter(({ uid }) => file.uid !== uid)];
      setPictureError(file.response.message);
    }
  };

  const handleFooterImageSelect = (image) => {
    const isImageAlreadySelected =
      footerImage.url === image.url || footerImage.url === "https:" + image.url;
    if (isImageAlreadySelected) {
      return saveFooterImage({ designTemplateId, footerImage: {} });
    }
    return saveFooterImage({ designTemplateId, footerImage: image });
  };

  const handleSelect = (image) => {
    if (caption.isFooter) {
      return handleFooterImageSelect(image);
    }
    const isImageAlreadySelected =
      (selectedPictures[caption.code] || []).find(
        ({ uid }) => uid === image.uid
      ) !== undefined;
    if (isImageAlreadySelected) {
      return unSelectPicture({ captionCode: caption.code, image });
    }
    return selectPicture({ captionCode: caption.code, image });
  };

  const beforeUpload = (file) => {
    const hasAllowedExtension =
      file.type === "image/jpeg" || file.type === "image/png";
    if (!hasAllowedExtension) {
      showErrorMessage(t({ id: "app.property.pictures.error_only_jpg" }));
    }
    const hasValidSize = file.size / 1024 / 1024 < 2;
    if (!hasValidSize) {
      showErrorMessage(t({ id: "app.property.pictures.error_size" }));
    }
    return hasAllowedExtension && hasValidSize;
  };

  const deletePicture = async (picture) => {
    await removePicture({
      uid: picture.uid,
      objectId: objectId,
      errorLang: userLanguageId.substring(0, 2),
    });
    if (caption.isFooter) {
      saveFooterImage({ designTemplateId, footerImage: {} });
    } else {
      if (! caption.multiple) {
        const captionPictureUrlsInCaption = (propertyImages.find(({captionCode}) => captionCode === caption.code) || {imageUrls: []})
          .imageUrls.map(url => url.replace('https:', ''));
        const alternativePicture = libraryImages.find(
          ({category, url}) => category === caption.categoryId 
          &&
          captionPictureUrlsInCaption.indexOf(url) >= 0
        )
        if (alternativePicture) {
          await selectPicture({captionCode: caption.code, image: alternativePicture})
        }
      } else {
        unSelectPicture({ captionCode: caption.code, image: picture });
      }
      
    }
    ref.current = [...ref.current.filter(({ uid }) => uid !== picture.uid)];
  };

  const handlePictureRemove = async () => {
    if (!property || !objectId || !userLanguageId || !fileToRemove) {
      setFileToRemove();
      return;
    }
    await deletePicture(fileToRemove);

    loadLibraryImages();
    setFileToRemove();
  };

  const handleCategoryChange = (category) => {
    if ( uploadingPicture ) {
      return;
    }
    setUploadCategory(category);
  }

  return (
    <div className="property-pictures">
      <ContentForm title={t({ id: "app.property.pictures.pictures" })}>
        {error && (
          <div className="pictures__error-message">
            <InfoCircleOutlined size={20} />
            {error}
          </div>
        )}
        <div className="pictures__categories">
          {uploadCategory &&
            pictureTypes &&
            pictureTypes.length > 0 &&
            PropertyPictureCaptions.map(({ categoryId, code, isFooter }) => (
              <div
                className={classNames(
                  "pictures__category",
                  {
                    ["pictures__category-selected"]:
                      categoryId == uploadCategory.id,
                  },
                  {
                    ["pictures__category-completed"]:
                      (isFooter &&
                        footerImageInLibrary &&
                        footerImageInLibrary.url) ||
                      (selectedPictures[code] &&
                        selectedPictures[code].length > 0),
                  }
                )}
                onClick={() =>
                  handleCategoryChange(
                    pictureTypes.find(({ id }) => id == categoryId)
                  )
                }
                key={categoryId}
              >
                {pictureTypes.find(({ id }) => id == categoryId).value}
              </div>
            ))}
        </div>
        {uploadCategory && property && (
          <Tabs
            className="pictures__tabs"
            defaultActiveKey="1"
            type="card"
            size="large"
          >
            <Tabs.TabPane
              tab={t({ id: "app.property.pictures.upload" })}
              key="1"
            >
              <div className="pictures__dragger">
                <Upload.Dragger
                  onChange={handleUpload}
                  showUploadList={false}
                  // accept=".jpg,.png"
                  disabled={!uploadCategory.id}
                  name="file"
                  multiple={caption && caption.multiple}
                  action={`${baseURL}picture/${uploadCategory.id}/${
                    [...ref.current].length + 1
                  }/${userId}/${property.id}`}
                  beforeUpload={beforeUpload}
                >
                  <p className="pictures__upload-text">
                    {t(
                      { id: "app.property.pictures.drag_files" },
                      {
                        browse: (
                          <span className="pictures__upload-primary-text">
                            {t({ id: "app.common.browse" })}
                          </span>
                        ),
                      }
                    )}
                  </p>
                  <p className="pictures__upload-hint">
                    {uploadCategory && uploadCategory.hint
                      ? uploadCategory.hint
                      : ""}
                  </p>
                </Upload.Dragger>
              </div>
              <div className="pictures__previews">
                <div>
                  <SortableImagesList
                    distance={1}
                    items={uploadedPictures.filter(
                      ({ category }) => category == uploadCategory.id
                    )}
                    axis="xy"
                    onRemove={setFileToRemove}
                  />
                </div>
              </div>
              <DeleteModal
                isVisible={fileToRemove}
                onCancel={() => setFileToRemove()}
                title={t({ id: "app.property.pictures.delete_picture" })}
                onDelete={() => handlePictureRemove()}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={t({ id: "app.property.pictures.library" })}
              key="2"
            >
              <div className="pictures__previews">
                <div>
                  <SortableImagesList
                    distance={1}
                    items={libraryImages.filter(
                      ({ category }) => category == uploadCategory.id
                    )}
                    axis="xy"
                    onCheck={handleSelect}
                    checkedList={
                      caption.isFooter
                        ? footerImageInLibrary && footerImageInLibrary.uid
                          ? [footerImageInLibrary]
                          : []
                        : selectedPictures[caption.code] || []
                    }
                  />
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        )}
        <div className="pictures__navigation">
          <Row gutter={[20, 16]}>
            <Col span={12}>
              <Link to="/property/description">
                <Button type="link">{t({ id: "app.common.back" })}</Button>
              </Link>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                disabled={isDisabledNext}
                onClick={handleClickNext}
              >
                {t({ id: "app.common.next" })}
              </Button>
            </Col>
          </Row>
        </div>
      </ContentForm>
    </div>
  );
};

const mapStateToProps = ({
  auth: {
    token,
    user: { id, language_id },
  },
  picture: { pictureTypes, pictures, uploadedPictureUids, uploadingPicture },
  property,
}) => ({
  token,
  pictureTypes,
  pictures,
  uploadedPictureUids,
  uploadingPicture,
  property: property.property,
  objectId: (property.property && property.property.objectId) || null,
  designTemplates: property.designTemplates.data,
  propertyImages:
    (property && property.property && property.property.hotelImages) || [],
  footerImage: property.footerImage || {},
  selectedPictures: property.selectedPictures || {},
  userId: id,
  userLanguageId: language_id,
});

export default connect(mapStateToProps, {
  getPictureTypes,
  setPicture,
  getPictures,
  removePicture,
  resortPicture,
  setPictureError,
  addUploadedPictureUid,
  removeUploadedPictureUid,
  setUploadingPicture,
  getDesignTemplates,
  selectPicture,
  unSelectPicture,
  setFooterImage,
  saveFooterImage,
  clearSelectedPictures,
  setSelectedPictures,
  getProperty,
})(Pictures);
