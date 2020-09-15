import { AUTH_USER, AUTH_ERROR } from "./types";
import { userStorageKey } from "../../constants/storage";

const INIT_STATE = {
  user: {
    authenticated: sessionStorage.getItem(userStorageKey.token) || "",
    firstName: sessionStorage.getItem(userStorageKey.firstName) || "",
    lastName: sessionStorage.getItem(userStorageKey.lastName) || ""
  },
  error: ""
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, user: action.payload, message: "" };
    case AUTH_ERROR:
      localStorage.removeItem(userStorageKey.token);
      localStorage.removeItem(userStorageKey.firstName);
      localStorage.removeItem(userStorageKey.lastName);
      return { ...state, user: null, error: action.payload };
    default:
      return state;
  }
};
