import * as Yup from "yup";
import translate from 'util/translate';

const REQUIRED_LABEL = 'app.common.field_should_not_be_empty';
const SIMPLE_REQUIRED_TEXT = 'app.common.field_is_required';
const EMAIL_FORMAT = 'app.common.wrong_email_format';

export const basicSettingsSchema = Yup.object().shape({
  userName: Yup.string().nullable()
    .required(translate(REQUIRED_LABEL)),
  password: Yup.string().nullable()
    .required(translate(REQUIRED_LABEL))
});

export const marketPlaceSchema = Yup.object().shape({
  country: Yup.string().required(translate(SIMPLE_REQUIRED_TEXT)),
  email: Yup.string().required(translate(SIMPLE_REQUIRED_TEXT)).email(translate(EMAIL_FORMAT)),
});

export const emailSettingsSchema = Yup.object().shape({
  email: Yup.string().required(translate(SIMPLE_REQUIRED_TEXT)).email(translate(EMAIL_FORMAT)),
});

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
