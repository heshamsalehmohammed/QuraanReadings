import axios, { AxiosError } from "axios";

import ReduxDispatchSingleton from "@/services/reduxDispatchSingleton";
import { logoutUserAutomatically } from "@/redux/slices/auth/authSlice";

export enum ISuccessStatusCode {
  SUCCESS = 200,
  CREATED = 201,
}

export enum IErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum IErrorMessage {
  BAD_REQUEST = "Bad request",
  UNAUTHORIZED = "Unauthorized request",
  NOT_FOUND = "Something went wrong, please try again later.",
  CONFLICT = "already exists",
  INTERNAL_SERVER_ERROR = "Something went wrong, please try again later.",
}

export const ErrorMessageMapper: { [key in IErrorStatusCode]: IErrorMessage } =
  {
    "400": IErrorMessage.BAD_REQUEST,
    "401": IErrorMessage.UNAUTHORIZED,
    "404": IErrorMessage.NOT_FOUND,
    "409": IErrorMessage.CONFLICT,
    "500": IErrorMessage.INTERNAL_SERVER_ERROR,
  };

export type IHTTPStatusCode = ISuccessStatusCode | IErrorStatusCode;

export enum messagesTypes {
  error = "error",
  info = "info",
  warning = "warning",
  success = "success",
}

export interface IError {
  isError: boolean;
  errorMsg: string;
  type: messagesTypes;
}

export interface IErrorDebugInfo {
  msgHistory: string[];
  stackTrace: string;
}

export interface IErrorResponse {
  errMsg: string;
  httpErrCode: IErrorStatusCode;
  debugInfo: IErrorDebugInfo;
}

export class ErrorModel {
  errResponse: IErrorResponse;
  statusCode: IErrorStatusCode;
  errMessage: IErrorMessage;

  constructor(err: IErrorResponse) {
    const status = err.httpErrCode;
    this.errResponse = err;
    this.statusCode = status;
    this.errMessage = ErrorMessageMapper[status] || "Something went wrong";
  }
  toObject() {
    return {
      errResponse: this.errResponse,
      statusCode: this.statusCode,
      errMessage: this.errMessage,
    };
  }
}

const defaultErrResponse = (status: IErrorStatusCode): IErrorResponse => {
  return {
    errMsg: ErrorMessageMapper[status],
    httpErrCode: status,
    debugInfo: {
      msgHistory: [],
      stackTrace: "",
    },
  };
};

interface Error extends AxiosError {
  msg: string;
  type: messagesTypes.error;
  data?: IErrorResponse;
}

const axiosInstance = axios.create();

function resInterceptor(res: any) {
  return res;
}

const errInterceptor = (err: Error) => {
  /* this code logs out the user if any endpoint returned a 401 unauthorize response 
       meaning that the session is expired 	
 	*/
  const dispatch = ReduxDispatchSingleton.getDispatch();

  if (err?.response?.status === 401) {
    dispatch(logoutUserAutomatically());
  }

  const responseData: any = err.response?.data;

  const errResponse =
    responseData && responseData.httpErrCode
      ? new ErrorModel(responseData as IErrorResponse).toObject()
      : new ErrorModel(
          defaultErrResponse(err?.response?.status || 500)
        ).toObject();

  throw errResponse;
};

axiosInstance.interceptors.response.use(resInterceptor, errInterceptor);

export { axiosInstance };
