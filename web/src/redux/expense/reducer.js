import {
  CREATE_EXPENSE,
  EXPENSE_ERROR,
  GET_EXPENSES,
  DELETE_EXPENSES
} from "./types";

const INIT_STATE = {
  expenses: [],
  totalExpensesCount: 0,
  error: ""
};

export default (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_EXPENSE:
      return {
        ...state,
        error: ""
      };
    case EXPENSE_ERROR:
      return { ...state, error: payload };
    case GET_EXPENSES:
      return {
        ...state,
        expenses: payload.expenses,
        totalExpensesCount: payload.expensesCount,
        error: ""
      };
    case DELETE_EXPENSES:
      return {
        ...state,
        error: ""
      };
    default:
      return state;
  }
};
