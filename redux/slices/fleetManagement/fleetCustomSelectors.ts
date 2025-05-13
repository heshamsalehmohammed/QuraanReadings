import { createSelector } from "@reduxjs/toolkit";
import { selectFleetState } from "./fleetManagementSlice";

export const selectCurrentTracking = createSelector(
  selectFleetState,
  (fleetState) => {
    if (fleetState.isLiveData) {
      return fleetState.liveChartData;
    } else {
      return fleetState.selectedCarTracking;
    }
  }
);
export const selectCurrentCar = createSelector(
  selectFleetState,
  (fleetState) => {
    if (fleetState.isLiveData) {
      const car = fleetState.liveChartData.find(
        (car: any) => car.id == fleetState.selectedLiveCarId
      );
      if (car) {
        return car;
      } else if (fleetState.liveChartData.length > 0) {
        return fleetState.liveChartData[0];
      }
    } else {
      const car = fleetState.selectedCarTracking.find(
        (car: any) => car.id == fleetState.selectedHistoricalCarId
      );
      if (car) {
        return car;
      } else if (fleetState.selectedCarTracking.length > 0) {
        return fleetState.selectedCarTracking[0];
      }
    }
  }
);

export const selectSubmittedTracking = createSelector(
  selectFleetState,
  (fleetState) => {
    if (fleetState.isLiveData) {
      return fleetState.liveChartData.map((c: any) => c.wasSubmitted);
    } else {
      return fleetState.selectedCarTracking.map((c: any) => c.wasSubmitted);
    }
  }
);
