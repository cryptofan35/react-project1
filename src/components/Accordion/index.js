import React, { useState, useEffect } from 'react';
import { Collapse } from "antd";
import Form from "../Common/Form";
import { TEXTAREA } from "../../constants/FormFieldTypes";
import { FAQItemSchema } from "../../validation/Ebay/faq";
import ExpandIcon from '../../assets/images/arrow-right.png';
import DropdownIcon from "../Common/Icons/DropdownIcon";
import './styles.less';
import { useFormatMessage } from 'react-intl-hooks';

const Accordion = ({ items, locale, changeItem, removeItem, addItem, addBtnText, addedItemIdx }) => {
  const [activeKey, setActiveKey] = useState('');
  const [isAddedOpen, setAddedOpen] = useState(false);
  const t = useFormatMessage();

  useEffect(() => {
    if (addedItemIdx !== null) {
      setActiveKey(String(addedItemIdx));
      setAddedOpen(true);
    }
  }, [addedItemIdx]);

  return (
    <div className={'Accordion'}>
      <Collapse
        onChange={(val) => {
          const key = val[1] || val[0] || '';
          setActiveKey(key);
        }}
        activeKey={activeKey}
        expandIcon={() => (
          <div className={'Accordion-dropdown'}>
            <DropdownIcon src={ExpandIcon}/>
          </div>
        )}
      >
        {!!items.length && items.map((item, idx) => {
          const { question, answer, isNewItem, isRequired = false  } = item;
          const answerValue = (answer && answer[locale.locale]) || '';
          const questionValue = (question && question[locale.locale]) || '';
          const isCreated = !answerValue && !questionValue;

          if (!isCreated || isNewItem) {
            return <Collapse.Panel
              header={isRequired || answer.disabledToRemove
                ? <span>{questionValue}<span style={{ color: '#D0021B' }}>*</span></span>
                : questionValue
              }
            >
              <Form
                initialValues={{
                  question: questionValue,
                  answer: answerValue
                }}
                onSubmit={(values) => {
                  if (values.question !== questionValue || values.answer !== answerValue) {
                    changeItem(idx, values);
                    isCreated && setAddedOpen(false);
                  }
                }}
                submitAction={!isCreated ? 'blur' : 'submit'}
                schema={FAQItemSchema}
                validateOnChange={true}
                buttonText={t({id: 'app.common.save'})}
                rows={[
                  [
                    {
                      name: 'question',
                      isWide: true,
                      disabled: answer.disabledToRemove,
                    }
                  ],
                  [
                    {
                      name: 'answer',
                      type: TEXTAREA,
                      isWide: true
                    }
                  ]
                ]}
              />
              {!isCreated && !isRequired && !answer.disabledToRemove&&(
                <div className={'formik-footer'}>
                  <button
                    className={'formik-footer-submit'}
                    onClick={() => removeItem(idx)}
                  >
                    {t({id: 'app.common.remove'})}
                  </button>
                </div>
              )}
            </Collapse.Panel>
          }
        })}
      </Collapse>
      {!isAddedOpen && (
        <div className={'addBtn'}>
          <span onClick={addItem}>{addBtnText}</span>
        </div>
        )}
    </div>
  )
};

export default Accordion;
