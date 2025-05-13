import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import _ from "lodash";
import { RootState } from "@/redux/store";
import { NotificationCenterService } from "@/services/NotificationCenterService";
import { v4 as uuidv4 } from "uuid";
import { Audio } from "expo-av";


const alertSound = require("../../../assets/sounds/alert.mp3"); 
const playNotificationSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(alertSound);
    await sound.playAsync();
  } catch (error) {
    console.log("Error playing sound:", error);
  }
};

const utilitiesSlice = createSlice({
  name: "utilities",
  initialState: initialState,
  reducers: {
    reset_utilitiesSlice: () => _.cloneDeep(initialState),
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openPopup: (state, action) => {
      const payload = action.payload;
      state.popup = {
        isDisplayed: true,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        buttonLabel: payload.buttonLabel,
      };
    },
    closePopup: (state) => {
      state.popup.isDisplayed = false;
    },
    openConfirmationPopup: (state, action) => {
      const payload = action.payload;
      state.confirmationPopup = {
        isDisplayed: true,
        actionName: payload.actionName,
        actionMessage: payload.actionMessage,
        question: payload.question,
        buttons: payload.buttons,
      };
    },
    closeConfirmationPopup: (state) => {
      state.confirmationPopup.isDisplayed = false;
    },
    addNotification: (state, action) => {
      const { content, notificationType, playSound = false } = action.payload;
      const notificationToAdd = NotificationCenterService.generateNotification({
        type: notificationType,
        content,
        read: false,
      });

      state.notifications.hasNewNotification = true;
      state.notifications.notificationsList.unshift(notificationToAdd);

      if (playSound) {
        playNotificationSound();
      }
    },
    removeNotification: (state, action) => {
      state.notifications.notificationsList =
        state.notifications.notificationsList.filter(
          (notification) => notification.id !== action.payload
        );
    },

    setNotificationByIndex: (state, action) => {
      const { index, notification } = action.payload;
      state.notifications.notificationsList[index] = notification;
    },
    setNotificationRead: (state, action) => {
      state.notifications.hasNewNotification = action.payload;
      state.notifications.notificationsList.forEach((n) => {
        n.read = true;
      });
    },
    showToastsWithoutSound: (state, action) => {
      state.toast.list = action.payload.map((p: any) => ({
        id: uuidv4(),
        ...p,
      }));
    },
    showToasts: (state, action) => {
      state.toast.list = action.payload.map((p: any) => ({
        id: uuidv4(),
        ...p,
      }));
      playNotificationSound();
    },
    clearToasts: (state) => {
      state.toast.list = [];
    },
  },
});

export const selectNotification = (state: RootState) =>
  state.utilities.notifications;
export const selectConfirmationPopup = (state: RootState) =>
  state.utilities.confirmationPopup;
export const selectLoading = (state: RootState) => state.utilities.loading;
export const selectPopup = (state: RootState) => state.utilities.popup;
export const selectToast = (state: RootState) => state.utilities.toast;

export const {
  setLoading,
  openPopup,
  closePopup,
  openConfirmationPopup,
  closeConfirmationPopup,
  addNotification,
  removeNotification,
  setNotificationByIndex,
  setNotificationRead,
  showToasts,
  showToastsWithoutSound,
  clearToasts,
  reset_utilitiesSlice,
} = utilitiesSlice.actions;

export default utilitiesSlice.reducer;
