import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ProofExchangeRecord } from "@aries-framework/core";

type PresentationOfferProps = {
  key: string;
  proofExchangeRecord: ProofExchangeRecord;
  name: string;
  navigation: any;
};

const imageSource = require("../assets/degree.png");

export function PresentationOfferCard({
  name,
  proofExchangeRecord: e,
  navigation,
}: PresentationOfferProps) {
  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <FontAwesome name="exchange" size={32} />
        </View>
        <View>
          <Text style={styles.title}>Information Request</Text>
          <Text style={styles.presentationName}>{name}</Text>
        </View>
      </View>
      <TouchableHighlight
        onPress={() =>
          navigation.push("CredentialProof", {
            presentation_id: e.id,
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
    flexDirection: "row",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: "#808080",
  },
  leftContent: {
    marginRight: 24,
    justifyContent: "center",
    padding: 14,
    borderRadius: 34,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#808080",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  presentationName: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
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
