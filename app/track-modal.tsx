import { StyleSheet } from "react-native";
import { Button, View } from "@/components/Themed";
import TreeSelection from "@/components/common/TreeSelection";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDepartmentsTreeNodes,
  setSelectedCarsKeys,
} from "@/redux/slices/fleetManagement/fleetManagementSlice";
import DateTimeIntervalPicker from "@/components/common/DateTimeIntervalPicker";

export default function TrackModal() {
  const departmentsTreeNodes = useSelector(selectDepartmentsTreeNodes);
  const dispatch = useDispatch();

  const handleSubmit = () => {
  };

  return (
    <View style={styles.container} level="3">
      <TreeSelection
        data={departmentsTreeNodes}
        onSelectionChange={(selectedCarsKeys) =>
          dispatch(setSelectedCarsKeys(selectedCarsKeys))
        }
        style={styles.treeContainer}
      />
      <View style={styles.buttonsContainer}>
        <DateTimeIntervalPicker />
        <Button
          style={styles.button}
          title="Track Selected Cars"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  treeContainer: {
    flex: 1,
    paddingHorizontal: 25,
    width: "100%",
  },
  buttonsContainer: {
    paddingTop: 10,
    width: "100%",
    paddingHorizontal: 30,
  },
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
  },
});
