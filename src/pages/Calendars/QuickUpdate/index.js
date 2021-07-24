import React, { useEffect, useState, useRef } from 'react';
import Page from "../../../components/Common/Page";
import InfoIcon from '@2fd/ant-design-icons/lib/InformationOutline';
import './styles.less';
import Form from "../../../components/Common/Form";
import { MULTISELECT, CHECKBOX, INTEGER, DATEPERIOD } from "../../../constants/FormFieldTypes";
import ChevronDown from "@2fd/ant-design-icons/lib/ChevronDown";
import { connect } from 'react-redux';
import { schema } from "../../../validation/QuickUpdate";
import { updateQuickly } from "../../../API/Calendars";
import { useFormatMessage } from 'react-intl-hooks';
import antdDe from "antd/lib/locale-provider/de_DE";
import antdEn from "antd/lib/locale-provider/en_US";

import {
  getProperty as getPropertyAction,
  getRooms as getRoomsAction
} from "appRedux/actions";

const MAIN_CLASSNAME = 'QuickUpdate';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const QuickUpdate = ({
  getProperty, 
  property, 
  history,
  locale,
  rooms,
  getRooms
 }) => {
  const [selectedDays, setSelectedDays] = useState(WEEK_DAYS);
  const [closed, setClosed] = useState(false);
  const [hasChannelManager, setHasChannelManager] = useState(false);
  const t = useFormatMessage();

  const formEl = useRef(null);
  const datePickerLocale = locale == 'en' ? antdEn : antdDe;

  useEffect(() => {
    if (! property) {
      return;
    }

    if (property.objectId == null) {
      history.push('/property/add');
      return;
    }

    if (property.objectId) {
      getRooms(property.objectId);
    }

    setHasChannelManager(property.manager !== "no");

  }, [property]);

  const roomsOptions = rooms.length ? rooms
    .sort(
      (room1, room2) => room1.name.toLowerCase() > room2.name.toLowerCase()
    )
    .map(({id, name}) => ({label: name, value: parseInt(id)}))
    : []
  ;

  return (
    <Page
      className={MAIN_CLASSNAME}
      title={t({id: 'app.calendars.quick_update.quick_update'})}
      styles={{
        marginBottom: '43px'
      }}
    >
      <div className={'info'}>
        <InfoIcon width={20} height={20}/>
        <p>{t({id: 'app.calendars.quick_update.your_changes'})}</p>
      </div>

      {property && !property.objectId && <p>{t({id: 'app.calendars.quick_update.object_id_is_null'})}</p>}
      {property && !property.currency && <p>{t({id: 'app.calendars.quick_update.currency_is_null'})}</p>}

      {property && property.objectId && property.currency &&
      <div className={'form'} >
        <div ref={formEl} style={{position: 'relative'}} />
        <Form
          buttonText={t({id: 'app.calendars.quick_update.update'})}
          onSubmit={async (values) => {
            await updateQuickly({
              ...values,
              selectedDays,
              objectId: property && property.objectId,
              closed,
              hasChannelManager
            });
            setSelectedDays(WEEK_DAYS);
          }}
          initialValues={{
            rooms: undefined,
            period: [],
            availability: ''
          }}
          schema={schema}
          isDisabled={(values) => {
            const fields = ['availability', 'rooms'];
            return fields.every(field => !values[field]) || values['period'].length < 2;
          }}
          rows={[
            [
              {
                label: t({id: 'app.calendars.quick_update.period'}),
                type: DATEPERIOD,
                name: 'period',
                locale: datePickerLocale.DatePicker,
                isWide: true,
                getPopupContainer: () => formEl.current,
                isRequired: true
              },
              {
                label: t({id: 'app.calendars.quick_update.rooms'}),
                type: MULTISELECT,
                name: 'rooms',
                showArrow: true,
                suffixIcon: <ChevronDown style={{ color: "#495057", fontSize: 16 }} />,
                isWide: true,
                options: roomsOptions,
                getPopupContainer: () => formEl.current,
                isRequired: true
              }
            ],
            [
              {
                title: t({id: 'app.calendars.quick_update.all'}),
                type: CHECKBOX,
                checked: selectedDays.length === WEEK_DAYS.length,
                name: 'week',
                onChange: ({ target }) => {
                  const { checked } = target;
                  const days = checked ? WEEK_DAYS : [];
                  setSelectedDays(days);
                }
              }
            ],
            WEEK_DAYS.map(day => ({
              title: day,
              type: CHECKBOX,
              name: day,
              checked: selectedDays.includes(day),
              onChange: ({ target }) => {
                const { checked } = target;
                const days = checked
                  ? [...selectedDays, day]
                  : selectedDays.filter((_day) => _day !== day)
                setSelectedDays(days);
              }
            })),
            [
              {
                label: t({id: 'app.calendars.quick_update.availability'}),
                addonAfter: t({id: 'app.calendars.quick_update.rooms'}),
                name: 'availability',
                type: INTEGER,
                maxValue: 1000,
                isWide: true
              },
              {
                title: t({id: 'app.calendars.quick_update.close_the_period'}),
                name: 'closed',
                type: CHECKBOX,
                isWide: true,
                checked: closed,
                onChange: ({ target }) => setClosed(target.checked)
              }
            ],
          ]}
        />
      </div>}
    </Page>
  )
}

const mapStateToProps = ({ property: propertyState, settings, rooms: roomsState }) => {
  const { property } = propertyState;
  const locale = settings.locale.locale;
  const { rooms } = roomsState;

  return {
    property,
    locale,
    rooms
  };
};

const mapDispatchToProps = {
  getProperty: getPropertyAction,
  getRooms: getRoomsAction
}


export default connect(mapStateToProps, mapDispatchToProps)(QuickUpdate);
