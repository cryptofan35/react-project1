import React from 'react';
import TableActions from "../../../../components/TableActions";
import { NEW_MESSAGES_TAB_TITLE } from "./tabs";

const VIEW = 'view';
export const ARCHIVE = 'archive';

export const getColumns = (type, { archiveMessage, viewMessage, viewedMessageID, t }) => [
  {
    title: t({id: 'app.ebay.messages.buyer'}),
    dataIndex: 'buyerID',
  },
  {
    title: t({id: 'app.ebay.messages.item_id'}),
    dataIndex: 'itemID',
  },
  {
    title: t({id: 'app.ebay.messages.date'}),
    dataIndex: 'date',
    render: (text) => {
      return <div style={{whiteSpace:"nowrap"}}>{text}</div>
    }
  },
  {
    title: t({id: 'app.ebay.messages.subject'}),
    dataIndex: 'subject',
  },
  {
    title: t({id: 'app.ebay.messages.actions'}),
    key: 'actions',
    render: (text, payload) => {
      const {id, buyerID, Question} = payload;
      const actions = type === NEW_MESSAGES_TAB_TITLE
        ? [VIEW, ARCHIVE]
        : [VIEW];
      const isHidden = viewedMessageID === id;
      
      return (
        <TableActions
          types={actions}
          onClick={(type => {
            switch (type) {
              case ARCHIVE: {
                archiveMessage(id, buyerID, Question);
                break;
              }
              case VIEW: {
                viewMessage(id);
                break;
              }
            }
          })}
          hiddenTypes={isHidden ? [VIEW] : []}
        />
      )
    }
  }
].map(column => ({
  ...column,
  key: column.title,
}));
