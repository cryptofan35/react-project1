import React from 'react';
import { Dropdown, Menu, Tooltip } from "antd";
import ChevronDownIcon from "@2fd/ant-design-icons/lib/ChevronDown";
import HelpIcon from '../../../assets/images/description-help.png';
import { ENGLISH_LOCALE, GERMAN_LOCALE } from "../../../constants/Locales";
import './styles.less'
import { useFormatMessage } from 'react-intl-hooks';

const LOCALES = [ENGLISH_LOCALE, GERMAN_LOCALE];

const LocaleSwitcher = ({ locale, onSwitch }) => {
  const { name = 'English', translateKey } = locale;
  const t = useFormatMessage();
  
  const list = (
    <Menu>
      {LOCALES.map(({ name, languageId, locale, translateKey }) => (
        <Menu.Item key={locale}>
          <p onClick={() => {
            onSwitch(languageId);
          }}>
            {t({id: translateKey})}
          </p>
        </Menu.Item>
      ))}
    </Menu>
  )
  
  return (
    <div className={'LocaleSwitcher'}>
      <Dropdown
        arrow
        trigger={['click']}
        overlay={list}
      >
        <div className={'LocaleSwitcher-visible'}>
          <p>{t({id: translateKey})}</p>
          <ChevronDownIcon/>
          <Tooltip title={'This menu contains in which languages the description of the property will be on eBay.'} placement={'bottom'}>
            <img src={HelpIcon} alt={'Help'}/>
          </Tooltip>
        </div>
      </Dropdown>
    </div>
  )
};

export default LocaleSwitcher;
