import React, { Fragment } from 'react';
import Message from "../Form";

const MessagesList = ({ messages = [], onClose, onAnswer, withButton = true }) => {
  
  return (
    <div className={'messagesList'}>
      {messages.map(({ question, answer, id ,repliedDate}, index) => {
        return (
          <Fragment key={id}>
            {index > 0 ?
              (
                <div style={{ backgroundColor: '#005C81', height: '1px', marginBottom: '20px' }}/>
              ) : null
            }
            <Message
              answer={answer}
              question={question}
              repliedDate={repliedDate}
              onClose={onClose}
              onSubmit={(answer) => {
                onAnswer(id, answer);
              }}
              withButton={withButton}
            />
          </Fragment>
        )
      })}
    </div>
  )
};

export default MessagesList;
