export default function messages(state = {}, action) {
  switch (action.type) {
    case "EMAIL_FAILURE":
      return {
        error: action.messages
      };
    case "EMAIL_SUCCESS":
      return {
        success: action.messages
      };
    case "CLEAR_MESSAGES":
      return {};
    default:
      return state;
  }
}
