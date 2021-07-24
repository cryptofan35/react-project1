import React, {useState} from "react";
import { Row, Col, Spin, Button, Select, Option } from "antd";
import Modal from "antd/lib/modal/Modal";
import { Link } from "react-router-dom";
import AlertCircleOutline from "@2fd/ant-design-icons/lib/AlertCircleOutline";
import wizard_svg from "../../../assets/svg/wizard.svg";
import PropertyAddCard from "../../../components/property/Card";
import { addNewProperty, createProfileWithCurrency } from "../../../appRedux/actions";
import { connect } from "react-redux";
import { useFormatMessage } from 'react-intl-hooks';
import arrowDown from "assets/images/arrow-down-black.png";

import "./add.less";

const HomeCurrencyModal = ({visible, onCancel, onNextButtonPressed, currencies}) => {
  const [currency, setCurrency] = useState(null);
  return (
    <Modal
      footer={null}
      visible={visible}
      centered
      closable={false}
      onCancel={onCancel}
      className="home-currency-modal"
    >
      <div className="modal-title">Please choose Home Currency</div>
      <div>
        <Select 
          placeholder="Select" 
          suffixIcon={<img src={arrowDown} />} 
          onChange={setCurrency}
          showSearch
          filterOption={(input, option) => 
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {currencies.map(({code, name}) => (
            <Select.Option key={code} value={code}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="modal-footer">
        <Button type="primary" ghost onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" onClick={() => onNextButtonPressed(currency)} disabled={!currency}>
          Next
        </Button>
      </div>

    </Modal>
  )
}

const AddScreen = props => {
  const { addNewProperty, loadingAddNewProperty, currencies, createProfileWithCurrency, history } = props;
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  
  const t = useFormatMessage();

  function handleWizardClick() {
    addNewProperty();
  }

  const handleImportBookingClick = () => {
    //addNewProperty("import");
    setIsCurrencyModalVisible(true);
  }

  const onImportCurrencyPicked = async (currency) => {
    setIsCurrencyModalVisible(false);
    await createProfileWithCurrency(currency)
    return history.push('/property/import')
  }

  return (
    <div className="cb-add-content-wrapper">
      <div className="cb-notify-wrapper">
        <span className="title">
          <AlertCircleOutline style={{ color: "#000000", fontSize: 24 }} />
          <span style={{}}>{t({id: 'app.dashboard.add_your_property'})}</span>
        </span>
        <p />
        <span className="content">
          {t({id: 'app.dashboard.you_need_to_create_property'})}
        </span>
      </div>
      <div className="card-wrapper">
        <Row gutter={[50, 0]}>
          <Col span={8}>
            <div
              role="button"
              style={{ cursor: "pointer" }}
              onClick={handleImportBookingClick}
            >
              <Spin spinning={loadingAddNewProperty === "import"}>
                <PropertyAddCard
                  img={"B."}
                  title={"Booking.com"}
                  content={t({id: 'app.dashboard.pull_hotel_data'})}
                />
              </Spin>
            </div>
          </Col>
          <Col span={8}>
            <div
              role="button"
              style={{ cursor: "pointer" }}
              onClick={() => addNewProperty("name")}
            >
              <Spin spinning={loadingAddNewProperty === "name"}>
                <PropertyAddCard
                  img={<img src={wizard_svg} />}
                  title={t({id: 'app.dashboard.wizard'})}
                  content={t({id: 'app.dashboard.manually_register'})}
                />
              </Spin>
            </div>
          </Col>
        </Row>
        <HomeCurrencyModal 
          currencies={currencies}
          visible={isCurrencyModalVisible} 
          onCancel={() => setIsCurrencyModalVisible(false)}
          onNextButtonPressed={onImportCurrencyPicked}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  loadingAddNewProperty: state.property.loadingAddNewProperty,
  property: state.property ? state.property.property : null,
  currencies: state.data.currencies
});

const mapDispatchToProps = {
  addNewProperty,
  createProfileWithCurrency
};

export default connect(mapStateToProps, mapDispatchToProps)(AddScreen);
