import { _apirequest } from "@/services/apiRequest";

export const getDepartmentsApi = async () => {
  const result = await _apirequest
    .makeRequest('FleetDepartments', {}, {});
  return result;
};

export const getCarsTrackingApi = async (body:any) => {
    const result = await _apirequest
      .makeRequest('CarsTracking', {}, body);

  return result;

};

export const getLiveCarsTrackingApi = async (body: any) => {
  const result = await _apirequest.makeRequest('CarsTracking', {}, body);
  return result;
};