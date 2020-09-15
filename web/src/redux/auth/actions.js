import { AUTH_USER, AUTH_ERROR } from "./types";
import { userStorageKey } from "../../constants/storage";

export const authenticateAsync = (
  serverCall,
  doneCallback,
  errorCallback = error => {}
) => async dispatch => {
  try {
    const response = await serverCall();
    if (!response.data.succeed) {
      const error = response.data.message;
      dispatch({ type: AUTH_ERROR, payload: error });
      errorCallback(error);
      return;
    }

    const user = response.data.content;

    sessionStorage.setItem(userStorageKey.token, user.token);
    sessionStorage.setItem(userStorageKey.firstName, user.firstName);
    sessionStorage.setItem(userStorageKey.lastName, user.lastName);

    await dispatch({
      type: AUTH_USER,
      payload: {
        authenticated: user.token,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

    doneCallback();
  } catch (err) {
    const error = "Something went wrong. Please try again later.";
    dispatch({ type: AUTH_ERROR, payload: error });
    errorCallback(error);
  }
};

export const logOut = () => {
  sessionStorage.removeItem(userStorageKey.token);
  sessionStorage.removeItem(userStorageKey.firstName);
  sessionStorage.removeItem(userStorageKey.lastName);

  return {
    type: AUTH_USER,
    payload: { authenticated: "", firstName: "", lastName: "" }
  };
};

export const forgotPasswordAsync = (
  serverCall,
  doneCallback,
  errorCallback = error => {}
) => async dispatch => {
  try {
    await serverCall();
    doneCallback();
  } catch (err) {
    const error = "We cannot process your request.";
    errorCallback(error);
  }
};

export const resetPasswordAsync = (
  serverCall,
  doneCallback,
  errorCallback = error => {}
) => async dispatch => {
  try {
    await serverCall();

    doneCallback();
  } catch (err) {
    const error = "We cannot reset your password.";
    errorCallback(error);
  }
};
