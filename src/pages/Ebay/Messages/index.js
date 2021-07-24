import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Tabs, Table } from 'antd';

import { getEbayMessages, archiveEbayMessage, answerEbayQuestion } from "../../../appRedux/actions/Ebay";
import Page from "../../../components/Common/Page";
import './styles.less';
import { getColumns } from "./options/table";
import { TABS, NEW_MESSAGES_TAB_TITLE, HISTORY_TAB_TITLE } from "./options/tabs";
import MessagesList from "../../../components/Message/List";
import { Redirect } from 'react-router-dom';
import { useFormatMessage } from 'react-intl-hooks';

const { TabPane } = Tabs;

const pageSize = 40;

const EbayMessages = ({
  getEbayMessages,
  newMessages,
  history,
  archiveEbayMessage,
  answerEbayQuestion,
  property,
}) => {
  const [viewedMessageID, setViewedMessageID] = useState(null);

  const [newMessagesPage, setNewMessagesPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [isHistoryOutdated, setHistoryOutdated] = useState(false);
  const t = useFormatMessage();

  const objectId = property? property.objectId: null;

  const fetchHistory =  React.useCallback(()=>{
    if (objectId == null)
      return;

    getEbayMessages({
      objectId: property.objectId,
      historyOffset: { status: 1, offset: historyPage * pageSize, limit: pageSize },
    });
  }, [objectId, historyPage])

  const fetchNewMessages = React.useCallback(()=>{
    if (objectId == null)
      return;

    getEbayMessages({
      objectId: property.objectId,
      newMessagesOffset: { status: 0, offset: newMessagesPage * pageSize, limit: pageSize },
    });

  }, [objectId, newMessagesPage]);

  useEffect(() => {
    fetchNewMessages();
  }, [fetchNewMessages]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (newMessages.messages.length === newMessages.total) return;

    // Force update when User archives all the items at the page.
    if (newMessages.messages.length == 1)
      if (newMessagesPage > 0) {
        setNewMessagesPage(newMessagesPage - 1);
      } else {
        fetchNewMessages();
      }
  }, [newMessages, fetchHistory]);

  const closeMessage = () => {
    setViewedMessageID(null);
  };

  if(property && !property.objectId)
    return <Redirect to="/" />;


  const titleToMessagesMap = {
    [NEW_MESSAGES_TAB_TITLE]: {...newMessages, setPage: setNewMessagesPage},
    [HISTORY_TAB_TITLE]: {...history, setPage: setHistoryPage}
  }

  return (
    <Page
      title={t({id: 'app.ebay.messages.ebay_messages'})}
      className={"ebayMessages"}
      styles={{
        marginBottom: "46px",
        paddingBottom: "36px",
      }}
    >
      <Tabs
        type={"card"}
        onChange={() => {
          if (isHistoryOutdated) {
            fetchHistory();
            setHistoryOutdated(false);
          }
        }}
      >
        {TABS.map(({ title }) => (
          <TabPane tab={t({id: title})} key={title}>
            <Table
              columns={getColumns(title, {
                archiveMessage: async (id, buyerID, Question) => {
                  viewedMessageID === id && closeMessage();
                  await archiveEbayMessage(id, buyerID, Question);
                  setHistoryOutdated(true);
                },
                viewMessage: (id) => {
                  setViewedMessageID(id);
                },
                viewedMessageID,
                t
              })}
              loading={titleToMessagesMap[title].loading}
              rowKey={({ id }) => id}
              dataSource={titleToMessagesMap[title].messages}
              pagination={{
                position: ["bottomLeft"],
                total: titleToMessagesMap[title].total,
                showSizeChanger: false,
                pageSize,
                onChange: (page) => {
                  titleToMessagesMap[title].setPage(page - 1);
                  closeMessage();
                },
              }}
              locale={{
                filterConfirm: t({id: 'app.common.ok'}),
                filterReset: t({id: 'app.common.reset'}),
                emptyText: t({id: 'app.common.no_data'})
              }}
              expandable={{
                expandedRowRender: (payload) => {
                  const { history, id, buyerID, Question, isNew } = payload;

                  return (
                    <MessagesList
                      messages={history}
                      onClose={() => {
                        closeMessage();
                      }}
                      onAnswer={async (messageID, answer) => {
                        await answerEbayQuestion(
                          id,
                          messageID,
                          answer,
                          buyerID,
                          Question
                        );
                        closeMessage();
                        setHistoryOutdated(true);
                      }}
                      withButton={isNew ? true : false}
                    />
                  );
                },
                expandedRowKeys: [viewedMessageID],
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </Page>
  );
};

const mapStateToProps = ({ ebay , property}) => ({
  ...ebay,
  property : property.property
});

const mapDispatchToProps = {
  getEbayMessages,
  archiveEbayMessage,
  answerEbayQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(EbayMessages);
