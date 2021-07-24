import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Space, Table } from "antd";
import ContentForm from "../../components/ContentForm";
import EditRoom from "./EditRoom";
import DeleteModal from "../../components/DeleteModal";
import { clearRooms, getRooms } from "../../appRedux/actions";
import { RoomTypes } from "constants/RoomTypes";
import { useFormatMessage } from 'react-intl-hooks';

import "./rooms.less";

const Rooms = ({rooms, property, clearRooms, getRooms}) => {
  const [editRoom, setEditRoom] = useState();
  const [removeRoom, setRemoveRoom] = useState();
  const t = useFormatMessage();

  useEffect(() => {
    (async () => {
      if (! property || ! property.objectId) {
        clearRooms();
        return;
      }
      await getRooms(property.objectId);
    })();
    
  }, [property])

  const handleSubmit = async () => {
    await getRooms(property.objectId);
    setEditRoom();
  };

  const columns = [
    { title: t({id: "app.rooms.list.id"}), dataIndex: "id", key: "id" },
    { title: t({id: 'app.rooms.list.name'}), dataIndex: "name", key: "name", width: '40%' },
    { title: t({id: 'app.rooms.list.type'}), key: ["roomType", "id"], render: (text, record, index) => (RoomTypes[record['roomType']['id']]['name']) },
    {
      title: t({id: 'app.rooms.list.actions'}),
      key: "operation",
      width: 100,
      render: e => (
        <Space size="middle" style={{ fontSize: "24px" }}>
          <a><div className="calendar-icon" /></a>
          <a><div className="edit-icon" onClick={() => setEditRoom({...e, type: e.roomType.id})} /></a>
          {/*<a><div className="delete-icon" onClick={() => setRemoveRoom(e)} /></a>*/}
        </Space>
      )
    }
  ];

  const handleRemove = () => {
    //setRooms(rooms.filter(item => item !== removeRoom));
    setRemoveRoom();
  };

  return (
    <ContentForm
      title={editRoom ? editRoom.name ? t({id: 'app.rooms.list.edit_room'}): t({id: 'app.rooms.list.add_room'}) : t({id: 'app.rooms.list.rooms'})}
      buttonLabel={`+ ${t({id: 'app.rooms.list.add_room'})}`}
      onClick={!editRoom ? () => setEditRoom({}) : undefined}
      className={"rooms__content-form"}
    >
      {editRoom ? (
        <EditRoom onSubmit={handleSubmit} room={editRoom} />
      ) : (
        <Table
          className="rooms__table"
          columns={columns}
          dataSource={rooms}
          pagination={{ position: ["bottomLeft"], showSizeChanger: false }}
          rowKey="id"
          className="rooms__table"
          locale={{
            filterConfirm: t({id: 'app.common.ok'}),
            filterReset: t({id: 'app.common.reset'}),
            emptyText: t({id: 'app.common.no_data'})
          }}
        />
      )}
      <DeleteModal
        title={t({id: 'app.rooms.list.delete_room'})}
        isVisible={removeRoom}
        onCancel={() => setRemoveRoom()}
        onDelete={handleRemove}
      />
    </ContentForm>
  );
};

const mapStateToProps = ({
  auth: { token, user: { id } },
  property: { property },
  rooms: { rooms }
}) => ({
  token,
  userId: id,
  property,
  rooms
});

const mapDispatchToProps = {
  getRooms: getRooms,
  clearRooms: clearRooms
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
