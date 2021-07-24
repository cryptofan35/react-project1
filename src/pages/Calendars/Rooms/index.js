import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRooms } from "appRedux/actions";
import Page from "components/Common/Page";
import { useFormatMessage } from "react-intl-hooks";
import { Row, Col, Select, Button } from "antd";
import "./styles.less";
import AlertCircleOutline from '@2fd/ant-design-icons/lib/AlertCircleOutline';
import Calendar from "components/Calendars/Rooms";
import ReloadIcon from "@2fd/ant-design-icons/lib/Reload";
const { Option } = Select;

const RoomsSelect = ({ rooms, onChange, defaultRoom }) => {
  if (!rooms) {
    return <></>;
  }

  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={(roomId) => onChange(rooms.find(({ id }) => id == roomId))}
      defaultValue={defaultRoom ? defaultRoom.id : null}
    >
      {rooms
        .sort(
          (room1, room2) => room1.id > room2.id ? -1 : 1
        )
        .map((room) => (
          <Option key={room.id} value={room.id}>
            {room.name}
          </Option>
        ))}
    </Select>
  );
};

const RoomsCalendar = ({ property, getRooms, rooms, history }) => {
  const t = useFormatMessage();
  const [hasChannelManager, setHasChannelManager] = useState(false);
  const [pickedRoom, setPickedRoom] = useState(null);
  useEffect(() => {
    if (!property) {
      return;
    }
    setHasChannelManager(property.manager !== "no");
    if (!property.objectId) {
      return;
    }
    setPickedRoom(null);  // to refresh rooms dropdow
    getRooms(property.objectId);
  }, [property]);

  useEffect(() => {
    const sortedRooms = rooms.sort((room1, room2) => room1.id > room2.id ? -1 : 1);
    setPickedRoom(sortedRooms.length > 0 ? sortedRooms[0] : null);
  }, [rooms])

  return (
    <Page
      className={"Availability"}
      title={t({ id: "app.calendars.availability.availability_calendar" })}
    >
      <div className="rooms-content">
        <Row>
          <Col span={12} className="first-column">
            <div>{t({id: 'app.calendars.rooms.room'})}:</div>
            <div className="room-select-container">
              {pickedRoom && rooms.length && (
                <RoomsSelect
                  rooms={rooms}
                  onChange={(room) => setPickedRoom(room)}
                  defaultRoom={pickedRoom}
                />
              )}
              
            </div>
          </Col>
          <Col span={12} className="bulk-update-button-container">
            <Button type="primary" onClick={() => history.push('/calendars/update')}>Bulk Update</Button>
          </Col>
        </Row>
        {hasChannelManager && (
          <Row>
            <Col span={24} className="info">
              <AlertCircleOutline width={20} height={20} />
              <p style={{marginLeft: '5px'}}>{t({id: 'app.calendars.rooms.info'}, {reloadIcon: <ReloadIcon style={{fontSize:'20px', color: '#005C81', transform: 'rotate(270deg)'}} />})}</p>
            </Col>
          </Row>
        )}
        <Row className="calendar-container">
          <Col span={24}>
            {pickedRoom && (
              <Calendar room={pickedRoom} hasChannelManager={hasChannelManager} />
            )}
          </Col>
        </Row>
      </div>
    </Page>
  );
};

const mapStateToProps = ({ property: propertyState, rooms: roomsState }) => {
  const { property } = propertyState;
  const { rooms } = roomsState;
  return { property, rooms };
};

const mapDispatchToProps = { getRooms };

export default connect(mapStateToProps, mapDispatchToProps)(RoomsCalendar);
