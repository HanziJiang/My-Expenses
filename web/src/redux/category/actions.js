import { CREATE_CATEGORY, CATEGORY_ERROR, GET_CATEGORIES, DELETE_CATEGORIES } from "./types";

export const createCategoryAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();

    messageCallback(response.data.succeed, response.data.message);
    if (!response.data.succeed) {
      dispatch({ type: CATEGORY_ERROR, payload: response.data.message });
    } else {
      await dispatch({
        type: CREATE_CATEGORY,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later.";
    dispatch({ type: CATEGORY_ERROR, payload: error });
    messageCallback(false, error);
  }
};

export const getCategoriesAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();

    messageCallback(response.data.succeed, response.data.message);

    if (!response.data.succeed) {
      dispatch({ type: CATEGORY_ERROR, payload: response.data.message });
    } else {
      await dispatch({
        type: GET_CATEGORIES,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later...";
    dispatch({ type: CATEGORY_ERROR, payload: error });
    messageCallback(false, error);
  }
};

export const deleteCategoriesAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();

    messageCallback(response.data.succeed, response.data.message);

    if (!response.data.succeed) {
      dispatch({ type: CATEGORY_ERROR, payload: response.data.message });
    } else {
      await dispatch({
        type: DELETE_CATEGORIES,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later...";
    dispatch({ type: CATEGORY_ERROR, payload: error });
    messageCallback(false, error);
  }
};