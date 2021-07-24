import React from 'react';
import Form from "../../Common/Form";
import { TEXTAREA } from "../../../constants/FormFieldTypes";
import { messageSchema } from "../../../validation/Ebay/messages";
import './styles.less';
import { parseTextToRows } from "../../../util/strings/parsers";
import { useFormatMessage } from 'react-intl-hooks';

const MessageForm = ({ question, onClose,repliedDate = null, answer = null, onSubmit, withButton = false }) => {
  const questionParagraphs = parseTextToRows(question);
  const t = useFormatMessage();

  return (
    <div className={'message'}>
      <h4>{t({id: 'app.ebay.messages.question'})}:</h4>
      {questionParagraphs.map((text, index) => (
        <p
          key={index}
          className={'message-paragraph'}
        >
          {text}
        </p>
      ))}
      {
        answer ?
          (
            <div className={'message-answer'}>
              <h4>{t({id: 'app.ebay.messages.answer'})}:<span>{repliedDate}</span></h4>
              {parseTextToRows(answer).map((text, index) => (
                <p
                  key={index}
                  className={'message-paragraph'}
                >
                  {text}
                </p>

              ))}
            </div>
          )
          : (
            <Form
              initialValues={{
                answer: ''
              }}
              onSubmit={(values) => {
                const { answer } = values;
                onSubmit(answer);
              }}
              rows={[
                [
                  {
                    label: t({id: 'app.ebay.messages.answer'}),
                    type: TEXTAREA,
                    isWide: true,
                    name: 'answer',
                    placeholder: t({id: 'app.ebay.messages.write_your_answer'})
                  }
                ]
              ]}
              submitAction={withButton ? 'submit' : ''}
              schema={messageSchema}
              buttonText={t({id: 'app.common.send'})}
              secondaryButton={{
                onClick: (e) => {
                  e.preventDefault();
                  onClose();
                }
              }}
            />
          )
      }
    </div>
  )
};

export default MessageForm;
