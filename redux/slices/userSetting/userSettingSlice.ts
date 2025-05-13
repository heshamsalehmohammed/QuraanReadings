import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { getUserSettings, saveUserSettingsApi } from "./userSettingsApi";
import { handleHttpRequestPromise } from "@/services/reduxHelpers";
import _ from "lodash";
import { RootState } from "@/redux/store";

export const fetchUserSettings: any = createAsyncThunk(
  "userSettings/fetchUserSettings",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(getUserSettings(), undefined, false).then(
      (result: any) => {
        if (!result) {
          return thunkAPI.rejectWithValue({});
        }
        return thunkAPI.fulfillWithValue({ result });
      }
    );
  }
);

export const saveUserSettings: any = createAsyncThunk(
  "userSettings/saveUserSettings",
  async (payload: any, thunkAPI) => {
    const currentState = thunkAPI.getState() as RootState;
    const userId = currentState.auth.user.userAccount.id;
    const lastSavedSettings = selectLastSavedUserSettings(currentState);
    const currentSettings = selectUserSettings(currentState);

    if (!_.isEqual(currentSettings, lastSavedSettings)) {
      return handleHttpRequestPromise(
        saveUserSettingsApi({ ...payload, userId })
      ).then((result: any) => {
        if (!result) {
          return thunkAPI.rejectWithValue({});
        }
        thunkAPI.dispatch(fetchUserSettings());
        return thunkAPI.fulfillWithValue({ result });
      });
    } else {
      return thunkAPI.fulfillWithValue({ lastSavedSettings });
    }
  }
);

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: initialState,
  reducers: {
    reset_userSettingsSlice: () => _.cloneDeep(initialState),
    setUserSettings: (state, action) => {
      state.settings.fontSize = action.payload.fontSize;
      state.settings.themeSelection = action.payload.themeSelection;
    },
    resetUserSettings: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserSettings.fulfilled, (state, action) => {
      const { themeSelection, fontSize } = action.payload.result.data;
      state.settings.themeSelection = themeSelection;
      state.settings.fontSize = fontSize;
      state.lastSavedSettings = action.payload.result.data;
    });
  },
});

export const selectUserSettings = (state: RootState) =>
  state.userSettings.settings;
export const selectLastSavedUserSettings = (state: RootState) =>
  state.userSettings.lastSavedSettings;

export const { setUserSettings, resetUserSettings, reset_userSettingsSlice } =
  userSettingsSlice.actions;

export default userSettingsSlice.reducer;
