import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import reducers from "./reducers";

export function configureStore(initialState) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(reduxThunk)
  );

  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
