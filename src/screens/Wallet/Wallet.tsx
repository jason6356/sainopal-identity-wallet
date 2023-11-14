import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useCredentialByState } from "@aries-framework/react-hooks";
import { CredentialState } from "@aries-framework/core";
import { StackScreenProps } from "@react-navigation/stack";
import { WalletStackParamList } from "../../navigators/WalletStack";

const schemaIdToImageMapping = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": require("../../assets/degree.png"),
};

const schemaIdToCredentialName = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": "Degree Certificate",
};

type Props = StackScreenProps<WalletStackParamList, "Wallet", "Credential">;

const Wallet = ({ navigation, route }: Props) => {
  const credentials = useCredentialByState(CredentialState.Done);

  useLayoutEffect(() => {
    console.log(JSON.stringify(credentials));
  }, []);

  return (
    <View style={styles.container}>
      {credentials.length > 0 ? (
        <ScrollView>
          {credentials.map((credential, index) => {
            const schemaId = credential.metadata.get(
              "_anoncreds/credential"
            )?.schemaId;
            const imageSource =
              schemaIdToImageMapping["NypRCRGykSwKUuRBQx2b9o:2:degree:1.0"];
            const credentialName = "Animo ID";

            return (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Credential", {
                    credential_offer_id: credential.id,
                    credential_name: credentialName,
                    schema_id: schemaId,
                  })
                }
              >
                <View style={styles.card}>
                  <Image source={imageSource} style={styles.image} />
                  <Text style={styles.credentialName}>{credentialName}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <Text>There is no credentials yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  credentialName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCredential: {},
});

export default Wallet;
