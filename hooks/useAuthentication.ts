import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const useIsAuthenticated = () => {
  const authState = useSelector((state :RootState) => state.auth);
  return authState?.auth && authState?.auth?.access_token;
};

export default useIsAuthenticated;
