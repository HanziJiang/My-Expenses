import {
  CREATE_EXPENSE,
  GET_EXPENSES,
  DELETE_EXPENSES,
  EXPENSE_ERROR
} from "./types";

export const createExpenseAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();

    messageCallback(response.data.succeed, response.data.message);
    if (!response.data.succeed) {
      dispatch({
        type: EXPENSE_ERROR,
        payload: response.data.message
      });
    } else {
      await dispatch({
        type: CREATE_EXPENSE,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later.";
    dispatch({ type: EXPENSE_ERROR, payload: error });
    messageCallback(false, error);
  }
};

export const getExpensesAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();
    
    messageCallback(response.data.succeed, response.data.message);

    if (!response.data.succeed) {
      dispatch({
        type: EXPENSE_ERROR,
        payload: response.data.message
      });
    } else {
      await dispatch({
        type: GET_EXPENSES,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later...";
    dispatch({ type: EXPENSE_ERROR, payload: error });
    messageCallback(false, error);
  }
};

export const deleteExpensesAsync = (
  serverCall,
  doneCallback,
  messageCallback = (succeed, message) => {}
) => async dispatch => {
  try {
    const response = await serverCall();

    messageCallback(response.data.succeed, response.data.message);

    if (!response.data.succeed) {
      dispatch({
        type: EXPENSE_ERROR,
        payload: response.data.message
      });
    } else {
      await dispatch({
        type: DELETE_EXPENSES,
        payload: response.data.content
      });
      await doneCallback();
    }
  } catch (err) {
    const error = "Something went wrong. Please try again later...";
    dispatch({ type: EXPENSE_ERROR, payload: error });
    messageCallback(false, error);
  }
};
