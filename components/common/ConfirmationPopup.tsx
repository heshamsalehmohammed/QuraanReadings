import {
  closeConfirmationPopup,
  selectConfirmationPopup,
} from "@/redux/slices/utilities/utilitiesSlice";
import { Button, Card, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewProps } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmationPopupButton } from "@/redux/slices/utilities/initialState";
import ConfirmationPopupActionsHandler from "@/services/ConfirmationPopupActionsHandler";
import { useThemeColor } from "../Themed";

const Header = (props: ViewProps & { title: string }): React.ReactElement => {
  const { title, style, ...otherProps } = props;
  return (
    <View style={[styles.headerContainer, style]} {...otherProps}>
      <Text style={{ fontSize: 16, fontWeight: 800 }} status="primary">
        {title}
      </Text>
    </View>
  );
};

const Footer = (
  props: ViewProps & {
    buttons: ConfirmationPopupButton[];
  }
): React.ReactElement => {
  const { buttons, style, ...otherProps } = props;
  const dispatch = useDispatch();

  return (
    <View
      {...otherProps}
      // eslint-disable-next-line react/prop-types
      style={[styles.footerContainer, style]}
    >
      {buttons.map((button, index) => {
        const handler = ConfirmationPopupActionsHandler.get(
          button.actionHandlerType
        );
        return (
          <Button
            key={`${button.actionHandlerType}-${index}`}
            style={styles.footerControl}
            size="small"
            onPress={handler ?? (() => dispatch(closeConfirmationPopup()))}
            status={button.status}
          >
            {button.text}
          </Button>
        );
      })}
    </View>
  );
};

const ConfirmationPopup = () => {
  const backgroundColor = useThemeColor("overlayBackground");
  const dispatch = useDispatch();

  const { actionName, actionMessage, question, isDisplayed, buttons } =
    useSelector(selectConfirmationPopup);

  if (!isDisplayed) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Card
        style={styles.card}
        header={() => <Header title={actionName} />}
        footer={() => <Footer buttons={buttons} />}
        status="primary"
      >
        <Text status="primary">{actionMessage}</Text>
        <Text category="h6" style={{ marginTop: 10 }} status="primary">
          {question}
        </Text>
      </Card>
    </View>
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
    padding: 10,
  },
});

export default ConfirmationPopup;

/*   const actionHandlerKey = ConfirmationPopupActionsHandler.register(() => {
    dispatch(closeConfirmationPopup());
  });
 */

/*     dispatch(
      openConfirmationPopup({
        actionName: "Clear Meeting Point results",
        actionMessage:
          "You are about to clear all results you searched for and unsaved areas",
        question: "Are you sure you want to clear?",
        buttons: [
          {
            text: "Cancel",
            actionHandlerType: actionHandlerKey,
            status: "basic",
          },
          {
            text: "Clear",
            actionHandlerType: actionHandlerKey,
            status: "primary",
          },
        ],
      })
    ); */
