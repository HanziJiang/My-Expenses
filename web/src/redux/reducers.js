import { combineReducers } from "redux";
import settings from "./settings/reducer";
import menu from "./menu/reducer";
import authUser from "./auth/reducer";
import category from "./category/reducer";
import expense from "./expense/reducer";

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  category,
  expense
});

export default reducers;
