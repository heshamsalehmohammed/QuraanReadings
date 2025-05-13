import { AxiosRequestConfig, ResponseType } from "axios";
import { axiosInstance } from "./axios";
import Endpoints from "./Endpoints";
import { getItemFromStorage } from "./storage";

export type EndPointsKeys =
  | "login"
  | "userDetails"
  | "account_details"
  | "getUserSettings"
  | "setUserSettings"
  | "logout";

// General controller for sending api request

class ApiRequest {
  async makeRequest(
    endPointkey: EndPointsKeys | string,
    params: {},
    body: Object
  ) {
    let endpoint = Endpoints[endPointkey];
    let request = await this.createRequest(endpoint, params, body, endPointkey);
    let response:any;
    try {
      /* response = await axiosInstance(request); */
      // Simulate endpoint call with promise and setTimeout
      response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
        data: {
          access_token: "9dAelQFiPpUuP8iCMO9V16VdxZWD0KFBXi1wA7a8",
          expires_in: 3599,
          scope: "1,4,5,7,8,9,10",
          refresh_token: "ukZBL3tKDDjS21vQdY7RUOmnwFfvWgMi9SdzqBZv",
          token_type: "Bearer",
        },
        status: 200,
        headers: {},
          });
        }, 2000);
      });
      
      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (err) {
      throw err;
    }
  }

  async createRequest(endpoint: any, params: any, body: Object, endPointkey: string) {
    let url = endpoint.url;
    url = params ? this.addRouteParams(url, params) : url;
    let type: ResponseType = endPointkey === "reportById" ? "blob" : "json";
    let token = await getItemFromStorage("token");
    let Authorization =
      token && endPointkey !== "login" && endPointkey !== "logout"
        ? { Authorization: token }
        : null;
    let request: AxiosRequestConfig = {
      url: url,
      method: endpoint.method,
      responseType: type,
      data: body,
      headers: {
        ...Authorization,
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    return request;
  }

  addRouteParams(url: string, params: any) {
    let keys = url.match(/!\w+/gi);
    if (keys) {
      keys.forEach((key) => {
        let keyName = key.replace("!", "");
        url = url.replace(key, params[keyName]);
      });
    }
    return url;
  }
}

export const _apirequest = new ApiRequest();
