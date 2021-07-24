import React from 'react';
import { OFFER_ACTIONS } from "../constants/Ebay/offers";
import StopIcon from '../assets/images/stop.png';
import ViewIcon from '../assets/images/view.png';
import TrashIcon from '../assets/images/delete.png';
import ArchiveIcon from '../assets/images/archive.png';
import { ARCHIVE } from "../pages/Ebay/Messages/options/table";

const { view, stop, remove } = OFFER_ACTIONS;

const TableActions = ({ types, onClick, hiddenTypes = [] }) => {
  const getIconByType = (type) => {
    switch (type) {
      case view: {
        return ViewIcon;
      }
      case stop: {
        return StopIcon;
      }
      case remove: {
        return TrashIcon;
      }
      case ARCHIVE: {
        return ArchiveIcon;
      }
    }
  }
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: types.length > 1 ? 'space-between' : 'center',
      maxWidth: '60px'
    }}>
      {
        types.map((type, index) => {
          return (
            <div
              style={{
                cursor: 'pointer',
                visibility: hiddenTypes.includes(type) ? 'hidden' : 'visible'
              }}
              onClick={() => {
                onClick(type);
              }}
              key={index}
            >
              <img src={getIconByType(type)} alt={type}/>
            </div>
          )
        })
      }
    </div>
  )
}

export default TableActions;
