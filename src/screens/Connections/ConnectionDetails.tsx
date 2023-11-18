import {
  CredentialExchangeRecord,
  CredentialState,
  ProofState,
} from "@aries-framework/core";
import {
  useAgent,
  useConnectionById,
  useCredentialsByConnectionId,
  useProofsByConnectionId,
} from "@aries-framework/react-hooks";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Card from "../../components/Card";
import { CredentialOfferCard } from "../../components/CredentialOfferCard";
import useHideBottomTabBar from "../../hooks/useHideBottomTabBar";
import { ContactStackParamList } from "../../navigators/ContactStack";
import { getSchemaNameFromOfferID } from "../../utils/schema";
import { CredentialReceivedCard } from "../../components/CredentialReceivedCard";

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

  const mapCredentials = async () => {
    const newCredentialMap = new Map();

    for (const e of credentialsOffer) {
      const name = await getSchemaNameFromOfferID(agent.agent, e.id);
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

  return (
    <View style={styles.container}>
      <ScrollView>
        {credentialsOffer
          .filter((e) => e.state === CredentialState.OfferReceived)
          .map((e, index) => {
            return (
              <CredentialOfferCard
                key={index}
                credentialExchangeRecord={e}
                name={credentialMap.get(e.id)}
                navigation={navigation}
              />
            );
          })}
        {credentialsOffer
          .filter((e) => e.state === CredentialState.Done)
          .map((e, index) => {
            return (
              <CredentialReceivedCard
                key={e.id.toUpperCase()}
                id={e.id}
                name={credentialMap.get(e.id)}
                navigation={navigation}
              />
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
                onPress={() =>
                  navigation.navigate("CredentialProof", {
                    presentation_id: e.id,
                  })
                }
              >
                <Card
                  key={index}
                  title={e.state}
                  content={`Credential Offer\n`}
                  imageSource={imageSource}
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
});
export default ConnectionDetails;
