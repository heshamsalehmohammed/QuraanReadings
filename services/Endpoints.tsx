import { Method } from "axios";
import { EndPointsKeys } from "./apiRequest";
import config from "../config.json";

const Endpoints: {
  [key in EndPointsKeys | string]: { url: string; method: Method; params?: {} };
} = {
  login: {
    url: `${config.API_ENDPOINT_PREFIX}/session/api/v1/auth/user/login`,
    method: "POST",
    params: {},
  },
  logout: {
    url: `${config.API_ENDPOINT_PREFIX}/session/api/v1/auth/user/logout`,
    method: "DELETE",
    params: {},
  },
  reset_password: {
    url: `${config.API_ENDPOINT_PREFIX}/session/api/v1/auth/user/reset`,
    method: "PATCH",
    params: {},
  },
  account_details: {
    url: `${config.API_ENDPOINT_PREFIX}/session/api/v1/auth/user/detail?access_token=!access_token`,
    method: "GET",
    params: {},
  },
  getUserSettings: {
    url: `${config.API_ENDPOINT_PREFIX}/settings-api/api/v1/settings/user`,
    method: "GET",
  },
  setUserSettings: {
    url: `${config.API_ENDPOINT_PREFIX}/settings-api/api/v1/settings/user`,
    method: "PUT",
  },
};

export default Endpoints;
