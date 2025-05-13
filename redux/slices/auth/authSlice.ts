import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState, { User } from "./initialState";
import {
  loginApi,
  logoutApi,
  resetPasswordApi,
  getUserDetailsApi,
} from "./authApi";
import { reset_utilitiesSlice } from "../utilities/utilitiesSlice";
import _ from "lodash";
import { reset_userSettingsSlice } from "../userSetting/userSettingSlice";
import { handleHttpRequestPromise } from "@/services/reduxHelpers";
import RouterSingleton from "@/services/routerSingleton";
import {
  getItemFromStorage,
  removeItemFromStorage,
  setItemInStorage,
} from "@/services/storage";

export const cleanAppState = createAction("cleanAppState");

export const resetUserPassword: any = createAsyncThunk(
  "auth/resetPassword",
  async (payload: any, thunkAPI) => {
    return handleHttpRequestPromise(resetPasswordApi(payload)).then(
      async (result: any) => {
        if (!result || !result.data) {
          return thunkAPI.rejectWithValue({});
        }
        await setItemInStorage("token", result.data.access_token);

        return thunkAPI.fulfillWithValue({ result });
      }
    );
  }
);

export const getUserDetails: any = createAsyncThunk(
  "auth/getUserDetails",
  async (payload: any, thunkAPI) => {
    const token = payload ?? (await getItemFromStorage("token"));
    return handleHttpRequestPromise(getUserDetailsApi(token), undefined, false)
      .then(async (result: any) => {
        if (!result || !result.data) {
          thunkAPI.dispatch(resetAppState());
          return thunkAPI.rejectWithValue({});
        }
        await setItemInStorage("userId", result.data.userAccount.id.toString());

        return thunkAPI.fulfillWithValue({ result: result.data });
      })
      .catch((res) => {
        return thunkAPI.rejectWithValue(res);
      });
  }
);

export const loginUser: any = createAsyncThunk(
  "auth/login",
  async (payload: any, thunkAPI) => {
    return handleHttpRequestPromise(loginApi(payload))
      .then(async (result: any) => {
        if (!result || !result.data) {
          return thunkAPI.rejectWithValue({});
        }
        await setItemInStorage("token", result.data.access_token);
        return thunkAPI.fulfillWithValue({ result: result.data });
      })
      .catch((res) => {
        return thunkAPI.rejectWithValue(res);
      });
  }
);

export const logoutUser: any = createAsyncThunk(
  "auth/logoutUser",
  async (payload: any, thunkAPI) => {
    const token = await getItemFromStorage("token");
    console.log('token at logout',token)
    return handleHttpRequestPromise(logoutApi(token)).then((result: any) => {
      if (!result) {
        return thunkAPI.rejectWithValue({});
      }
      thunkAPI.dispatch(resetAppState());
      return thunkAPI.fulfillWithValue({ result });
    });
  }
);

export const logoutUserAutomatically: any = createAsyncThunk(
  "auth/logoutUserAutomatically",
  async (_, { dispatch, fulfillWithValue }) => {
    dispatch(resetAppState());
    return fulfillWithValue({});
  }
);

export const resetAppState: any = createAsyncThunk(
  "auth/resetAppState",
  async (_, { dispatch, fulfillWithValue }) => {
    await completeLogoutUser();
    dispatch(reset_authSlice());
    dispatch(reset_userSettingsSlice());
    dispatch(reset_utilitiesSlice());
    return fulfillWithValue({});
  }
);

const completeLogoutUser = async () => {
  await removeItemFromStorage("token");
  await removeItemFromStorage("userId");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset_authSlice: () => _.cloneDeep(initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.auth = action.payload.result;
      state.auth.loginTime = new Date().toISOString();
    });
    builder.addCase(loginUser.rejected, (state, action) => {});
    builder.addCase(resetUserPassword.fulfilled, (state, action) => {
      state.auth = action.payload.result;
      state.auth.loginTime = new Date().toISOString();
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      const currentUser = new User(action.payload.result).toObject();
      //currentUser.userAccount.permissions = currentUser.userAccount.permissions.filter(item => item !== 9);
      state.user = currentUser;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {});
    builder.addCase(logoutUser.fulfilled, (state, action) => {});
    builder.addCase(resetAppState.fulfilled, (state, action) => {
      const router = RouterSingleton.getRouter();
      router.replace("/");
    });
  },
});

export const { reset_authSlice } = authSlice.actions;

export default authSlice.reducer;
