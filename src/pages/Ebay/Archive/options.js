import React from 'react';

export const COLUMNS = [
  {
    title: 'app.ebay.messages.subject',
    dataIndex: 'subject',
    render: (text) => (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', width: '400px' }}>
        {text}
      </div>
    )
  },
  {
    title: 'app.ebay.messages.date',
    dataIndex: 'date'
  },
  {
    title: 'app.ebay.messages.from',
    dataIndex: 'from'
  },
  {
    title: 'app.ebay.messages.to',
    dataIndex: 'to'
  }
];
