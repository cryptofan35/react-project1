import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { CloseCircleFilled } from "@ant-design/icons";
import UploadList from 'antd/es/upload/UploadList';
import { convertBufferToImage } from '../../../../../util/pictureConvert';
import { Checkbox } from 'antd';

//const onPreview = ({ url }) => window.open(convertBufferToImage(url), '_blank');
const onPreview = ({ url }) => window.open(url, '_blank');

const SortableItem = SortableElement(({item, onRemove, onCheck, isChecked}) => (
  <div className="pictures__upload-item">
    {onRemove && <CloseCircleFilled className="pictures__remove-icon" onClick={onRemove} />}
    {onCheck && <Checkbox className="pictures__check-icon" onClick={onCheck} checked={isChecked}/>}
    <UploadList
      locale={{ previewFile: item.name }}
      showDownloadIcon={false}
      showRemoveIcon={false}
      listType="picture-card"
      onPreview={onPreview}
      onRemove={onRemove}
      onCheck={onCheck}
      items={[item]}
    />
  </div>
));

const SortableImagesList = SortableContainer(({items, onRemove, onCheck, checkedList = []}) => (
    <div className="pictures__upload-list">
      {items.map((item, index) => (
        <SortableItem
          key={`${item.uid}`}
          index={index}
          item={item}
          onRemove={onRemove ? () => onRemove(item) : undefined}
          onCheck={onCheck ? () => onCheck(item) : undefined}
          isChecked={!!checkedList.find(image => image.uid === item.uid)}
        />
      ))}
    </div>
));

export default SortableImagesList;
