import "react-native-get-random-values";
import { configureStore } from "@reduxjs/toolkit";
import userSettingsReducer from "./slices/userSetting/userSettingSlice";
import authReducer from "./slices/auth/authSlice";
import utilitiesReducer from "./slices/utilities/utilitiesSlice";
import fleetManagementReducer from "./slices/fleetManagement/fleetManagementSlice";
import ReduxDispatchSingleton from "../services/reduxDispatchSingleton";

const store = configureStore({
  reducer: {
    userSettings: userSettingsReducer,
    auth: authReducer,
    utilities: utilitiesReducer,
    fleetManagement: fleetManagementReducer
  },
});

ReduxDispatchSingleton.setDispatch(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
