import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useCredentialById, useAgent } from "@aries-framework/react-hooks";
import { AutoAcceptCredential, CredentialState } from "@aries-framework/core";

const CredentialOffer = ({ navigation, route }) => {
  const { credential_offer_id } = route.params;
  const credentialOffer = useCredentialById(credential_offer_id);
  const [credentialState, setCredentialState] = useState(credentialOffer.state);
  const agent = useAgent();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: credentialOffer?.state,
    });
  });

  useEffect(() => {
    console.log("hello world");
    console.log(JSON.stringify(credentialOffer));
  }, []);

  async function acceptOffer(id: any) {
    await agent.agent.credentials.acceptOffer({
      credentialRecordId: id,
      autoAcceptCredential: AutoAcceptCredential.Always,
    });
  }
  async function declineOffer(id: any) {
    await agent.agent.credentials.declineOffer(id);
  }

  async function storeToWallet(id: any) {
    agent.agent.credentials.acceptCredential({
      credentialRecordId: id,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Credential Offer</Text>
        {credentialOffer && (
          <View style={styles.cardContent}>
            <Text style={styles.schemaId}>
              Schema ID:{" "}
              {credentialOffer.metadata.get("_anoncreds/credential")?.schemaId}
            </Text>
            {credentialOffer.credentialAttributes?.map((attribute, index) => (
              <Text key={index} style={styles.attribute}>
                {attribute.name}: {attribute.value}
              </Text>
            ))}
          </View>
        )}
      </View>

      {credentialState === CredentialState.OfferReceived ? (
        <View>
          <Button
            title="Accept Offer"
            onPress={async () => {
              await acceptOffer(credential_offer_id);
              navigation.goBack();
            }}
          />
          <Button
            title="Decline Offer"
            onPress={async () => {
              await declineOffer(credential_offer_id);
              navigation.goBack();
            }}
          />
        </View>
      ) : (
        <Button
          title="Accept Credentials"
          onPress={async () => {
            await storeToWallet(credential_offer_id);
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    marginTop: 8,
  },
  schemaId: {
    fontSize: 16,
    marginBottom: 8,
  },
  attribute: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default CredentialOffer;
