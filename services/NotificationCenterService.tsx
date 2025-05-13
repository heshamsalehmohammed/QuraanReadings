import React from 'react';
import { ReactElement } from 'react';
import { v4 as uuidv4 } from "uuid";


export type TNotificationType = "alarm" | "export";

export interface INotificationItem {
  content: any;
  read: boolean;
  type: TNotificationType;
  id: string;
}

export const NotificationCenterService = {
  generateNotification: (notificationObj: {
    type: TNotificationType;
    content: string | ReactElement;
    read: boolean;
    // Removed 'id' as it's generated internally
  }): INotificationItem => {
    const { type, content, read } = notificationObj;

    const notification: INotificationItem = {
      content,
      id: uuidv4(),
      read,
      type,
    };
    return notification;
  },
};