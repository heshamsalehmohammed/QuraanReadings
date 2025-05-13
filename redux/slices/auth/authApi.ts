import { _apirequest } from "@/services/apiRequest";
import { LoginRequest, LoginRequestType, ResetPasswordRequest } from "./initialState";


export const loginApi = async (userCredentials: LoginRequestType) => {
  let body = (new LoginRequest(userCredentials)).toObject();
  let res = _apirequest.makeRequest("login", {}, body);
  return res;
};

export const resetPasswordApi = async (
  newUserCredentials: ResetPasswordRequest
) => {
  let res = _apirequest.makeRequest("reset_password", {}, newUserCredentials);
  return res;
};

export const getUserDetailsApi = async (token: any) => {
  let res = _apirequest.makeRequest(
    "account_details",
    { access_token: token },
    {}
  );
  return res;
};

export const logoutApi = async (token: any) => {
  let res = _apirequest.makeRequest("logout", {}, { access_token: token });
  return res;
};
