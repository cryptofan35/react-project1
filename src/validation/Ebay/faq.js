import { object, string } from "yup";
import translate from 'util/translate';

const SIMPLE_REQUIRED_TEXT = 'app.common.field_is_required';

export const ANSWER = string()
  .required(translate(SIMPLE_REQUIRED_TEXT))
  .max(2000, 'No more than 2000 characters');

export const FAQItemSchema = object().shape({
  question: string()
    .required(translate(SIMPLE_REQUIRED_TEXT)),
  answer: ANSWER,
});
