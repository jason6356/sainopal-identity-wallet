import { AutoAcceptCredential } from "@aries-framework/core";
import {
  useAgent,
  useConnectionById,
  useCredentialById,
} from "@aries-framework/react-hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { ContactStackParamList } from "../../navigation/ContactStack";
import {
  getCredentialFormat,
  getCredentialName,
} from "../../utils/credentials";

const defaultUserAvatar = `data:image/png;base64,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`;

const credentialImage = require("../../assets/degree.png");

export type CredentialFormatData = {
  name: string;
  value: string;
};

type Props = StackScreenProps<ContactStackParamList, "CredentialOffer">;

const CredentialOffer = ({ navigation, route }: Props) => {
  const { credential_offer_id, connection_id } = route.params;
  const credentialOffer = useCredentialById(credential_offer_id);
  const connectionInvitation = useConnectionById(connection_id);
  const agent = useAgent();
  const [loading, setIsLoading] = useState(false);
  const [credentialFormatData, setCredentialFormatData] = useState<
    CredentialFormatData[]
  >([]);
  const [credentialName, setCredentialName] = useState<string>("");

  const [modalVisible, setModalVisible] = useState(false);
  const [imageText, setImageText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Credential Offer",
    });
  });

  useEffect(() => {
    updateNameAndFormat(credential_offer_id);
  }, []);

  async function updateNameAndFormat(id: string) {
    setCredentialName(await getCredentialName(agent.agent, id));
    setCredentialFormatData(await getCredentialFormat(agent.agent, id));
  }

  function acceptOffer() {
    setIsLoading(true);
    agent.agent.credentials
      .acceptOffer({
        credentialRecordId: credential_offer_id,
        autoAcceptCredential: AutoAcceptCredential.Always,
      })
      .then((e) => {
        Alert.alert("Credential Accepted!");
      })
      .catch((e) => {
        Alert.alert("Error", e.message);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  }

  async function declineOffer() {
    setIsLoading(true);
    agent.agent.credentials
      .declineOffer(credential_offer_id)
      .then((e) => {
        Alert.alert("Credential Declined!");
      })
      .catch((e) => {
        Alert.alert("Error", e.message);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  }

  function isBase64Image(input: string): boolean {
    return input === "picture";
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <Pressable
            style={[styles.androidBackdrop, styles.backdrop]}
            onPress={() => setModalVisible(false)}
          />
          <Image source={{ uri: imageText }} width={300} height={350} />
        </View>
      </Modal>

      <View>
        <Text style={styles.title}>Do you want to accept the credential?</Text>
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Image
                style={{ width: 70, height: 70 }}
                source={{
                  uri: connectionInvitation?.imageUrl
                    ? connectionInvitation?.imageUrl
                    : defaultUserAvatar,
                }}
              />
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.connectionLabel}>
                {connectionInvitation?.theirLabel}
              </Text>
              <View>
                <Text style={styles.verifiedStatus}>
                  Contact is Verified
                  <MaterialIcons name="verified-user" size={14} color="green" />
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.credentialHeader}>
            <View style={styles.leftContent}>
              <Image
                style={{ width: 70, height: 70 }}
                source={credentialImage}
              />
            </View>
            <View style={styles.rightContent}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {credentialName}
              </Text>
            </View>
          </View>
          <View style={styles.credentialFormData}>
            {credentialFormatData.map((e, index) => (
              <View key={index} style={{ flexDirection: "row" }}>
                <View style={{ width: "50%", paddingVertical: 5 }}>
                  <Text style={styles.credentialAttribute}>{e.name}</Text>
                </View>
                <View style={{ width: "50%", paddingVertical: 5 }}>
                  {isBase64Image(e.name) ? (
                    <Text style={styles.credentialValue}>
                      <TouchableHighlight
                        onPress={() => {
                          setImageText(e.value);
                          setModalVisible(true);
                        }}
                      >
                        <Text style={{ color: "#8CB1FF" }}>
                          Click to view image
                        </Text>
                      </TouchableHighlight>
                    </Text>
                  ) : (
                    <Text style={styles.credentialValue}>{e.value}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <TouchableHighlight onPress={acceptOffer}>
              <View style={styles.acceptButton}>
                <Text style={styles.acceptText}>Accept</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={declineOffer}>
              <View style={styles.declineButton}>
                <Text style={styles.declineText}>Decline</Text>
              </View>
            </TouchableHighlight>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 30,
    padding: 20,
    lineHeight: 50,
  },
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
    flexDirection: "row",
    zIndex: 1, // Ensure content is above the overlay
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.2,
  },
  leftContent: {
    flexDirection: "row",
    paddingRight: 15,
    // borderStyle: "solid",
    // borderRightWidth: 0.5,
    // borderRightColor: "#333",
  },
  rightContent: {
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  connectionLabel: {
    textAlign: "left",
    fontSize: 18,
  },
  verifiedStatus: {
    marginTop: 10,
    fontSize: 14,
    color: "green",
  },
  notVerifiedStatus: {},
  buttonContainer: {
    width: "100%",
  },
  acceptButton: {
    backgroundColor: "#8CB1FF",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
    marginVertical: 5,
  },
  acceptText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
  declineButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "#8CB1FF",
    borderWidth: 1,
    borderStyle: "solid",
    height: 50,
    marginVertical: 5,
  },
  declineText: {
    textAlign: "center",
    color: "#8CB1FF",
    fontSize: 18,
  },
  activity: {
    ...StyleSheet.absoluteFillObject, // Make the activity indicator cover the entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure it's above other elements
  },
  credentialHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#d3d3d3",
  },
  credentialFormData: {
    flexDirection: "column",
    width: "100%",
    padding: 10,
  },
  credentialAttribute: {
    fontSize: 15,
    color: "#808080",
  },
  credentialValue: {
    fontSize: 15,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CredentialOffer;
