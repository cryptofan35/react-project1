import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Checkbox, Button } from "antd";
import SelectField from "../../../components/SelectField";
import InputField from "../../../components/InputField";
import Label from "../../../components/Label";
import PicturesTab from "../../Pictures/components/PicturesTab/PicturesTab";
import { RoomTypesAsArray } from "constants/RoomTypes";
import { getPictures, getRoomAmenities, addUploadedPictureUid, removeUploadedPictureUid } from "../../../appRedux/actions";
import { createRoom, updateRoom } from "../../../API/Rooms";
import showErrorMessage from "../../../util/showErrorMessage";
import RoomTypes from "../../../constants/RoomTypes";
import { useFormatMessage } from 'react-intl-hooks';

import "./edit-room.less";

const EditRoom = ({ 
  onSubmit, 
  room, 
  userLanguageId,
  property,
  getPictures,
  libraryImages,
  amenities,
  getRoomAmenities,
  uploadedPictureUids,
  addUploadedPictureUid,
  removeUploadedPictureUid
 }) => {
  const [editRoom, setEditRoom] = useState(room);
  const [roomImages, setRoomImages] = useState([]);
  const [isValidateField, setIsValidateField] = useState(false);
  const [newImageUid, setNewImageUid] = useState(null);
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(true);
  const t = useFormatMessage();

  const loadPictures = async () => {
    if (! property) {
      return;
    }

    if (! property.objectId) {
      return;
    }

    await getPictures({
      objectId: property.objectId,
      errorLang: userLanguageId.substring(0, 2),
      category: 9
    })
  }

  useEffect(() => {
    loadPictures();
  }, [property])

  useEffect(() => {
    getRoomAmenities()
  }, [])

  useEffect(() => {
    if (! room || ! room.images) {
      setRoomImages([]);
      return;
    }
    const roomImageUrls = room.images.map(image => image.url.replace(/http[s]?:/, ''));
    setRoomImages(libraryImages.filter((libraryImage) => {
      return roomImageUrls.indexOf(libraryImage.url.replace(/http[s]?:/, '')) >= 0;
    }))
  }, [room, libraryImages])
  
  useEffect(() => {
    if (uploadedPictureUids.length > 0) {
      const newPicture = libraryImages.find((libraryImage) => uploadedPictureUids.indexOf(libraryImage.uid) >= 0);
      if (! newPicture) {
        return;
      }
      setRoomImages([...roomImages, newPicture]);
      removeUploadedPictureUid(newPicture.uid);
    }
  }, [libraryImages])

  const handleChange = (value, prop) => {
    setEditRoom({ ...editRoom, [prop]: value });
  };

  const handleAmenityCheck = (changedAmenity, event) => {
    let amenities = editRoom.amenities ? editRoom.amenities : [];
    if (event.target.checked) {
      amenities.push(changedAmenity);
    } else {
      amenities = amenities.filter(amenity => amenity !== changedAmenity);
    }
    handleChange(amenities, 'amenities');
  }

  const handleImageUpload = async (imageUid) => {
    await addUploadedPictureUid(imageUid);
    loadPictures();
  }

  const handleSubmit = async () => {
    setIsSubmitButtonEnabled(false);
    setIsValidateField(true);

    if (editRoom.name && editRoom.type) {
      try {
        if (editRoom.id) {
          await updateRoom({
            roomId: editRoom.id,
            objectId: property.objectId, 
            name: editRoom.name,
            roomType: editRoom.type,
            amenities: editRoom.amenities ? editRoom.amenities : [],
            imageUrls: editRoom.imageUrls
          });
        } else {
          await createRoom({
            objectId: property.objectId, 
            name: editRoom.name,
            roomType: editRoom.type,
            amenities: editRoom.amenities ? editRoom.amenities : [],
            imageUrls: editRoom.imageUrls
          })
        }
        setIsSubmitButtonEnabled(true);
        onSubmit();
      } catch (error) {
        setIsSubmitButtonEnabled(true);
        console.log(error);
        showErrorMessage(t({id: 'app.rooms.edit.could_not_save'}));
      }  
      
    }
  };

  return (
    <div className="edit-room">
      <div className="edit-room__select-box">
        <InputField
          label={t({id: 'app.rooms.edit.room_name'})}
          required
          value={editRoom.name}
          maxLength={64}
          onChange={({ target: { value } }) => handleChange(value, "name")}
          error={isValidateField && !editRoom.name && t({id: 'app.common.field_is_required'})}
        />
        <SelectField
          label={t({id: 'app.rooms.edit.room_type'})}
          required
          placeholder={t({id: 'app.common.select'})}
          options={RoomTypesAsArray.map(({code, name}) => ({id: code, value: name}))}
          value={editRoom.type ? parseInt(editRoom.type) : null}
          onChange={type => handleChange(type, "type")}
          error={isValidateField && !editRoom.type && t({id: 'app.common.field_is_required'})}
        />
      </div>
      <Label label={t({id: 'app.rooms.edit.room_amenities'})} />
      <div className="edit-room__amenities">
        <div className="edit-room__amenities-container">
          {amenities && amenities.filter(amenity => amenity.language.code === userLanguageId).map(({ code, name }) => (
            <Checkbox checked={editRoom.amenities && editRoom.amenities.indexOf(code) >= 0} key={code} onChange={((e) => handleAmenityCheck(code, e))}>{name}</Checkbox>
          ))}
        </div>
      </div>
      <Label label={t({id: 'app.rooms.edit.room_pictures'})} />
      <PicturesTab 
        category={9} 
        preSelectedPictures={roomImages} 
        onPictureUploaded={handleImageUpload} 
        libraryImages={libraryImages} 
        onSelectedPicturesChange={(images) => handleChange(images.map(image => image.url), 'imageUrls')} />
      <div className="edit-room__footer">
        <Button
          className="content-form__button"
          type="primary"
          onClick={handleSubmit}
          disabled={!isSubmitButtonEnabled}
        >
          {room.name ? t({id: 'app.common.save'}) : t({id: 'app.common.create'})}
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  auth: {
    user: { language_id }
  },
  property: { property },
  picture: { pictures, uploadedPictureUids },
  rooms: { amenities }
}) => ({
  userLanguageId: language_id,
  property,
  libraryImages: pictures,
  uploadedPictureUids,
  amenities
})

const mapDispatchToProps = {
  getPictures,
  getRoomAmenities,
  addUploadedPictureUid,
  removeUploadedPictureUid
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRoom);
