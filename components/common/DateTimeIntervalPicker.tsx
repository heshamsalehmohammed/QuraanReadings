import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { Input, InputProps } from "@ui-kitten/components";
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps,
} from "react-native-modal-datetime-picker";

const DateTimePicker = (
  props: Partial<InputProps & ReactNativeModalDateTimePickerProps>
) => {
  const { label, style } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const inputRef = useRef<any>(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", "");
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  return (
    <>
      <Input
        ref={inputRef}
        autoCapitalize="none"
        placeholder="yyyy-MM-dd hh:mm:ss aa"
        value={selectedDate}
        onFocus={() => {
          // Immediately blur the input to prevent the keyboard from opening
          inputRef.current?.blur();
          showDatePicker();
        }}
        label={label}
        showSoftInputOnFocus={false}
        caretHidden={true}
        style={style}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default function DateTimeIntervalPicker() {
  return (
    <>
      <DateTimePicker label="Date From" style={{ marginBottom: 5 }} />
      <DateTimePicker label="Date To" style={{ marginBottom: 5 }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
