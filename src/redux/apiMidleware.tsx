import { AxiosError, Method } from "axios";
import instance from "../axios";

import { Action, Dispatch } from "@reduxjs/toolkit";
import { EApiAction } from "../constants/Actions";

export interface AccountType {
    username: string;
    password: string;
}

interface ApiActionType {
    type: string;
    payload: {
        url: string;
        method: Method;
        data?: AccountType | null;
        setCookies: () => void;
        onSuccess: string;
        onError: string;
    };
}

const apiMiddleware =
    ({ dispatch }: { dispatch: Dispatch }) =>
    (next: Dispatch<Action>) =>
    async (action: ApiActionType) => {
        if (action.type !== EApiAction.apiCallBegan) {
            return next(action);
        }
        const { url, method, data, onSuccess, onError } = action.payload;

        try {
            const res = await instance({ method, url, data });
            dispatch({ type: onSuccess, payload: res.data });
        } catch (error) {
            error instanceof AxiosError
                ? dispatch({ type: onError, payload: error.response?.data })
                : dispatch({ type: onError, payload: error });
        }
    };

export default apiMiddleware;
