import { MaterialIcons } from "@expo/vector-icons";
import { Buffer, ProofExchangeRecord } from "@aries-framework/core";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

type PresentationDoneCardProps = {
  key: string;
  id: string;
  name: string;
  proofExchangeRecord: ProofExchangeRecord;
  navigation: any;
};

const imageSource = require("../assets/degree.png");

export function PresentationDoneCard({
  name,
  id,
  navigation,
}: PresentationDoneCardProps) {
  return (
    <View style={styles.card}>
      <TouchableHighlight
        onPress={() => {
          navigation.push("Proof", {
            presentation_id: id,
            connection_id: id,
            parentRoute: "ConnectionDetails",
          });
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.exchangeIcon}>
            <FontAwesome name="exchange" size={32} />
          </View>
          <View style={styles.leftContent}>
            <Text style={styles.credentialName}>{name}</Text>
            <Text style={styles.credentialStatus}>Presented</Text>
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
  exchangeIcon: {
    marginRight: 24,
    justifyContent: "center",
    padding: 18,
    borderRadius: 32,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#808080",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
