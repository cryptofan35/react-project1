import React, { useEffect, useState, useMemo, useRef } from "react";
import { Button, Tabs, Upload, Select, Row, Col } from "antd";
import { connect } from "react-redux";
import { userSignOut } from "../../../../../appRedux/actions/Auth";
import {
  getPictureTypes,
  setPicture,
  getPictures,
  removePicture,
  resortPicture,
  setPictureError,
} from "../../../../../appRedux/actions";
import { baseURL } from "../../../../../util/Api";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortEnd
} from "react-sortable-hoc";
import SortableImagesList from "../SortableImagesList";
import SelectField from "../../../../../components/SelectField";
import DeleteModal from "../../../../../components/DeleteModal";
import showErrorMessage from "util/showErrorMessage";
import { useFormatMessage } from 'react-intl-hooks';
import "./pictures-tab.less";
import { Redirect } from 'react-router-dom';

const Pictures = ({
  title,
  pictureTypes,
  pictures: initPictures = [],
  property,
  userLanguageId,
  getPictureTypes,
  setPicture,
  getPictures,
  removePicture,
  resortPicture,
  userId,
  category,
  libraryImages,
  setPictureError,
  onChange,
  onSelectedPicturesChange,
  preSelectedPictures,
  onPictureUploaded
}) => {
  const [uploadCategory, setUploadCategory] = useState();
  const [libraryCategory, setLibraryCategory] = useState(0);
  const [fileToRemove, setFileToRemove] = useState();
  const [pictures, setPictures] = useState(libraryImages ? [] : initPictures);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedPictures, setSelectedPictures] = useState(preSelectedPictures ? preSelectedPictures : []);
  const [uploadCategoryHint, setUploadCategoryHint] = useState();
  const ref = useRef(pictures);
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const t = useFormatMessage();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newPictures = arrayMove(pictures, oldIndex, newIndex).filter(item => !!item);
      setPictures(newPictures);
      resortPicture(
        [...newPictures]
          .reverse()
          .map(({ uid }, index) => ({ uid, order: index }))
      );
    }
  };

  const loadPictures = () => {
    if (property && property.objectId && userLanguageId && ! libraryImages) {
      getPictures({
        objectId: property.objectId,
        errorLang: userLanguageId.substring(0, 2),
        category: libraryCategory
      })
    }
  }

  useEffect(() => {
    if (property && property.objectId && userLanguageId) {
      getPictureTypes({
        objectId: property.objectId,
        errorLang: userLanguageId.substring(0, 2)
      });
    }
  }, []);

  useEffect(() => setPictures(libraryImages ? [] : initPictures), [initPictures]);
  //useEffect(() => { ref.current = libraryImages ? [] : initPictures }, [initPictures]);
  useEffect(() => setUploadedPictures(ref.current), [ref.current]);
  useEffect(() => loadPictures(), [libraryCategory || property && property.objectId ]);
  useEffect(() => {
    if (! selectedPictures || ! onSelectedPicturesChange) {
      return;
    }
    onSelectedPicturesChange([...selectedPictures, ...pictures]);
  }, [selectedPictures, pictures]);

  useEffect(() => {
    const categoryForHint = uploadCategory ? uploadCategory : category;
    if (! categoryForHint) {
      setUploadCategoryHint("");
      return;
    }

    const pictureType = pictureTypes.find(({id}) => categoryForHint == id);
    if (! pictureType) {
      setUploadCategoryHint("");
      return;
    }

    setUploadCategoryHint(pictureType.hint ? pictureType.hint : "");
  }, [uploadCategory, category, pictureTypes]);

  useEffect(() => {
    setUploadedPictures([...uploadedPictures.map((uploadedPicture) => {
      const picture = pictures.find(({uid}) => (uploadedPicture.uid === uid));
      if (!picture) {
        return {
          ...uploadedPicture,
          url: uploadedPicture.thumbUrl
        };
      }

      return {
        ...uploadedPicture,
        url: picture.url
      }
    })])
  }, [pictures]);

  useEffect(() => setSelectedPictures(preSelectedPictures ? preSelectedPictures : []), [preSelectedPictures])

  useEffect(() => {
    if (onChange) {
      onChange(selectedPictures.map(({ uid }) => uid))
    }
  }, [selectedPictures]);

  const handleUpload = ({ file }) => {
    if (file.status === "error") {
      ref.current = [...ref.current.filter(({ uid }) => file.uid !== uid)];
      setPictureError(file.response.message);
      setUploadedPictures([...ref.current]);
      return;
    }

    const pictureFile = ref.current.find(({ uid }) => file.uid === uid);
    if (pictureFile) {
      pictureFile.percent = file.percent;
      pictureFile.status = file.status;
      if (file.status === "done") {
        pictureFile.uid = file.response.imageId;
        if (onPictureUploaded) {
          onPictureUploaded(pictureFile.uid);
        }
      }
      ref.current = [...ref.current];
    } else {
      ref.current = [{...file, category: category || libraryCategory || uploadCategory}, ...ref.current];
    }
    //setPictures([...ref.current]);
    setUploadedPictures([...ref.current]);
    if (file.status === "done") {
      loadPictures();
    }
  };

  const libraryItems = libraryImages
    ? libraryImages
    : libraryCategory
    ? pictures.filter(({ category: ctg }) => ctg === libraryCategory)
    : pictures.filter(({ category: ctg }) => ctg !== 8);

  const handleSelect = (image) => {
    const selectedImgs = selectedPictures.includes(image) ? selectedPictures.filter(item => item !== image) : [...selectedPictures, image];
    setSelectedPictures(selectedImgs);
  };

  const handlePictureRemove = async () => {
    if (! property || ! property.objectId || ! userLanguageId || ! fileToRemove) {
      setFileToRemove();
      return
    }
    await removePicture({
      uid: fileToRemove.uid,
      objectId: property.objectId,
      errorLang: userLanguageId.substring(0, 2)
    });
    setUploadedPictures([...uploadedPictures.filter(({uid}) => uid !== fileToRemove.uid)])
    ref.current = [...ref.current.filter(({uid}) => uid !== fileToRemove.uid)];
    loadPictures();
    setFileToRemove();
  }

  const beforeUpload = (file) => {
    const hasAllowedExtension = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!hasAllowedExtension) {
      showErrorMessage(t({id: 'app.property.pictures.error_only_jpg'}));
    }
    const hasValidSize = file.size / 1024 / 1024 < 2;
    if (!hasValidSize) {
      showErrorMessage(t({id: 'app.property.pictures.error_size'}));
    }
    return hasAllowedExtension && hasValidSize;
  }

  if(property && !property.objectId){
    return<Redirect to="/"/>
  }
  return (
    <>
      <Tabs
        className="pictures__tabs"
        defaultActiveKey="1"
        type="card"
        size="large"
      >
        <Tabs.TabPane tab={t({id: 'app.pictures.upload'})} key="1">
          {!category && (
            <div className="pictures__category">
              <span className="pictures__title">{t({id: 'app.pictures.category'})}:</span>
              <SelectField
                value={uploadCategory}
                options={
                  pictureTypes
                    .filter(({ id }) => id !== 8)
                }
                onChange={setUploadCategory}
                placeholder={t({id: 'app.pictures.select_category'})}
              />
            </div>
          )}
          <div className="pictures__dragger">
            {property && property.id && (
              <Upload.Dragger
                onChange={handleUpload}
                showUploadList={false}
                disabled={!category && !uploadCategory}
                name="file"
                multiple={true}
                action={`${baseURL}picture/${category || uploadCategory}/${[...ref.current].length + 1}/${userId}/${property.id}`}
                beforeUpload={beforeUpload}
              >
                <p className="pictures__upload-text">
                  {t({id: 'app.property.pictures.drag_files'}, {browse: <span className="pictures__upload-primary-text">{t({id: 'app.common.browse'})}</span>})}
                </p>
                <p className="pictures__upload-hint">
                  {uploadCategoryHint}
                </p>
              </Upload.Dragger>
            )}
            <SortableImagesList
                distance={1}
                items={category ? uploadedPictures.filter(({ category: ctg }) => ctg === category) : (uploadCategory ? uploadedPictures.filter(({ category: ctg }) => ctg === uploadCategory) : uploadedPictures)}
                onSortEnd={onSortEnd}
                axis="xy"
                onRemove={setFileToRemove}
              />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t({id: 'app.pictures.library'})} key="2">
          {!libraryImages && (
            <div className="pictures__category">
              <span className="pictures__title">{t({id: 'app.pictures.category'})}:</span>
              <SelectField
                value={libraryCategory}
                options={[{ id: 0, value: t({id: 'app.pictures.all_pictures'}) }, 
                  ...pictureTypes
                  .filter(({ id }) => id !== 8)
                ]}
                onChange={setLibraryCategory}
              />
            </div>
          )}
          <SortableImagesList
            distance={1}
            items={libraryItems}
            onSortEnd={onSortEnd}
            axis="xy"
            onRemove={!libraryImages ? setFileToRemove : undefined}
            onCheck={libraryImages ? handleSelect : undefined}
            checkedList={selectedPictures}
          />
        </Tabs.TabPane>
      </Tabs>
      <DeleteModal
        isVisible={fileToRemove}
        onCancel={() => setFileToRemove()}
        title={t({id:'app.pictures.delete_picture'})}
        onDelete={() => handlePictureRemove()}
      />
    </>
  );
};

const mapStateToProps = ({
  auth: {
    token,
    user: { id, language_id }
  },
  picture: { pictureTypes, pictures },
  property: { property }
}) => ({
  token,
  pictureTypes,
  pictures,
  userId: id,
  userLanguageId: language_id,
  property
});

export default connect(mapStateToProps, {
  getPictureTypes,
  setPicture,
  getPictures,
  removePicture,
  resortPicture,
  setPictureError,
})(Pictures);
