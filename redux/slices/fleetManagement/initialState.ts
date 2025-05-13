export type DepartmentTeamMemberCarInterface = {
  uuid: string;
  model: string;
};

export type DepartmentTeamMemberInterface = {
  uuid: string;
  name: string;
  cars?: DepartmentTeamMemberCarInterface[];
};

export type DepartmentTeamInterface = {
  uuid: string;
  name: string;
  members?: DepartmentTeamMemberInterface[];
};

export type DepartmentInterface = {
  uuid: string;
  name: string;
  teams?: DepartmentTeamInterface[];
};

export type FleetManagementState = {
  selectedCarsKeys: string[];
  departments: DepartmentInterface[];
  departmentSideBarIsOpened: boolean;
  carsInfoSideBarIsOpened: boolean;
  carsTrackingSideBarIsOpened: boolean;
  notificationInfoIsOpen: boolean;
  timeInterval: { dateFrom: any; dateTo: any };
  carsTracking: any[];
  selectedCarTracking: any[];
  isChartOpen: boolean;
  isLiveData: boolean;
  liveChartData: any[];
  selectedLiveCarId: number;
  selectedHistoricalCarId: number;
  mapViewCounter: number;
};

const initialState: FleetManagementState = {
  selectedCarsKeys:[],
  departments: [
    {
      uuid: "dept-1",
      name: "Department 1",
      teams: [
        {
          uuid: "team-1",
          name: "Team 1",
          members: [
            {
              uuid: "member-1",
              name: "Member 1",
              cars: [
                {
                  uuid: "car-1",
                  model: "Toyota Corolla",
                },
                {
                  uuid: "car-2",
                  model: "Honda Civic",
                },
              ],
            },
            {
              uuid: "member-2",
              name: "Member 2",
              cars: [],
            },
          ],
        },
        {
          uuid: "team-2",
          name: "Team 2",
          members: [],
        },
      ],
    },
    {
      uuid: "dept-2",
      name: "Department 2",
      teams: [
        {
          uuid: "team-3",
          name: "Team 3",
          members: [
            {
              uuid: "member-3",
              name: "Member 3",
              cars: [
                {
                  uuid: "car-3",
                  model: "Ford Mustang",
                },
              ],
            },
          ],
        },
        {
          uuid: "team-4",
          name: "Team 4",
          members: [
            {
              uuid: "member-4",
              name: "Member 4",
              cars: [],
            },
          ],
        },
      ],
    },
  ],
  departmentSideBarIsOpened: true,
  carsInfoSideBarIsOpened: false,
  carsTrackingSideBarIsOpened: false,
  notificationInfoIsOpen: false,
  timeInterval: { dateFrom: "", dateTo: "" },
  carsTracking: [],
  selectedCarTracking: [],
  isChartOpen: false,
  isLiveData: true,
  selectedLiveCarId: 0,
  selectedHistoricalCarId: 0,
  mapViewCounter: 0,
  liveChartData: [],
};

export default initialState;
