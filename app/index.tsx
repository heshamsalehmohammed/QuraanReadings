import { StyleSheet } from "react-native";
import { Button, Divider, Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container} level="3">
      <Text style={styles.title}>مصاحف القراءات</Text>
      {/* <Divider /> */}
      <Button
        title="مصحف شعبه - رسم حفص"
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: "/quraan-modal",
            params: { title: "مصحف شعبه - رسم حفص" },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    width: "80%",
    elevation: 5, // Shadow for Android
  },
});
