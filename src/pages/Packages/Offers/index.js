import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Page from "../../../components/Common/Page";
import { getOffersList, stopRunningOffer, removeOffer } from "../../../appRedux/actions/Ebay";
import { Tabs, Table, Modal } from 'antd';
import { OFFER_TYPES, OFFER_ACTIONS } from "../../../constants/Ebay/offers";
import { getIconByStatus, getActionsByType } from "../../../util/ebayOffers/getters";
import TableActions from "../../../components/TableActions";
import './styles.less';
import '../../../styles/layout/tablePaginationComponentStyles.less';
import Hint from '../../../components/Calendars/Package/Hint';
import FixedPriceIcon from '../../../assets/images/fixed-price.png';
import AuctionIcon from '../../../assets/images/auction.png';
import InfoIcon from "@2fd/ant-design-icons/lib/AlertCircleOutline";
import { Redirect } from 'react-router-dom';
import { MARKET_PLACES } from 'constants/Ebay/marketPlaces';
import { removeEmptyObject } from '../../../util/objects/filters';
import { useFormatMessage } from 'react-intl-hooks';
import { ComponentWithLoader } from "components/ComponentWithLoader";

const { TabPane } = Tabs;
const { running, past, future } = OFFER_TYPES;
const { stop, view, remove } = OFFER_ACTIONS;

const TABS = [
  {
    title: 'app.ebay.summary.running_offers',
    type: running
  },
  {
    title: 'app.ebay.summary.past_offers',
    type: past
  },
  {
    title: 'app.ebay.summary.future_offers',
    type: future
  }
];

const PURCHASES_TABLE_COLUMNS = [
  {
    title: 'app.ebay.summary.buyer_id',
    dataIndex: 'buyerID',
    key: 'buyerID',
    render: (_, payload) => {
     return payload.BuyerId;
    }
  },
  {
    title: 'app.ebay.summary.quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (_, payload) => {
      return payload.QuantityPurchased;
     }
  },
  {
    title: 'app.ebay.summary.price',
    dataIndex: 'price',
    key: 'price',
    render: (_, payload) => {
      return payload.TotalPrice;
     }
  },
  {
    title: 'app.ebay.summary.date',
    dataIndex: 'date',
    key: 'date',
    render: (_, payload) => {
      return payload.TransactionDate;
     }
  },
];

const getColumns = ({ stopOffer, openViewModal, removeOffer ,visibleOffersType, t}) =>removeEmptyObject([
  {
    title: '',
    dataIndex: 'status',
    key: 'status',
    render: (_,payload) => {
      const icon = getIconByStatus(payload.ListingType[0]);
      
      return (
        <div className={'offer-icon'}>
          <img src={icon} alt={payload.ListingType}/>
        </div>
      );
    }
  },
  {
    title: t({id: 'app.ebay.summary.name'}),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: t({id: 'app.ebay.summary.startTime'}),
    dataIndex: 'period',
    key: 'period',
    render(_, payload) {
      return payload.StartTime;
    }
  },
  {
    title: t({id: 'app.ebay.summary.marketplace_payee'}),
    dataIndex: 'market',
    key: 'market',
    render: (_, payload) => {
      const getMarketPlaceById = MARKET_PLACES.find((value)=>value.id == payload.SiteId);
      return(<div>
                <p>{getMarketPlaceById.value}</p>
                <p>{payload.PayeeAccount}</p>
            </div>);
    }
  },
  {
    title: t({id: 'app.ebay.summary.quantity'}),
    dataIndex: 'quantity',
    key: 'quantity',
    render: (_, payload) => {
      if(payload.QuantitySold && payload.Quantity){
        return <span>{payload.QuantitySold + '/' + payload.Quantity}</span>
      }else{
        return payload.Quantity;
      }
      
    }
  },
  {
    title: t({id: 'app.ebay.summary.price'}),
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: t({id: 'app.ebay.summary.duration'}),
    dataIndex: 'duration',
    key: 'duration',
    render: (_, payload) => {
      if (payload.Duration && payload.Duration[0] === '9999') {
        return 'GTC';
      }
      return payload.Duration;
    }
  },
  visibleOffersType!=future ? 
  {
    title: t({id: 'app.ebay.summary.visits'}),
    dataIndex: 'visits',
    key: 'visits',
  }:{},
  {
    title: t({id: 'app.ebay.summary.actions'}),
    dataIndex: 'type',
    key: 'actions',
    render: (text, item) => {
      const actions = getActionsByType(text);
      
      return <TableActions types={actions} onClick={(type => {

        switch (type) {
          case stop: {
            stopOffer(item.id, item.ItemId);
            break;
          }
          case view: {
            //openViewModal(item);
            let win = window.open(`https://www.ebay.de/itm/${item.ItemId}?ViewItem=&item=${item.ItemId}`, '_blank');
            win.focus();
            break;
          }
          case remove: {
            removeOffer(item.id);
          }
        }
      })}/>
    }
  }
]);

const Offers = ({ offers, getOffersList, loadingOffers, stopRunningOffer, removeOffer,property }) => {
  const [offerInView, setOfferInView] = useState(null);
  const [visibleOffersType, setVisibleOffersType] = useState(running);
  const t = useFormatMessage();
  
  useEffect(() => {
    getOffersList({status: visibleOffersType});
  }, [visibleOffersType, property]);
  
  if(property && !property.objectId){
    return <Redirect to="/"/> 
  }
  return (
    <Page title={t({id: 'app.ebay.summary.ebay_summary'})} className={'ebaySummary'} styles={{
      marginBottom: '47px'
    }}>
      <div className={'Summary-tabulator'}>
      <Tabs type={'card'} onChange={(type) => {
          setVisibleOffersType(type);
        }}>
          {TABS.map(({ title, type }) => (
            
              <TabPane disabled={loadingOffers} tab={title ? t({id: title}) : ''} key={type} forceRender={true}>
                <ComponentWithLoader loading={loadingOffers}>
                <Table
                  className={'cultbay-table'}
                  columns={
                    getColumns({
                    stopOffer: stopRunningOffer,
                    openViewModal: setOfferInView,
                    removeOffer,
                    visibleOffersType,
                    t
                  })}
                  showHeader={Boolean(offers.length)}
                  dataSource={offers}
                  rowKey={({ id }) => id}
                  pagination={{
                    pageSize: 4
                  }}
                  onPage
                  locale={{
                    emptyText: (
                      <div className={'info'}>
                        <InfoIcon width={20} height={20}/>
                        <p>{t({id: 'app.ebay.summary.no_records_found'})}</p>
                      </div>
                    )
                  }}
                />
                </ComponentWithLoader>
              </TabPane>
            
          ))}
        </Tabs>
        
      </div>
      {offers.length ? (
        <div className={'ebaySummary-hints'}>
          <Hint
            icon={FixedPriceIcon}
            title={t({id: 'app.ebay.summary.fixed_price'})}
          />
          <Hint
            icon={AuctionIcon}
            title={t({id: 'app.ebay.summary.not_available'})}
          />
        </div>
      ) : null}
      {offerInView ? (
        <Modal
          footer={null}
          visible={Boolean(offerInView)}
          title={`${t({id: 'app.ebay.summary.item_id'})}: ${offerInView.id} ${t({id: 'app.ebay.summary.purchase_history'})}`}
          centered
          onCancel={() => {
            setOfferInView(null);
          }}
        >
          <Table
            columns={PURCHASES_TABLE_COLUMNS.map(column => ({
              ...column,
              title: t({id: column.title})
            }))}
            dataSource={offerInView.Transactions[0].Transaction}
            pagination={false}
            locale={{
              filterConfirm: t({id: 'app.common.ok'}),
              filterReset: t({id: 'app.common.reset'}),
              emptyText: t({id: 'app.common.no_data'})
            }}
          />
        </Modal>
      ): null}
    </Page>
  )
};

const mapStateToProps = ({ ebay , property}) => ({
  offers: ebay.offers,
  loadingOffers: ebay.loadingOffers,
  property : property.property
});

const mapDispatchToProps = {
  getOffersList,
  stopRunningOffer,
  removeOffer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Offers);
