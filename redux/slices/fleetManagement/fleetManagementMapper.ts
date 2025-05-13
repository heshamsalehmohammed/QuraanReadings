import { v4 as uuidv4 } from 'uuid';
import { DepartmentInterface, DepartmentTeamInterface, DepartmentTeamMemberCarInterface, DepartmentTeamMemberInterface } from './initialState';


const trackingColors = ['#002784', '#C20000', '#20501e', '#bf5bbc']
//const trackingColors=['#002784','#C20000']

let trackingColorsIndex = 0;

const getTrackingColor = (departmentIndex: number) => {
  if (departmentIndex == 0) {
    if (trackingColorsIndex === 0) {
      trackingColorsIndex++;
      return trackingColors[0]
    }
    if (trackingColorsIndex === 1) {
      trackingColorsIndex--;
      return trackingColors[1]
    }
  } else {
    if (trackingColorsIndex === 0) {
      trackingColorsIndex++;
      return trackingColors[2]
    }
    if (trackingColorsIndex === 1) {
      trackingColorsIndex--;
      return trackingColors[3]
    }
  }


}

export function departmentsMapper(
  departmentsResponse: any
) {
  const mappedDepartments: any = [];
  departmentsResponse.forEach((department: any, departmentIndex: number) => {
    mappedDepartments.push({
      id: department.id,
      uuid: uuidv4(),
      name: department.name,
      teams: department.teams?.map((team: any) => {
        return {
          id: team.id,
          uuid: uuidv4(),
          name: team.name,
          members: team.responsibles?.map((member: any) => {
            return {
              id: member.id,
              uuid: uuidv4(),
              name: member.name,
              cars: member.cars?.map((car: any, index: number) => {
                return {
                  id: car.id,
                  uuid: uuidv4(),
                  name: car.diverName,
                  model: car.model,
                  isTrackingRecordShown: false,
                  wasSubmitted:false,
                  trackingColor: getTrackingColor(departmentIndex),
                  properties: [
                    {
                      name: 'Driver Name',
                      value: car.diverName
                    },
                    {
                      name: 'Plate Number',
                      value: car.plateNumber
                    }
                  ]
                }
              }) ?? []
            }
          }) ?? []
        }
      }) ?? []
    })
  });
  return mappedDepartments;
}



export const getSelectedCars = (
  departments: DepartmentInterface[],
  selectedCarsKeys: string[]
) => {
  const selectedCars: any = departments.flatMap(
    (dep: DepartmentInterface) =>
      dep.teams?.flatMap(
        (team: DepartmentTeamInterface) =>
          team.members?.flatMap(
            (member: DepartmentTeamMemberInterface) =>
              member.cars?.filter((car: DepartmentTeamMemberCarInterface) => selectedCarsKeys.includes(car.uuid)) ?? []
          ) ?? []
      ) ?? []
  );
  return selectedCars;
};

export const getSelectedCarsLength = (
  departments: DepartmentInterface[],
  selectedCarsKeys: string[]
) => {
  return getSelectedCars(departments, selectedCarsKeys).length;
};




export const carsTrackingMapper = (carsTrackingResponse: any, selectedCars: any) => {

  let timeList: any = [] = [];
  let speedList: any[] = [];
  return carsTrackingResponse.data.carsTracking.map((carTracking: any, index: any) => {
    carTracking.tracking.forEach((log: any) => {
      speedList.push(parseInt(log.Speed))
      timeList.push(convertDateFormat(log.TrackTime))
    })
    const selectedCar: any = selectedCars.find((sc: any) => {
      return sc.id === Number(carTracking.carId)
    })

    return {
      ...carTracking,
      ...selectedCar,
      timeList,
      speedList
      /*  trackingColor: trackingColors[index] */
    }
  })
}


export function convertDateFormat(inputDate: string) {
  const date = new Date(inputDate);

  // Get individual components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-indexed
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds(); // Added to get seconds

  // Format the date
  const formattedDate = `${month}-${day}-${year}`;

  // Format the time with seconds
  let formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${hours >= 12 ? 'PM' : 'AM'}`;

  // Combine date and time
  const result = `${formattedDate} ${formattedTime}`;

  return result;
}