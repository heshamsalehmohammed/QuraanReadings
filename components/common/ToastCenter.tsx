import {
  clearToasts,
  closePopup,
  selectLoading,
  selectPopup,
  selectToast,
} from "@/redux/slices/utilities/utilitiesSlice";
import { Button, Card, Modal, Text } from "@ui-kitten/components";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, useThemeColor } from "../Themed";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastItemInterface } from "@/redux/slices/utilities/initialState";
import _ from "lodash";

interface ToastItemProps {
  status: string;
  message: string;
  onClose: (event: GestureResponderEvent) => void;
}

const ToastItem = (props: ToastItemProps) => {
  const { status, message, onClose } = props;
  const borderColor = useThemeColor(`color-${status}-500`);
  const backgroundColor = useThemeColor(`color-${status}-100`);
  const iconColor = useThemeColor(`color-primary-500`);

  return (
    <Card
      style={[
        styles.card,
        { borderLeftWidth: 5, borderColor, backgroundColor },
      ]}
    >
      <View style={styles.cardContainer}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text status="primary">{message}</Text>
        </View>
        <Pressable onPress={onClose}>
          <FontAwesome name="close" size={18} style={{ color: iconColor }} />
        </Pressable>
      </View>
    </Card>
  );
};

const ToastCenter = () => {
  const dispatch = useDispatch();
  const { list } = useSelector(selectToast);
  const [localToastList, setLocalToastList] = useState<ToastItemInterface[]>(
    []
  );

  // Ref to store active timers for cleanup
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Function to remove a toast by id
  const removeToast = useCallback((id: string) => {
    setLocalToastList((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    );

    // Clear the associated timer if it exists
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      const newToasts = _.cloneDeep(list);

      // Add new toasts to the local state
      setLocalToastList((prevToasts) => [...prevToasts, ...newToasts]);

      // Clear the toasts from Redux store
      dispatch(clearToasts());

      // Set up timers for automatic removal based on 'life'
      newToasts.forEach((toast) => {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.life ?? 5000);

        // Store the timer so it can be cleared if needed
        timersRef.current[toast.id] = timer;
      });
    }
  }, [list, dispatch, removeToast]);

  // Clean up timers when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      {localToastList.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 999, // Ensure it's above everything
  },
  card: {
    flex: 1,
    borderWidth: 0,
    width: "80%",
    marginLeft: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2, // Only apply shadow below
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2, // Apply shadow for Android
      },
    }),
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default ToastCenter;




/* 
    dispatch(
      showToasts([
        {
          status: "danger",
          message: new Date().toISOString(),
        },
        {
          status: "danger",
          message: new Date().toISOString(),
        },
      ])
    );
*/