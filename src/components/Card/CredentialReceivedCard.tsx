import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { credentialImage } from "@constants/index";

type CredentialReceivedCardProps = {
  key: string;
  id: string;
  name: string;
  navigation: any;
};

export function CredentialReceivedCard({
  name,
  id,
  navigation,
}: CredentialReceivedCardProps) {
  return (
    <View style={styles.card}>
      <Image source={credentialImage} style={styles.imageOverlay} />
      <TouchableHighlight
        onPress={() => {
          console.log("testing");
          navigation.push("Credential", {
            credential_offer_id: id,
            parentRoute: "Connection",
          });
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.credentialName}>{name}</Text>
            <Text style={styles.credentialStatus}>added</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={36}
            color="#555"
            style={styles.rightContent}
          />
        </View>
      </TouchableHighlight>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative", // Required for positioning the overlay
  },
  contentContainer: {
    zIndex: 1, // Ensure content is above the overlay
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    color: "#808080",
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    verticalAlign: "middle",
  },
  credentialName: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  credentialStatus: {
    fontSize: 16,
    marginBottom: 8,
    color: "#ffffff",
    alignSelf: "flex-start",
    padding: 8,
    backgroundColor: "green",
    borderRadius: 16,
  },
  imageOverlay: {
    alignSelf: "auto",
    position: "relative",
    marginBottom: 20,
    width: 70,
    height: 70,
  },
  openButton: {
    backgroundColor: "#8CB1FF",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
    marginVertical: 5,
  },
  openText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});
