import { object } from "yup";
import { ANSWER } from "./faq";

export const messageSchema = object().shape({
  answer: ANSWER,
});
