import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AccountType } from "./apiMidleware";
import { EApiAction } from "../constants/Actions";
import { RootState } from "./index";
import Cookies from "universal-cookie";
import { ShopType } from "../constants/Shop";

export interface UserType {
    id: string;
    username: string;
    name: string;
    address?: string;
    phoneNumber?: string;
    avatar: string;
    roles?: Array<string>;
    accessToken?: string;
    shops?: Array<ShopType>;
}

const initialState = {
    user: null as UserType | null,
    loading: false,
    error: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userRequested: (state) => {
            state.loading = true;
        },
        userLogin: (state, action: PayloadAction<UserType>) => {
            const cookies = new Cookies();
            cookies.set("accessToken", action.payload.accessToken);
            state.user = action.payload;
            state.loading = false;
        },
        userLogout: (state) => {
            const cookies = new Cookies();
            cookies.remove("accessToken");
            state.user = null;
            state.loading = false;
        },
        userFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
    },
});

export default userSlice.reducer;

const { userRequested, userLogin, userLogout, userFailed } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

export const loginUser = (userRequest: AccountType) => (dispatch: Dispatch) =>
    dispatch({
        type: EApiAction.apiCallBegan,
        payload: {
            url: "/auth/signin",
            method: "POST",
            data: userRequest,
            onLoading: userRequested.type,
            onSuccess: userLogin.type,
            onError: userFailed.type,
        },
    });

export const refreshUser = () => (dispatch: Dispatch) =>
    dispatch({
        type: EApiAction.apiCallBegan,
        payload: {
            url: "/auth/refresh",
            method: "POST",
            onLoading: userRequested.type,
            onSuccess: userLogin.type,
            onError: userFailed.type,
        },
    });

export const logoutUser = () => (dispatch: Dispatch) =>
    dispatch({
        type: EApiAction.apiCallBegan,
        payload: {
            url: "/auth/signout",
            method: "POST",
            onLoading: userRequested.type,
            onSuccess: userLogout.type,
            onError: userFailed.type,
        },
    });
