import { object, array, string, bool } from "yup";
import translate from 'util/translate';

const REQUIRED_LABEL = 'app.common.field_is_required';
const ONE_OF_REQUIRED_LABEL = 'app.calendars.quick_update.one_of';

export const schema = object().shape({
    rooms: array()
      .required(translate(REQUIRED_LABEL)),
    period: array()
      .required(translate(REQUIRED_LABEL)),
    availability: string()
      .test('test', translate(ONE_OF_REQUIRED_LABEL), function (value) {
        const { parent } = this;
        const { price } = parent;
    
        return value || price;
      }),
    closed: bool()
});