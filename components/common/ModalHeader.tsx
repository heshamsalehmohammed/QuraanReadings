import { StyleSheet, TouchableOpacity } from "react-native";
import GeneralHeader from "./GeneralHeader";
import { useRouter } from "expo-router";
import { FontAwesome, Text } from "../Themed";

function ModalHeader({ title }: { title: string; }) {
  const router = useRouter();
  return (
    <GeneralHeader>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={20} style={styles.icon} />
      </TouchableOpacity>
      <Text category="h1" style={styles.title}>
        {title}
      </Text>
    </GeneralHeader>
  );
}

const styles = StyleSheet.create({
  icon: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default ModalHeader;
