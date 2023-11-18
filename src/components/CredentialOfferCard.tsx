import { CredentialExchangeRecord } from "@aries-framework/core";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

type CredentialOfferCardProps = {
  key: number;
  credentialExchangeRecord: CredentialExchangeRecord;
  name: string;
  navigation: any;
};

const imageSource = require("../assets/degree.png");

export function CredentialOfferCard({
  key,
  credentialExchangeRecord: e,
  name,
  navigation,
}: CredentialOfferCardProps) {
  return (
    <View style={styles.card} key={key}>
      <Image source={imageSource} style={styles.imageOverlay} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Credential Offer</Text>
        <Text style={styles.offerContent}>{name}</Text>
      </View>
      <TouchableHighlight
        onPress={() =>
          navigation.push("CredentialOffer", {
            credential_offer_id: e.id,
            connection_id: e.connectionId,
          })
        }
      >
        <View style={styles.openButton}>
          <Text style={styles.openText}>Open</Text>
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
  },
  title: {
    fontSize: 18,
    color: "#808080",
  },
  offerContent: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  imageOverlay: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 20,
    width: 300,
    height: 250,
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
