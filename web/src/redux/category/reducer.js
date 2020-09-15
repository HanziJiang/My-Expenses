import {
  CREATE_CATEGORY,
  CATEGORY_ERROR,
  GET_CATEGORIES,
  DELETE_CATEGORIES
} from "./types";

const INIT_STATE = {
  categories: [],
  totalCategoriesCount: 0,
  error: ""
};

export default (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_CATEGORY:
      return {
        ...state,
        error: ""
      };
    case CATEGORY_ERROR:
      return { ...state, error: payload };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload.categories,
        totalCategoriesCount: payload.totalCategoriesCount,
        error: ""
      };
    case DELETE_CATEGORIES:
      return {
        ...state,
        error: ""
      };
    default:
      return state;
  }
};
