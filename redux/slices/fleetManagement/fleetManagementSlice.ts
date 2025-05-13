import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import initialState, { FleetManagementState } from "./initialState";
import { createSelector } from "@reduxjs/toolkit";
import {
  getCarsTrackingApi,
  getDepartmentsApi,
  getLiveCarsTrackingApi,
} from "./fleetManagementApi";
import {
  carsTrackingMapper,
  convertDateFormat,
  departmentsMapper,
  getSelectedCars,
  getSelectedCarsLength,
} from "./fleetManagementMapper";
import {
  handleHttpRequestPromise,
  handleImmediateHttpRequestPromise,
} from "@/services/reduxHelpers";
import { RootState } from "@/redux/store";

/* ############################################################### */
/* ############################ thunk ############################ */
/* ############################################################### */

export const fetchDepartments: any = createAsyncThunk(
  "fleetManagement/fetch_Departments",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(getDepartmentsApi()).then((result: any) => {
      if (!result.data) {
        return thunkAPI.rejectWithValue({});
      }

      return thunkAPI.fulfillWithValue({
        departments: departmentsMapper(result.data),
      });
    });
  }
);
export const fetchLiveTracking: any = createAsyncThunk(
  "fleetManagement/fetch_LiveTracking",
  async (_, thunkAPI) => {
    const currentState = thunkAPI.getState() as RootState;
    const selectedCar = currentState.fleetManagement.liveChartData;
    const requestParams: any = {
      carsIds: selectedCar.map((car: any) => car.id),
    };
    const result: any = await handleImmediateHttpRequestPromise(
      getLiveCarsTrackingApi(requestParams)
    );

    if (!result.data) {
      return thunkAPI.rejectWithValue({});
    }

    return thunkAPI.fulfillWithValue({
      selectedCar: selectedCar,
      CarLiveTracking: result.data.carsTracking,
    });
  }
);

export const fetchCarsTracking: any = createAsyncThunk(
  "fleetManagement/fetch_CarTracking",
  async ({ cars, interval }: any, thunkAPI) => {
    const currentState = thunkAPI.getState() as RootState;
    const selectedCars: any = getSelectedCars(
      currentState.fleetManagement.departments,
      currentState.fleetManagement.selectedCarsKeys
    );
    const requestParams: any = {
      carsIds: cars,
      from: interval.dateFrom,
      to: interval.dateTo,
    };
    try {
      return handleHttpRequestPromise(getCarsTrackingApi(requestParams)).then(
        (result: any) => {
          if (!result.data?.carsTracking == undefined) {
            return thunkAPI.rejectWithValue({});
          }
          return thunkAPI.fulfillWithValue({
            CarsTracking: carsTrackingMapper(result, selectedCars),
            carId: cars[0],
          });
        }
      );
    } catch {}
  }
);

/* ############################################################### */
/* ############################ slice ############################ */
/* ############################################################### */
export const fleetManagementSlice = createSlice({
  name: "fleetManagement",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },

    setDepartmentsSideBarIsOpened: (state, action) => {
      state.departmentSideBarIsOpened = action.payload;
    },
    toggleDepartmentsSideBarIsOpened: (state, action) => {
      if (state.departmentSideBarIsOpened) {
        state.carsInfoSideBarIsOpened = false;
      } else {
        const selectedCars = getSelectedCars(state.departments,state.selectedCarsKeys);
        if (selectedCars.length > 0) {
          state.carsInfoSideBarIsOpened = true;
        }
      }
      state.departmentSideBarIsOpened = !state.departmentSideBarIsOpened;
    },
    toggleCarsInfoSideBarIsOpened: (state, action) => {
      state.carsInfoSideBarIsOpened = !state.carsInfoSideBarIsOpened;
    },
    toggleCarsTrackingSideBarIsOpened: (state, action) => {
      state.carsTrackingSideBarIsOpened = !state.carsTrackingSideBarIsOpened;
    },
    setSelectedCarTracking: (state, action) => {
      if (state.isLiveData) {
        state.liveChartData = state.liveChartData.map((car) => {
          if (action.payload.id == car.id) {
            return {
              ...car,
              isTrackingRecordShown: true,
            };
          } else {
            return {
              ...car,
              isTrackingRecordShown: false,
            };
          }
        });
      } else {
        state.selectedCarTracking = state.selectedCarTracking.map(
          (car: any) => {
            if (action.payload.id == car.id) {
              return {
                ...car,
                isTrackingRecordShown: true,
              };
            } else {
              return {
                ...car,
                isTrackingRecordShown: false,
              };
            }
          }
        );
      }
    },
    setSelectedCarsKeys: (state, action) => {
      state.selectedCarsKeys = action.payload;
    },
    setTimeInterval: (state, action) => {
      state.timeInterval = action.payload;
    },
    toggleIsChartOpen: (state, _) => {
      state.isChartOpen = !state.isChartOpen;
    },
    setSelectedLiveCarId: (state, action) => {
      state.selectedLiveCarId = action.payload;
    },
    setSelectedHistoricalCarId: (state, action) => {
      state.selectedHistoricalCarId = action.payload;
    },
    setNotificationInfoIsOpen: (state, action) => {
      state.notificationInfoIsOpen = action.payload;
    },
    setIsLiveData: (state, action) => {
      state.isLiveData = action.payload;
      state.liveChartData = state.liveChartData.map((car) => {
        return {
          ...car,
          wasSubmitted: false,
          tracking: [],
          timeList: [],
          speedList: [],
          liveTracking: [],
        };
      });
      state.selectedCarTracking = state.selectedCarTracking.map((car) => {
        return {
          ...car,
          tracking: [],
          timeList: [],
          speedList: [],
          liveTracking: [],
          wasSubmitted: false,
        };
      });
      state.carsTracking = [];
      state.carsTrackingSideBarIsOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchDepartments.fulfilled,
      (state: FleetManagementState, action: any) => {
        state.departments = action.payload.departments;
        state.liveChartData = [];
        state.selectedCarTracking = [];
        state.mapViewCounter = 0;
        state.carsTrackingSideBarIsOpened = false;
        state.carsInfoSideBarIsOpened = false;
      }
    );
    builder.addCase(
      fetchCarsTracking.fulfilled,
      (state: FleetManagementState, action: any) => {
        const carIdToEdit = action.payload.carId;
        state.selectedCarTracking = state.selectedCarTracking.map(
          (car: any, index: number) => {
            if (car.id == carIdToEdit) {
              if (action.payload.CarsTracking[0]) {
                state.mapViewCounter++;
                return {
                  ...action.payload.CarsTracking[0],
                  wasSubmitted: true,
                };
              } else {
                return {
                  ...car,
                  tracking: [],
                  timeList: [],
                  speedList: [],
                  wasSubmitted: true,
                };
              }
            } else {
              return {
                ...car,
              };
            }
          }
        );

        if (state.selectedCarTracking.length > 0) {
          state.carsTrackingSideBarIsOpened = true;
        } else {
          state.carsTrackingSideBarIsOpened = false;
        }
      }
    );
    builder.addCase(
      fetchLiveTracking.fulfilled,
      (state: FleetManagementState, action: any) => {
        const { CarLiveTracking } = action.payload;

        if (CarLiveTracking.length > 0) {
          state.liveChartData.forEach((car) => {
            const responseRecord = CarLiveTracking.find(
              (c: any) => c.carId == car.id
            );
            car.wasSubmitted = true;
            if (responseRecord.tracking[0]?.Lat !== "null") {
              const newDateRecord = new Date(
                responseRecord?.tracking[0]?.TrackTime
              ).getTime();
              const lastRecordDate = new Date(
                car.tracking[car.tracking.length - 1]?.TrackTime
              ).getTime();

              if (lastRecordDate !== newDateRecord) {
                car.tracking.push(responseRecord.tracking[0]);
                car.speedList.push(
                  parseFloat(responseRecord.tracking[0].Speed)
                );
                car.timeList.push(
                  convertDateFormat(responseRecord.tracking[0].TrackTime)
                );
                car.liveTracking.push([
                  parseFloat(responseRecord.tracking[0].Lat),
                  parseFloat(responseRecord.tracking[0].Long),
                ]);
                state.mapViewCounter++;
              }
            }
          });
        }
      }
    );
  },
});
/* ############################################################### */
/* ########################### reducer ########################### */
/* ############################################################### */
export default fleetManagementSlice.reducer;

/* ############################################################### */
/* ########################### actions ########################### */
/* ############################################################### */
export const {
  setSelectedCarsKeys,
  setDepartments,
  setDepartmentsSideBarIsOpened,
  toggleDepartmentsSideBarIsOpened,
  toggleCarsInfoSideBarIsOpened,
  setTimeInterval,
  setSelectedCarTracking,
  toggleCarsTrackingSideBarIsOpened,
  toggleIsChartOpen,
  setIsLiveData,
  setSelectedHistoricalCarId,
  setSelectedLiveCarId,
  setNotificationInfoIsOpen,
} = fleetManagementSlice.actions;
/* ############################################################### */
/* ########################## selectors ########################## */
/* ############################################################### */
export const selectFleetState = (state: RootState) => state.fleetManagement;

export const selectDepartments = (state: RootState) => {
  return state.fleetManagement.departments;
};
export const selectSelectedCarsKeys = (state: RootState) => {
  return state.fleetManagement.selectedCarsKeys;
};

export const selectDepartmentsSideBarIsOpened = (state: RootState) =>
  state.fleetManagement.departmentSideBarIsOpened;

export const selectNotificationInfoIsOpen = (state: RootState) =>
  state.fleetManagement.notificationInfoIsOpen;

export const selectCarsInfoSideBarIsOpened = (state: RootState) =>
  state.fleetManagement.carsInfoSideBarIsOpened;

export const selectCarsTrackingSideBarIsOpened = (state: RootState) =>
  state.fleetManagement.carsTrackingSideBarIsOpened;

export const selectSelectedCarsTrackingOptions = (state: RootState) =>
  state.fleetManagement.selectedCarTracking;

export const selectTimeInterval = (state: RootState) =>
  state.fleetManagement.timeInterval;

export const selectIsChartOpen = (state: RootState) =>
  state.fleetManagement.isChartOpen;
export const selectIsLiveData = (state: RootState) =>
  state.fleetManagement.isLiveData;
export const selectMapViewCounter = (state: RootState) =>
  state.fleetManagement.mapViewCounter;

export const selectLiveChartData = (state: RootState) =>
  state.fleetManagement.liveChartData;
export const selectLiveTrackingData = (state: RootState) =>
  state.fleetManagement.liveChartData;

export const selectDepartmentsTreeNodes = createSelector(
  selectDepartments,
  (departments) => {
    return departments.map((department: any) => {
      return {
        key: `${department.uuid}`,
        label: department.name,
        data: "Departments Folder",
        /* icon: "pi pi-fw pi-inbox", */
        selectable: false,
        items: [
          ...(department.teams?.map((team: any) => {
            return {
              key: `${department.uuid}#${team.uuid}`,
              label: team.name,
              data: "Teams Folder",
              /* icon: "pi pi-users pi-inbox", */
              selectable: false,
              items: [
                ...(team.members?.map((member: any) => {
                  return {
                    key: `${department.uuid}#${team.uuid}#${member.uuid}`,
                    label: member.name,
                    data: "Members Folder",
                    /* icon: "pi pi-user pi-inbox", */
                    selectable: false,
                    items: [
                      ...(member.cars?.map((car: any) => {
                        return {
                          key: `${department.uuid}#${team.uuid}#${member.uuid}#${car.uuid}`,
                          label: car.model,
                          data: "Cars Folder",
                          /* icon: "pi pi-car", */
                          selectable: true,
                          expanded: car.isExpanded,
                        };
                      }) ?? []),
                    ],
                  };
                }) ?? []),
              ],
            };
          }) ?? []),
        ],
      };
    });
  }
);

export const selectSelectedCars = createSelector(
  selectDepartments,
  selectSelectedCarsKeys,
  (departments, selectedCarsKeys) => {
    return getSelectedCars(departments, selectedCarsKeys);
  }
);

export const selectSelectedCarsLength = createSelector(
  selectDepartments,
  selectSelectedCarsKeys,
  (departments, selectedCarsKeys) => {
    return getSelectedCarsLength(departments, selectedCarsKeys);
  }
);
