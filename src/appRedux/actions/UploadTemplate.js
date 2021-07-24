import { cultbayApi } from "util/Api";
import showSuccessMessage from "../../util/showSuccessMessage";
import showErrorMessage from "../../util/showErrorMessage";
import readTextFileContent from "util/readTextFileContent";
import { AuthenticationCode } from "constants/GlobalConstants";

export const CREATE_TEMPLATE_REQUEST = "CREATE_TEMPLATE_REQUEST";
export const CREATE_TEMPLATE_SUCCESS = "CREATE_TEMPLATE_SUCCESS";
export const CREATE_TEMPLATE_FAILED = "CREATE_TEMPLATE_FAILED";
const languageConverter = (id) => {
  switch (id) {
    case 1:
      return "de";
    case 2:
      return "en";
  }
};

function createTemplateRequest(payload) {
  return { type: CREATE_TEMPLATE_REQUEST, payload };
}

function createTemplateSuccess(payload) {
  return { type: CREATE_TEMPLATE_SUCCESS, payload };
}

function createTemplateFailed(payload) {
  return { type: CREATE_TEMPLATE_FAILED, payload };
}

export function createOfferTemplate(template) {
  return async (dispatch) => {
    dispatch(createTemplateRequest());

    const {
      htmlFile: [file],
      objectId,
      languageId,
      templateType,
    } = template;
    const fileContent = await readTextFileContent(file);

    const requestObj = {
      bezeichnung: templateType,
      cusebeda_objekt_id: objectId,
      langId: languageId,
      authenticationCode: AuthenticationCode,
      htmlcontent: fileContent,
    };

    try {
      await cultbayApi.post("/saveDesignTemplateHTML", requestObj);
      dispatch(createTemplateSuccess());
      showSuccessMessage("Template successfully uploaded");
    } catch (error) {
      const { response: axiosError } = error;
      if (!axiosError) {
        dispatch(createTemplateFailed(error));
      } else {
        dispatch(createTemplateFailed("Error creating template"));
      }
      showErrorMessage("There was an error creating the template");

      throw error;
    }
  };
}

export function createEmailTemplate(template) {
  return async (dispatch) => {
    dispatch(createTemplateRequest());

    const {
      htmlFile: [file],
      emailTypeId,
      objectId,
      languageId,
    } = template;
    const fileContent = await readTextFileContent(file);

    const requestObj = {
      authenticationCode: AuthenticationCode,
      body: fileContent,
      objectId,
      emailTypeId,
      lang: languageConverter(languageId),
    };

    try {
      await cultbayApi.post("/EmailTemplate", requestObj);
      dispatch(createTemplateSuccess());
      showSuccessMessage("Template successfully uploaded");
    } catch (error) {
      const { response: axiosError } = error;
      if (!axiosError) {
        dispatch(createTemplateFailed(error));
      } else {
        dispatch(createTemplateFailed("Error creating template"));
      }
      showErrorMessage("There was an error creating the template");

      throw error;
    }
  };
}
