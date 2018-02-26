export function sendEmail(data) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/mail", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "EMAIL_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "EMAIL_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
