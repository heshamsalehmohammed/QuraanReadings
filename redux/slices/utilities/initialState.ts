import { GestureResponderEvent } from "react-native";

interface Popup {
  isDisplayed: boolean;
  type: string;
  title: string;
  message: string;
  buttonLabel: string;
}

export interface ConfirmationPopupButton {
  text: string;
  actionHandlerType: string;
  status: string;
}
    
    
interface ConfirmationPopup {
  isDisplayed: boolean;
  actionName: string;
  actionMessage: string;
  question: string;
  buttons: ConfirmationPopupButton[];
}

export type TNotificationType = 'alarm' | 'export';


export interface INotificationItem {
  content: any;
  read: boolean;
  type: TNotificationType;
  id:string
}


export interface NotificationCenter {
  notificationsList: INotificationItem[],
  hasNewNotification: boolean
}

export interface ToastItemInterface {
  id:string;
  status: "success" | "info" | "warning" | "danger";
  message: string;
  life?: number;
}
interface InitialState {
  loading: boolean;
  popup: Popup;
  confirmationPopup: ConfirmationPopup;
  notifications: NotificationCenter;
  toast: {
    list: ToastItemInterface[];
  };
}

export const initialState: InitialState = {
  loading: false,
  popup: {
    isDisplayed: false,
    type: '',
    title: '',
    message: '',
    buttonLabel: ''
  },
  confirmationPopup: {
    isDisplayed: false,
    actionName: '',
    actionMessage: '',
    question: "",
    buttons: [],
  },
  notifications: {
    notificationsList: [],
    hasNewNotification: false
  },
  toast: {
    list: []
  },
};
