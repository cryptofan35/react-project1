import React from 'react';
import Image from '../../../../assets/images/dropdown.png';

const DropdownIcon = ({ src = Image }) => {
  return (
    <img src={src} alt={'Dropdown'}/>
  )
};

export default DropdownIcon;
