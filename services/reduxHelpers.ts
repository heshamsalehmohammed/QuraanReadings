import ReduxDispatchSingleton from "./reduxDispatchSingleton";
import {
  openConfirmationPopup,
  openPopup,
  setLoading,
} from "../redux/slices/utilities/utilitiesSlice";

export function handleHttpRequestPromise(
  request: any,
  errorMessageConfig = {
    type: "openPopup",
    showForStatuses: "400,404,500,501,503",
    payload: {
      type: "danger",
      title: "Error",
      message:
        "An unexpected error occurred, please contact the administrator.",
      buttonLabel: "OK",
    },
  },
  showLoading = true,
  successMessageConfig?: any
) {
  return new Promise((resolve, reject) => {
    handleHTTPRequest(() => request, {
      handleException: reject,
      handleSuccess: resolve,
      errorMessageConfig,
      successMessageConfig,
      showLoading,
    });
  });
}

export async function handleHTTPRequest(
  executionCode: any,
  {
    handleException,
    handleSuccess,
    errorMessageConfig,
    successMessageConfig,
    showLoading,
  }: any
) {
  const dispatch = ReduxDispatchSingleton.getDispatch();
  if (showLoading) dispatch(setLoading(true));

  return new Promise((resolve, reject) => {
    executionCode()
      .then((result: any) => {
        if (false) {
          reject(result);
        } else {
          resolve(result);
        }
      })
      .catch(reject);
  })
    .then((result) => {
      if (successMessageConfig) showMessage(successMessageConfig);
      handleSuccess(result);
    })
    .catch((error) => {
      var statuses = errorMessageConfig?.showForStatuses.split(",") ?? [];
      if (
        errorMessageConfig &&
        (statuses.includes("all") ||
          statuses.includes(error.statusCode.toString()))
      )
        showMessage(errorMessageConfig);
      handleException(error);
    })
    .finally(() => {
      if (showLoading) dispatch(setLoading(false));
    });
}


// no loading dispatch
export function handleImmediateHttpRequestPromise(request: any) {
	return new Promise((resolve,reject) => {
		handleImmediateHTTPRequest(() => request,{
			handleException: reject,
			handleSuccess: resolve,
		});
	});
}

export async function handleImmediateHTTPRequest(executionCode: any,{handleException,handleSuccess}: any) {


	return new Promise((resolve,reject) => {
		executionCode()
			.then((result: any) => {
				if(false) {
					reject(result);
				} else {
					resolve(result);
				}
			})
			.catch(reject);
	})
		.then((result) => {
			handleSuccess(result);
		})
		.catch((error) => {
			handleException(error);
		})
}

export default function showMessage(messageConfig: any) {
  const dispatch = ReduxDispatchSingleton.getDispatch();
  switch (messageConfig.type) {
    case "openPopup":
    default:
      dispatch(openPopup(messageConfig.payload));
      break;
    case "openConfirmationPopup":
      dispatch(openConfirmationPopup(messageConfig.payload));
      break;
  }
}
