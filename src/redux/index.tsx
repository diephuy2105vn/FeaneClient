import { Middleware, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import apiMiddleware from "./apiMidleware";
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiMiddleware as Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
