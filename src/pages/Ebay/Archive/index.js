import React, { useState } from 'react';
import { connect } from "react-redux";
import Page from "../../../components/Common/Page";
import Form from "../../../components/Common/Form";
import { archiveSearchSchema } from "../../../validation/Ebay/archive";
import './styles.less';
import { Checkbox, Table } from "antd";
import { getEbayArchiveMails, resetEbayArchiveMails } from "../../../appRedux/actions/Ebay";
import { COLUMNS } from "./options";
import { parseTextToRows } from "../../../util/strings/parsers";
import { Redirect } from 'react-router-dom';
import { useFormatMessage } from 'react-intl-hooks';

const EbayArchive = ({ archive, getEbayArchiveMails, resetEbayArchiveMails ,property}) => {
  const [withContent, setWithContent] = useState(false);
  const { mails, isFetched } = archive;
  const t = useFormatMessage();
  if(property&&!property.objectId){
    return <Redirect to="/"/>  
  }
  return (
    <Page
      className={'ebayArchive'}
      title={t({id: 'app.ebay.messages.mail_archive'})}
    >
      <div className={'ebayArchive-header'}>
        <Form
          initialValues={{
            itemID: ''
          }}
          rows={[
            [
              {
                label: t({id: 'app.ebay.messages.enter_ebay_item_id'}),
                placeholder: '264077385229-0001',
                name: 'itemID',
                suffix: <button className={'formik-footer-submit'} type={'submit'}>{t({id: 'app.ebay.messages.search'})}</button>
              }
            ]
          ]}
          schema={archiveSearchSchema}
          onSubmit={({ itemID }) => {
            resetEbayArchiveMails();
            getEbayArchiveMails(itemID, withContent);
          }}
          withReset={false}
          submitAction={'none'}
        />
        <Checkbox
          checked={withContent}
          onChange={({ target }) => {
            const { checked } = target;
            setWithContent(checked);
          }}
        >
          {t({id: 'app.ebay.messages.with_content'})}
        </Checkbox>
      </div>
      {isFetched ?
        (
          <Table
            columns={COLUMNS.map(column => ({
              ...column,
              title: column.title ? t({id: column.title}) : ''
            }))}
            rowKey={({ id }) => id}
            dataSource={mails}
            pagination={false}
            expandable={{
              defaultExpandAllRows: withContent,
              expandedRowRender: (payload) => {
                const rows = parseTextToRows(payload.body);
                
                return (
                  <div className={'ebayArchive-content'}>
                    {rows.map((row, index) => (
                      <p key={index}>{row}</p>
                    ))}
                  </div>
                )
              }
            }}
            locale={{
              filterConfirm: t({id: 'app.common.ok'}),
              filterReset: t({id: 'app.common.reset'}),
              emptyText: t({id: 'app.common.no_data'})
            }}
          />
        ) : null}
    </Page>
  )
};


const mapStateToProps = ({ ebay ,property}) => ({
  archive: ebay.archive,
  property: property.property
});

const mapDispatchToProps = {
  getEbayArchiveMails,
  resetEbayArchiveMails,
};

export default connect(mapStateToProps, mapDispatchToProps)(EbayArchive);