import { StyleSheet, ImageBackground, Keyboard, Dimensions, ScrollView } from "react-native";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  StatusText,
  SubmitButton,
  Text,
  View,
} from "@/components/Themed";
import AppLogoDark from "../assets/images/app-logo-dark.svg";
import AppLogoLight from "../assets/images/app-logo-light.svg";
import { useColorScheme } from "react-native";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "expo-router";
import { ErrorModel } from "@/services/axios";
import { BackendErrorTypes } from "@/constants/backendErrorContract";

import Page1 from "../assets/pages/shoba/page1.svg";
import Page2 from "../assets/pages/shoba/page2.svg";
import Page3 from "../assets/pages/shoba/page3.svg";
import Page4 from "../assets/pages/shoba/page4.svg";
import Page5 from "../assets/pages/shoba/page5.svg";
import Page6 from "../assets/pages/shoba/page6.svg";
import Page7 from "../assets/pages/shoba/page7.svg";
import Page8 from "../assets/pages/shoba/page8.svg";


const windowWidth = Dimensions.get("window").width;


export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const theme = useColorScheme() ?? "light";

const pages = [Page1, Page2,Page3,Page4,Page5,Page6,Page7,Page8]; // Add all your page components here

return (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
    {pages.map((SvgPage, index) => (
      <View key={index} style={{ width: windowWidth, height: 800 }}>
        <SvgPage width="100%" height="100%" />
      </View>
    ))}
  </ScrollView>
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
