import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../../components/Common/Page";
import LocaleSwitcher from "../../../components/Common/LocaleSwitcher";
import {
  getConfigDetails,
  updateFAQList,
  updateTCList,
  getDefaultFAQandTC,
} from "../../../appRedux/actions/Ebay";
import { getProperty } from "../../../appRedux/actions";
import "./styles.less";
import Accordion from "../../../components/Accordion";
import { Redirect } from 'react-router-dom';

import { showNotification } from "../../../util/notifications";

import { useFormatMessage } from 'react-intl-hooks';

import { ENGLISH_LOCALE, GERMAN_LOCALE } from "../../../constants/Locales";

const LOCALES = [ENGLISH_LOCALE, GERMAN_LOCALE];

const emptyFaqItem = {
  answer: { en: "", de: "" },
  question: { en: "", de: "" },
  isNewItem: false,
};
const emptyTcItem = {
  answer: { en: "", de: "" },
  question: { en: "", de: "" },
  isNewItem: false,
};

const notificationErrorMessage = {
  en: 'To sell on eBay we have to leave at least one frequently asked question.',
  de: 'Um bei eBay zu verkaufen, müssen wir mindestens eine häufig gestellte Frage hinterlassen.'
};

const FAQPage = ({
  objectId,
  getConfigDetails,
  faq,
  tc,
  locale,
  updateFAQList,
  updateTCList,
  getDefaultFAQandTC,
  property,
}) => {
  const [itemsFAQ, setItemsFAQ] = useState([]);
  const [itemsTC, setItemsTC] = useState([]);
  const [activeFAQIdx, setActiveFAQIdx] = useState(null);
  const [activeTCIdx, setActiveTCIdx] = useState(null);
  const [languageId, setLanguageId] = useState(locale.languageId);
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const t = useFormatMessage();

  useEffect(() => {
    const localeObject = LOCALES.find(loc => loc.languageId === languageId);
    setSelectedLocale(localeObject);
  }, [languageId]);

  useEffect(() => {
    setItemsFAQ(faq);
  }, [faq]);

  useEffect(() => {
    setItemsTC(tc);
  }, [tc]);

  useEffect(() => {
    if (!objectId) return;
   getConfigDetails(objectId).then((data)=> {
      const { faq, tc } = data;

      if(!faq.length || !tc.length ) {
        getDefaultFAQandTC(1);
      }
    });
  }, [objectId]);

  useEffect(() => {
    getProperty();
  }, [property]);

  const handleUpdateFAQList = (items) => {
    // if(!!items.find(item => !item.answer.en || !item.question.en)) return;
    updateFAQList(items);
  };

  const handleUpdateTCList = (items) => {
    // if(!!items.find(item => !item.answer.en || !item.question.en)) return;
    updateTCList(items);
  };

  const handleAddItemFAQ = () => {
    const temp = emptyFaqItem;
    temp.isNewItem = true;
    const newItems = [...itemsFAQ, emptyFaqItem];
    setItemsFAQ(newItems);

    const currentLocaleItems = newItems.filter(item => item['question'][selectedLocale.locale].length > 0 || item.isNewItem);
    setActiveFAQIdx(currentLocaleItems.length - 1);
  };

  const handleAddItemTC = () => {
    const temp = emptyTcItem;
    temp.isNewItem = true;
    const newItems = [...itemsTC, emptyTcItem];
    setItemsTC(newItems);

    const currentLocaleItems = newItems.filter(item => item['question'][selectedLocale.locale].length > 0 || item.isNewItem);
    setActiveTCIdx(currentLocaleItems.length - 1);
  };

  const handleChangeItemFAQ = (idx, { answer, question }) => {

    const existingItem = !!itemsFAQ[idx] ? itemsFAQ[idx] : emptyFaqItem;
    const newItem = {
      answer: {
        ...existingItem.answer,
        [selectedLocale.locale]: answer,
      },
      question: {
        ...existingItem.question,
        [selectedLocale.locale]: question,
      },
    };

    const newItems = itemsFAQ.map((item, itemIdx) =>
      idx === itemIdx ? newItem : item
    );
    setItemsFAQ(newItems);
    handleUpdateFAQList(newItems);
  };

  const handleChangeItemTC = (idx, { answer, question }) => {
    const existingItem = !!itemsTC[idx] ? itemsTC[idx] : emptyTcItem;
    const newItem = {
      answer: {
        ...existingItem.answer,
        [selectedLocale.locale]: answer,
      },
      question: {
        ...existingItem.question,
        [selectedLocale.locale]: question,
      },
    };

    const newItems = itemsTC.map((item, itemIdx) =>
      idx === itemIdx ? newItem : item
    );
    setItemsTC(newItems);

    handleUpdateTCList(newItems);
  };

  const handleRemoveItemFAQ = (idx) => {
    const newItems = itemsFAQ.filter((_, itemIdx) => idx !== itemIdx);

    const currentValue = itemsFAQ.find((value,index)=> idx == index);
    const currentLocalization = currentValue.question.en ? 'en' : 'de';
    const isLastElementInList = !newItems.find((value)=> value.question[currentLocalization]);

    if(!!isLastElementInList){
      showNotification({message: notificationErrorMessage[locale.locale]},{ width: '500px', className: 'customize-faq' })
    }else{
      setItemsFAQ(newItems);
      handleUpdateFAQList(newItems);
    }

  };

  const handleRemoveItemTC = (idx) => {
    const newItems = itemsTC.filter((_, itemIdx) => idx !== itemIdx);
    setItemsTC(newItems);
    handleUpdateTCList(newItems);
  };
  if(property && !property.objectId){
    return <Redirect to="/"/>
  }

  return (
    <Page title={t({id: 'app.ebay.faq.faq_tc'})} className={"FAQ"}>
      <div className={"FAQ-header"}>
        <h3>{t({id: 'app.ebay.faq.faq'})}</h3>
        <LocaleSwitcher locale={selectedLocale} onSwitch={setLanguageId} />
      </div>
      <Accordion
        items={itemsFAQ}
        locale={selectedLocale}
        addItem={handleAddItemFAQ}
        changeItem={handleChangeItemFAQ}
        removeItem={handleRemoveItemFAQ}
        addBtnText={`+ ${t({id: 'app.ebay.faq.add_question'})}`}
        addedItemIdx={activeFAQIdx}
      />
      <h3>{t({id: 'app.ebay.faq.tc'})}</h3>
      <Accordion
        items={itemsTC}
        locale={selectedLocale}
        addItem={handleAddItemTC}
        changeItem={handleChangeItemTC}
        removeItem={handleRemoveItemTC}
        addBtnText={`+ ${t({id: 'app.ebay.faq.add_item'})}`}
        addedItemIdx={activeTCIdx}
      />
    </Page>
  );
};

const mapStateToProps = ({ ebay, settings, property }) => ({
  faq: ebay.faq,
  tc: ebay.tc,
  locale: settings.locale,
  objectId:
    (property && property.property && property.property.objectId) || null,
  property: property && property.property,
});

const mapDispatchToProps = {
  getConfigDetails,
  updateFAQList,
  updateTCList,
  getDefaultFAQandTC,
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQPage);
