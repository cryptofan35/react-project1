import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Space, Table, Tooltip, Button, Modal } from "antd";

import ContentForm from "components/ContentForm";
import StatusRow from "components/StatusRow"

import ProductDetails from "components/Packages/ProductDetails"
import PreviewPackage from "components/Packages/PreviewPackage";

import visibilityImage from "assets/images/visibility-24px.png";
import editImage from "assets/images/edit.png";
import infoImage from "assets/images/info.png";

import Marketplaces from "constants/Packages/Marketplaces";
import { getStatus } from "util/packages/filters";
import { useFormatMessage } from 'react-intl-hooks';
import { PAST } from "constants/Packages/Statuses";

import {
  getPackages as getPackagesAction,
  getPackageDetails as getPackageDetailsAction,
  getTemplateDetail as getTemplateDetailAction,
  checkPackageToOffer,
  clearPackageOfferable
} from "appRedux/actions";

import { getTokenStatus } from "appRedux/actions/Ebay";

import './templates.less'

const TemplatesPage = ({ 
  history, 
  loading,
  packagesList, 
  packagesCount,
  getPackages, 
  getPackageDetails, 
  property,
  user,
  getTemplateDetail,
  isPackageOfferable,
  checkPackageToOffer,
  clearPackageOfferable,
  getTokenStatus,
  tokenStatus,
  userName,
  password
 }) => {
  const [isDetailModalOpened, setIsDetailModalOpened] = useState(false);
  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);
  const t = useFormatMessage();

  useEffect(() => {
    if (!packagesCount && property && property.objectId) {
      getPackages({
        objectId: property.objectId,
        errorLang: user.language_id.substring(0, 2),
        offset: 0,
        limit: 10
      });
    }
  }, [])

  useEffect(() => {
    if (property && property.objectId) {
      getPackages({
        objectId: property.objectId,
        errorLang: user.language_id.substring(0, 2),
        offset: 0,
        limit: 10
      });
    }
  }, [property])

  useEffect(() => {
    if (userName && password && property && property.objectId) {
      getTokenStatus();
      return;
    } 
  }, [property, userName])

  useEffect(() => {
    if (true === isPackageOfferable) {
      history.push('/packages/place-offer');
      clearPackageOfferable();
      return;
    }
  }, [isPackageOfferable])

  const onClickEdit = async data => {
    await getPackageDetails({
      objectId: property && property.objectId ? property.objectId : null,
      packageId: data.productId,
      templateId: data.id
    })
    history.push('/packages/edit')
  }

  const onClickPlaceOffer = async data => {
    await checkPackageToOffer({
      objectId: property && property.objectId ? property.objectId : null,
      packageId: data.productId,
      templateId: data.id
    })
  };

  const onClickInformation = async data => {
    await getPackageDetails({
      objectId: property && property.objectId ? property.objectId : null,
      packageId: data.productId,
      templateId: data.id
    })
    setIsDetailModalOpened(true);
  }

  const onClickPreview = async data => {
    await getPackageDetails({
      objectId: property && property.objectId ? property.objectId : null,
      packageId: data.productId,
      templateId: data.id
    });
    await getTemplateDetail({
      objectId: property && property.objectId ? property.objectId : null,
      templateId: data.id,
      errorLang: user.language_id.substring(0, 2),
    });
    setIsPreviewModalOpened(true);
  }

  const getRenderButtonText = (data) => {
    if (data.runningOffersCount > 0) {
      return t({id: 'app.packages.list.repush_offer'});
    }

    if (data.pastOffersCount === 0 && data.runningOffersCount === 0 && data.futureOffersCount === 0) {
      return t({id: 'app.packages.list.offer'});
    }
    
    return '';
  }

  const onPaginationChange = (page, pageSize) => {
    if (property && property.objectId) {
      getPackages({
        objectId: property.objectId,
        errorLang: user.language_id.substring(0, 2),
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
    }
  }

  const columns = [
    {
      title: "",
      key: "status",
      width: '2%',
      render: StatusRow,
    },
    { title: t({id: 'app.packages.list.id'}), dataIndex: "productId", key: "productId", width: '2%' },
    { title: t({id: 'app.packages.list.package_name'}), dataIndex: "name", key: "name", width: '20%' },
    { title: t({id: 'app.packages.list.message'}), key: "message", width: '40%', render: data => {
        if (data.offerErrorMessage) {
          return (<>{data.offerErrorMessage}</>)
        }
        const status = getStatus(data);
        return (<>{ t({id: `app.packages.list.message.${status}`}) }</>)
      } 
    },
    { title: t({id: 'app.packages.list.marketplace'}), dataIndex: "siteId", width: '11%', key: "siteId", render: data => {
      return Marketplaces[data] ? Marketplaces[data]['name'] : ''
    } },
    {
      title: t({id: 'app.packages.list.offer'}),
      key: "offerToEbay",
      width: '15%',
      render: data => {
        return (
          <Space size="middle">
            <Button disabled={(!tokenStatus || !tokenStatus.isTokenSet) || (data.status === 'running')} className="packages__button" type="primary" onClick={ev => onClickPlaceOffer(data, ev)}>
              {getRenderButtonText(data)}
            </Button>
          </Space>
        )
      }
    },
    {
      title: t({id: 'app.packages.list.actions'}),
      key: "operation",
      width: '10%',
      render: data => {
        const status = getStatus(data);
        return (
          <Space size="middle" style={{ fontSize: "24px" }}>
            <Tooltip overlayClassName="packages__tooltip" title={t({id: 'app.packages.list.preview'})}>
              <img
                src={visibilityImage}
                style={{
                  cursor: "pointer",
                  marginRight: 10,
                  minWidth: 22
                }}
                onClick={() => onClickPreview(data)}
              />
            </Tooltip>
            {status !== PAST && (
              <Tooltip overlayClassName="packages__tooltip" title={t({id: 'app.packages.list.edit'})}>
                <img
                  src={editImage}
                  style={{
                    cursor: "pointer",
                    marginRight: 10,
                    minWidth: 18
                  }}
                  onClick={() => {
                    onClickEdit(data)
                  }}
                />
              </Tooltip>
            )}
            
            <Tooltip overlayClassName="packages__tooltip" title={t({id: 'app.packages.list.information'})}>
              <img
                src={infoImage}
                style={{
                  cursor: "pointer",
                  marginRight: 10,
                  minWidth: 20
                }}
                onClick={() => {
                  onClickInformation(data)
                }}
              />
            </Tooltip>
          </Space>
        )
      }
    }
  ];

  return (
    <ContentForm
      title={t({id: 'app.packages.list.package_list'})}
      buttonLabel={`+ ${t({id: 'app.packages.list.new_package'})}`}
      onClick={() => history.push('/packages/new')}
      className="packages__content-form"
    >
      <Table
        className="packages__table"
        columns={columns}
        dataSource={packagesList}
        pagination={{ position: ["bottomLeft"], total: packagesCount, showSizeChanger: false, onChange: onPaginationChange }}
        loading={loading}
        scroll={{ x: 720 }}
        rowKey="id"
        locale={{
          filterConfirm: t({id: 'app.common.ok'}),
          filterReset: t({id: 'app.common.reset'}),
          emptyText: t({id: 'app.common.no_data'})
        }}
      />
      <div className="packages__status-wrapper">
        <StatusRow showStatus failedOffersCount={0} runningOffersCount={0} futureOffersCount={0} pastOffersCount={0} />
        <StatusRow futureOffersCount={1} showStatus />
        <StatusRow runningOffersCount={1} showStatus />
        <StatusRow failedOffersCount={1} showStatus />
        <StatusRow pastOffersCount={1} showStatus />
      </div>
      <Modal
        className="packages__modal"
        title={t({id: 'app.packages.list.product_details'})}
        centered
        visible={isDetailModalOpened}
        onCancel={() => setIsDetailModalOpened(false)}
        footer={null}
        width={1100}
      >
        <ProductDetails />
      </Modal>

      <Modal
        className="packages__modal"
        title={t({id: 'app.packages.list.preview'})}
        centered
        visible={isPreviewModalOpened}
        onCancel={() => setIsPreviewModalOpened(false)}
        footer={null}
        width={1100}
      >
        <PreviewPackage />
      </Modal>
    </ContentForm>
  );
};

const mapStateToProps = ({ auth, data, packages, property, ebay }) => {
  const { user } = auth;
  const { languages } = data;
  const { packagesList, packageDetails, packageData, packagesCount, loading, isPackageOfferable } = packages;
  const { tokenStatus, settings: {
    userName,
    password
  } } = ebay;

  return { user, languages, packagesList, packagesCount, loading, packageDetails, packageData, property: property.property, isPackageOfferable, tokenStatus, userName, password };
};

const mapDispatchToProps = {
  getPackages: getPackagesAction,
  getPackageDetails: getPackageDetailsAction,
  getTemplateDetail: getTemplateDetailAction,
  checkPackageToOffer,
  clearPackageOfferable,
  getTokenStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesPage);
