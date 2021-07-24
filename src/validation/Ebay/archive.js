import { object, string } from "yup";
import translate from 'util/translate';

const SIMPLE_REQUIRED_TEXT = 'app.common.field_is_required';
const FORMAT_ERROR_TEXT = 'app.ebay.invalid_item_id';

export const archiveSearchSchema = object().shape({
  itemID: string()
    .required(translate(SIMPLE_REQUIRED_TEXT))
    .matches(/[0-9]{12}\-[0-9]{4}$/gm, translate(FORMAT_ERROR_TEXT))
});
