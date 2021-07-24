import React, {useState} from "react";
import { connect } from "react-redux";
import Page from "components/Common/Page";
import { sendMessage } from "../../appRedux/actions/Helpcenter";
import { Form, Input, Button } from "antd";
import { useFormatMessage } from "react-intl-hooks";
import WatchVideoIcon from '../../assets/svg/watch-video-icon.svg';
import FAQIcon from '../../assets/svg/faq-icon.svg';
import ReadBlogIcon from '../../assets/svg/read-blog-icon.svg';
import CheckCircleOutline from "@2fd/ant-design-icons/lib/CheckCircleOutline";
import "./styles.less";

import { requiredValidator } from "../../util/Validators";
import { REQUIRED_ERR_MSG } from "../../constants/ErrorMessages";

const {TextArea} = Input;

const HelpCenter = ({locale, auth, sendMessage}) => {
  const t = useFormatMessage();

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const onSend = async (values) => {

    const errorMsg = requiredValidator(t({id: REQUIRED_ERR_MSG}))(values.request);
    if (errorMsg !== '') {
      setFormError(errorMsg);
      return;
    }
    setFormError(null);

    const message = values.request;
    const senderName = auth.user.name;
    const senderEmail = auth.user.email;
    const lang = auth.user.language_id === 'eng' ? 'EN' : 'DE';
    const token = auth.token;

    const result = await sendMessage({senderName, senderEmail, lang, message, token});

    if (result) {
      setFormSuccess(true);
    }
  }

  const onSendMore = (e) => {
    setFormSuccess(false);
  }

  return (
    <Page
      className={"HelpCenter"}
      title={t({ id: "app.helpcenter.help_center" })}
    >
    <div className="helpcenter-content">
      <p dangerouslySetInnerHTML={{ __html: t({ id: "app.helpcenter.support_email" }) }}></p>

      {!formSuccess &&
        <div className="form-container">
          <p>Submit a support request:</p>

          <Form onFinish={(values) => onSend(values)}>
            <Form.Item name="request">
              <TextArea onChange={({target}) => { setFormError(target.value.length > 0 && null)}} className={formError ? 'form-error' : ''} placeholder={t({ id: "app.helpcenter.submit_request_field" })} rows={4} />
            </Form.Item>
            {formError && <div className="form-error"><span>{formError}</span></div>}
            <div className="button-container">
              <Button type="primary" htmlType="submit">
                {t({id: 'app.helpcenter.submit_request_button'})}
              </Button>
            </div>
          </Form>
        </div>
      }

      {formSuccess && <>
        <div className="form-feedback">
          <div className="form-success-card">
              <CheckCircleOutline />
              <div className="message">
                <span dangerouslySetInnerHTML={{ __html: t({ id: "app.helpcenter.form_success_title" }) }}></span>
                <span dangerouslySetInnerHTML={{ __html: t({ id: "app.helpcenter.form_success_message" }).split('{email}').join(auth.user.email) }}></span>
              </div>
          </div>
          <div className="button-container">
            <button type="submit" onClick={(e) => onSendMore()} className="send-more-button">{t({ id: "app.helpcenter.submit_request_button_more" }) }</button>
          </div>
        </div>
      </>}

      <div className="search-answers">
        <h4>{t({id: 'app.helpcenter.search_answer_title'})}</h4>

        <div className="card-group">
          <a href="https://www.youtube.com/channel/UCPOx66n3Q_GJlZXaNmjsRCw" target="_blank">
            <div className="card">
              <img src={WatchVideoIcon} width="35" height="35" />
              <h4>{t({id: 'app.helpcenter.watch_video_title'})}</h4>
              <span>{t({id: 'app.helpcenter.watch_video_description'})}</span>
            </div>
          </a>

          <a href="https://www.cultbay.com/faq" target="_blank">
            <div className="card">
              <img src={FAQIcon} width="35" height="35" />
              <h4>{t({id: 'app.helpcenter.faq_title'})}</h4>
              <span>{t({id: 'app.helpcenter.faq_description'})}</span>
            </div>
          </a>

          <a href="https://www.cultbay.com/blog" target="_blank">
            <div className="card">
              <img src={ReadBlogIcon} width="35" height="35" />
              <h4>{t({id: 'app.helpcenter.read_blog_title'})}</h4>
              <span>{t({id: 'app.helpcenter.read_blog_description'})}</span>
            </div>
          </a>
        </div>
      </div>

    </div>
    </Page>
  );
};

const mapStateToProps = ({ settings, auth }) => {
  const { locale } = settings.locale;

  return {
    locale,
    auth
  };
};

export default connect(mapStateToProps, { sendMessage })(HelpCenter);

