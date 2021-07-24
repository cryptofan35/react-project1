import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { 
  fetchAvailabilityCalendar, 
  changeQuantityOnAvailabilityCalendar, 
  updateRoomAvailability,
  reloadRoomAvailability
} from "appRedux/actions";
import CalendarNavigator from "./Navigator";
import {
  getDateWithAdditionalTime,
  getDate,
  getDateOfFormat
} from "../../../util/dates/getters";
import { useFormatMessage } from 'react-intl-hooks';
import moment from "moment";
import { Row, Col } from "antd";
import MonthCalendar from "./MonthCalendar";
import './styles.less'
import ReloadIcon from "@2fd/ant-design-icons/lib/Reload";
import {showNotification} from "util/notifications";
import {ComponentWithLoader} from "components/ComponentWithLoader";

const Rooms = ({ 
  property, 
  room, 
  hasChannelManager, 
  fetchAvailabilityCalendar, 
  availabilityCalendar, 
  changeQuantityOnAvailabilityCalendar,
  updateRoomAvailability,
  reloadRoomAvailability,
  loading
 }) => {
  const [date, setDate] = useState(null);
  const [nextDate, setNextDate] = useState(null);
  const [step, setStep] = useState(0);
  const t = useFormatMessage();

  useEffect(() => {
    if (! room) {
      return;
    }
    setDate(getDate);
    setStep(0);
  }, [room])

  useEffect(() => {
    if (! date) {
      return;
    }
    load();
  }, [date])

  const onNavigate = offset => {
    const nextDate = getDateWithAdditionalTime(date, offset, 'M');
    setDate(nextDate);
    setStep(step + offset);
  }

  const load = async () => {
    setNextDate(moment(date).add(1, 'month'))
    const startDateOfMonth = moment(date).date(1);
    const nextCalendarMonth = moment(startDateOfMonth).add(2, 'month');
    const availabilityCalendarStartDate = moment(date).month() == moment().month() ? moment(date) : moment(startDateOfMonth);
    await fetchAvailabilityCalendar(room.id, getDateOfFormat(availabilityCalendarStartDate, "YYYY-MM-DD"), getDateOfFormat(nextCalendarMonth, "YYYY-MM-DD"));
  }

  const reload = async (date) => {
    await reloadRoomAvailability(room.id, date);
    showNotification({message: t({id: 'app.common.reloaded'})});
  }

  const onQuantityChange = ({date, quantity}) => {
    changeQuantityOnAvailabilityCalendar(room.id, quantity, date, hasChannelManager);
  }

  const onAvailabilityChange = ({date, isAvailable}) => {
    updateRoomAvailability(room.id, isAvailable, date, hasChannelManager);
  }

  return (
    <>
      <ComponentWithLoader loading={loading}>
        <CalendarNavigator
          step={step}
          onNavigate={onNavigate}
        />
        <Row className="months-container">
          <Col span={12} className="first-column">
            <MonthCalendar 
              date={date} 
              availabilityCalendar={availabilityCalendar}
              hasChannelManager={hasChannelManager}
              onReload={reload}
              onQuantityChange={({quantity, date}) => onQuantityChange({date, quantity})}
              onAvailabilityChange={({date, isAvailable}) => onAvailabilityChange({date, isAvailable})}
              />
          </Col>
          <Col span={12} className="second-column">
            <MonthCalendar 
              date={nextDate} 
              availabilityCalendar={availabilityCalendar}
              hasChannelManager={hasChannelManager}
              onReload={reload}
              onQuantityChange={({quantity, date}) => onQuantityChange({date, quantity})}
              onAvailabilityChange={({date, isAvailable}) => onAvailabilityChange({date, isAvailable})}
              />
          </Col>
        </Row>
        <Row className="bottom-line">
          <Col span={12} className="info-text">
            {t({id: 'app.calendars.rooms.bottom_info'})}
          </Col>
          <Col span={12} className={`icons ${!hasChannelManager ? ' has-no-channel-manager' : ''}`}>
            {hasChannelManager && (
              <div className="channel-manager">
                <ReloadIcon style={{fontSize:'20px', color: '#005C81', transform: 'rotate(270deg)'}} />
                -{t({id: 'app.calendars.rooms.refresh_info'})}
              </div>
            )}
            <div className="statuses">
              <div className="available">
                <div className="icon" /> - {t({id: 'app.calendars.rooms.available'})}
              </div>
              <div className="not-available">
                <div className="icon" /> - {t({id: 'app.calendars.rooms.not_available'})}
              </div>
            </div>
            
          </Col>
        </Row>
      </ComponentWithLoader>
      
    </>
  )
};

const mapStateToProps = ({ property: propertyState, rooms, commonData }) => ({
  property: propertyState.property,
  availabilityCalendar: rooms.availabilityCalendar,
  loading: commonData.loading
});

const mapDispatchToProps = { 
  fetchAvailabilityCalendar,
  changeQuantityOnAvailabilityCalendar,
  updateRoomAvailability,
  reloadRoomAvailability
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)