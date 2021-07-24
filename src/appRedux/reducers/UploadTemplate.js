import {
  CREATE_TEMPLATE_FAILED,
  CREATE_TEMPLATE_REQUEST,
  CREATE_TEMPLATE_SUCCESS
} from "appRedux/actions/UploadTemplate";

const initialState = {
  createTemplate: {
    loadingCreateTemplate: false,
    createTemplateError: null
  }
};

export default function uploadTemplateReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case CREATE_TEMPLATE_REQUEST:
      return {
        ...state,
        createTemplate: {
          loadingCreateTemplate: true,
          createTemplateError: null
        }
      };
    case CREATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        createTemplate: {
          loadingCreateTemplate: false,
          createTemplateError: null
        }
      };
    case CREATE_TEMPLATE_FAILED:
      return {
        ...state,
        createTemplate: {
          loadingCreateTemplate: false,
          createTemplateError: payload
        }
      };
    default:
      return {
        ...state
      };
  }
}
