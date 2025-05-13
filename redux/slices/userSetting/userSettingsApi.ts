import { _apirequest } from "@/services/apiRequest";


export const getUserSettings = async () => {
  let res = _apirequest.makeRequest('getUserSettings', {}, {})
  return res
};

export const saveUserSettingsApi = async (userSettings: { themeSelection:string|null, fontSize:string|null, userId:string|null }) => {
  const { themeSelection, fontSize, userId } = userSettings;
  let res = _apirequest.makeRequest('setUserSettings', {}, {
    themeSelection,
    fontSize,
    userId
  })
  return res
};