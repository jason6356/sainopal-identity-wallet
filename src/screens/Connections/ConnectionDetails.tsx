import { CredentialState, ProofState } from "@aries-framework/core";
import {
  useAgent,
  useConnectionById,
  useCredentialsByConnectionId,
  useProofsByConnectionId,
} from "@aries-framework/react-hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Card from "../../components/Card";

const schemaIdToImageMapping = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": require("../../assets/degree.png"),
};

const ConnectionDetails = ({ navigation, route }) => {
  const { connection_id } = route.params;
  const connection = useConnectionById(connection_id);
  const credentialsOffer = useCredentialsByConnectionId(connection_id);
  const presentationOffer = useProofsByConnectionId(connection_id);
  const agent = useAgent();
  const [credentialMap, setCredentialMap] = useState(new Map());

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connection?.theirLabel,
      tabBarVisible: false,
    });
  }, [navigation, connection_id]);

  useEffect(() => {
    const fetchCredentialData = async () => {
      const newDataMap = new Map();
      for (const credential of credentialsOffer) {
        const data = await getFormData(credential.id);
        newDataMap.set(credential.id, data);
      }
      setCredentialMap(newDataMap);
    };
    fetchCredentialData();
  }, [connection_id]);

  async function getFormData(id: any) {
    const formatData = await agent.agent.credentials.getFormatData(id);
    const { offer, offerAttributes } = formatData;
    const offerData = offer?.indy;
    const { cred_def_id, schema_id } = offerData;

    console.log(`Credential Definiton : ${cred_def_id}`);
    console.log(`Schema ID : ${schema_id}`);
    console.log(offerAttributes);
    //console.log(offerData)
    return { schema_id, cred_def_id, offerAttributes };
  }

  return (
    <View>
      <ScrollView>
        {credentialsOffer
          .filter((e) => e.state !== CredentialState.Done)
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
                    navigation.navigate("CredentialOffer", {
                      credential_offer_id: e.id,
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

export default ConnectionDetails;
