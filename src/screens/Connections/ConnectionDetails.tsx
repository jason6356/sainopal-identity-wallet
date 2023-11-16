import {
  CredentialState,
  ProofState,
  CredentialExchangeRecord,
  GetCredentialFormatDataReturn,
  CredentialFormat,
} from "@aries-framework/core";
import {
  useAgent,
  useConnectionById,
  useCredentialsByConnectionId,
  useProofsByConnectionId,
} from "@aries-framework/react-hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
} from "react-native";
import { parseSchemaFromId } from "../../utils/schema";
import Card from "../../components/Card";
import { ContactStackParamList } from "../../navigators/ContactStack";
import { StackScreenProps } from "@react-navigation/stack";
import useHideBottomTabBar from "../../hooks/useHideBottomTabBar";

const schemaIdToImageMapping = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": require("../../assets/degree.png"),
};

type Props = StackScreenProps<ContactStackParamList, "ConnectionDetails">;

const ConnectionDetails = ({ navigation, route }: Props) => {
  const { connection_id } = route.params;
  const connection = useConnectionById(connection_id);
  const credentialsOffer: CredentialExchangeRecord[] =
    useCredentialsByConnectionId(connection_id);
  const presentationOffer = useProofsByConnectionId(connection_id);
  const agent = useAgent();
  const [credentialMap, setCredentialMap] = useState(new Map());
  const hidden = useHideBottomTabBar();

  //Write a useEffect which iterate each of the credentialOffer and get the schema_id
  //Then get the schema name from the schema_id and store it in a map with the id
  //Then use the map to render the credentialOffer
  const mapCredentials = async () => {
    const newCredentialMap = new Map();

    for (const e of credentialsOffer) {
      const name = await getSchemaNameFromOfferID(e.id);
      newCredentialMap.set(e.id, name);
    }

    setCredentialMap(newCredentialMap);
  };

  useEffect(() => {
    mapCredentials();
    navigation.setOptions({
      title: connection?.theirLabel,
    });
  }, [credentialsOffer, connection_id]);

  async function getSchemaID(offerID: string) {
    try {
      const formatData: GetCredentialFormatDataReturn<CredentialFormat[]> =
        await agent.agent.credentials.getFormatData(offerID);

      if (formatData.offer) {
        const { schema_id } = formatData.offer?.indy;
        return schema_id;
      }
    } catch (e) {
      console.error("Invalid Credential Offer ID!");
    }
  }

  async function getSchemaNameFromOfferID(offerID: string) {
    const schemaID = await getSchemaID(offerID);
    const schema = parseSchemaFromId(schemaID);
    return schema.name;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {credentialsOffer
          .filter(
            (e) =>
              e.state !== CredentialState.Done &&
              e.state !== CredentialState.Declined
          )
          .map((e, index) => {
            const name = credentialMap.get(e.id);
            const imageSource =
              schemaIdToImageMapping["NypRCRGykSwKUuRBQx2b9o:2:degree:1.0"];
            return (
              <View style={styles.card} key={e.id}>
                <Image source={imageSource} style={styles.imageOverlay} />
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>Credential Offer</Text>
                  <Text style={styles.offerContent}>{name}</Text>
                </View>
                <TouchableHighlight
                  onPress={
                    () =>
                      navigation.push("CredentialOffer", {
                        credential_offer_id: e.id,
                        connection_id: e.connectionId,
                      })
                    //await acceptOffer(e.id)
                    //await storeToWallet(e.id)
                  }
                >
                  <View style={styles.openButton}>
                    <Text style={styles.openText}>Open</Text>
                  </View>
                </TouchableHighlight>
              </View>
            );
          })}
        {presentationOffer
          .filter((e) => e.state !== ProofState.Done)
          .map((e, index) => {
            const formData = credentialMap.get(e.id);
            const schemaId = formData ? formData.schema_id : "";
            const imageSource =
              schemaIdToImageMapping["NypRCRGykSwKUuRBQx2b9o:2:degree:1.0"];
            return (
              <Pressable
                key={e.id}
                onPress={
                  () =>
                    navigation.navigate("CredentialProof", {
                      presentation_id: e.id,
                      connection_id: e.connectionId,
                    })
                  //await acceptOffer(e.id)
                  //await storeToWallet(e.id)
                }
              >
                <Card
                  key={index}
                  title={e.state}
                  content={`Credential Offer\n`}
                  imageSource={imageSource} // Pass the image source as a prop
                />
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
export default ConnectionDetails;
