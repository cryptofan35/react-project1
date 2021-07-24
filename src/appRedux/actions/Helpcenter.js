import {
  FETCH_ERROR,
  FETCH_SUCCESS,
} from "../../constants/ActionTypes";
import {baseURL} from '../../util/Api'

export const sendMessage = ({senderName, senderEmail, lang, message, token}) => async (dispatch) => {
  try {
    const req = await fetch(`${baseURL}helpcenter/sendmessage`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'access-token': `Bearer ${token}`
      },
      body: JSON.stringify({
        senderName,
        senderEmail,
        lang,
        message,
      })
    });
    if(req.status === 200) {
      const json = await req.json()
      return new Promise((res) => {
        res(json)
      })
    }
    dispatch({ type: FETCH_SUCCESS });
  } catch (e) {
    dispatch({ type: FETCH_ERROR, payload: e });
  }
}
