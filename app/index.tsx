import { StyleSheet, ImageBackground, Keyboard, Platform, Dimensions } from "react-native";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  StatusText,
  SubmitButton,
  Text,
  TextInput,View
} from "@/components/Themed";
import AppLogoDark from "../assets/images/app-logo-dark.svg";
import AppLogoLight from "../assets/images/app-logo-light.svg";
import { useColorScheme } from "react-native";
import { useState } from "react";
import { Button } from "@ui-kitten/components";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "expo-router";
import { ErrorModel } from "@/services/axios";
import { BackendErrorTypes } from "@/constants/backendErrorContract";
import { closeConfirmationPopup, openConfirmationPopup, openPopup } from "@/redux/slices/utilities/utilitiesSlice";
import ConfirmationPopupActionsHandler from "@/services/ConfirmationPopupActionsHandler";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimeIntervalPicker from "@/components/common/DateTimeIntervalPicker";
import SlideUpModal from "@/components/screens/Modals/SlideUpModal";


const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().min(4).label("Password"),
});



export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const theme = useColorScheme() ?? "light";

  const [backendError, setBackendError] = useState<string | undefined>(
    undefined
  );
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true); 

  const handleLogin = (values: any, formikAPI: any) => {
    Keyboard.dismiss()
    dispatch(loginUser(values))
      .then(unwrapResult)
      .then((res: any) => {
        const scopes = res.result.scope.split(",");
        const pagesPermissions = ["5", "2", "3", "4", "22", "21"];
        router.replace("/home");
      })
      .catch((err: ErrorModel) => {
        let [errKey, errCount] = err.errResponse.debugInfo.msgHistory;
        if (errKey === BackendErrorTypes.RESET_PASSWORD) {
        } else {
          setBackendError(
            BackendErrorTypes[errKey as keyof typeof BackendErrorTypes]
          );
        }
      });
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/Login_Bg.png")} // Replace with your image path
        resizeMode="contain"
        style={styles.background}
      />
      <View style={styles.loginFormContainer}>
        {theme === "light" ? (
          <AppLogoDark height={64} width={200} />
        ) : (
          <AppLogoLight height={64} width={200} />
        )}
        <StatusText
          showIcon
          status="info"
          style={{
            marginBottom: 15,
          }}
        >
          If you have problems logging in, please contact your administrator .
        </StatusText>
        <AppForm
          initialValues={{ username: "", password: "" }}
          onSubmit={handleLogin}
          handleChange={() => {
            setBackendError(undefined);
          }}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={backendError} style={{ fontSize: 14 }} />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="user"
            keyboardType="email-address"
            label={"Username"}
            name="username"
            placeholder="Username"
            textContentType="emailAddress"
            style={{ marginBottom: 10 }}
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            rightIcon="eye"
            leftIcon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            textContentType="password"
            label={"Password"}
            style={{ marginBottom: 15 }}
            rightIconClickHandler={() => {
              setSecureTextEntry((prev) => !prev);
            }}
          />

          <SubmitButton style={{ width: "100%" }} title="Login" />
        </AppForm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    position: "absolute",
    bottom: -175,
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    alignItems: "flex-start", // Content alignment
    justifyContent: "center", // Vertical alignment
  },
  loginFormContainer: {
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
