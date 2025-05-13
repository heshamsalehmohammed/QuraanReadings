import {
  closePopup,
  selectPopup,
} from "@/redux/slices/utilities/utilitiesSlice";
import { Button, Card, Text } from "@ui-kitten/components";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatusText, useThemeColor } from "../Themed";

const Header = (
  props: ViewProps & { title: string; status: string }
): React.ReactElement => {
  const { title, style, status, ...otherProps } = props;
  return (
    <View style={[styles.headerContainer, style]} {...otherProps}>
      <StatusText
        status={status}
        style={{ padding: 5 }}
        textStyle={{ fontWeight: 900 }}
      >
        {title}
      </StatusText>
    </View>
  );
};

const Footer = (
  props: ViewProps & { buttonLabel: string; status: string }
): React.ReactElement => {
  const { buttonLabel, style, status, ...otherProps } = props;
  const dispatch = useDispatch();
  return (
    <View
      {...otherProps}
      // eslint-disable-next-line react/prop-types
      style={[styles.footerContainer, style]}
    >
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => dispatch(closePopup())}
        status={status}
      >
        {buttonLabel}
      </Button>
    </View>
  );
};

const MessagePopup = () => {
  const backgroundColor = useThemeColor("overlayBackground");
  const dispatch = useDispatch();

  const { isDisplayed, type, title, message, buttonLabel } =
    useSelector(selectPopup);

  if (!isDisplayed) return null;

  return (
    <Pressable
      style={[styles.container, { backgroundColor }]}
      onPress={() => dispatch(closePopup())}
    >
      <Card
        style={styles.card}
        header={() => <Header title={title} status={type} />}
        footer={() => <Footer buttonLabel={buttonLabel} status={type} />}
        status={type}
      >
        <Text status="primary">{message}</Text>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensure it's above everything
  },
  card: {
    borderWidth: 0,
    width: "80%",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 2,
  },
  footerControl: {
    marginHorizontal: 2,
  },
  headerContainer: {
    paddingLeft: 10,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default MessagePopup;

/*     dispatch(
      openPopup({
        type:"danger",
        title: "Clear Meeting Point results",
        message:
          "You are about to clear all results you searched for and unsaved areas",
        buttonLabel: "Yes Please!",
        
      })
    ); */
