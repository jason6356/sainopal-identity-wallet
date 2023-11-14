import React, { useState, useEffect, useLayoutEffect } from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import {
  useConnectionById,
  useCredentialById,
} from "@aries-framework/react-hooks";
import { StackScreenProps } from "@react-navigation/stack";
import { WalletStackParamList } from "../../navigators/WalletStack";

const schemaIdToImageMapping = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": require("../../assets/degree.png"),
};

const schemaIdToCredentialName = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": "Degree Certificate",
};

type Props = StackScreenProps<WalletStackParamList, "Credential">;

const Credential = ({ navigation, route }: Props) => {
  const { credential_offer_id, credential_name, schema_id } = route.params;
  const credentialOffer = useCredentialById(credential_offer_id);
  const connectionDetails = useConnectionById(
    credentialOffer?.connectionId ? credentialOffer.connectionId : ""
  );
  const [imageSource, setImageSource] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: credential_name,
    });
  });

  useEffect(() => {
    console.log(JSON.stringify(credentialOffer));
    setImageSource(
      schemaIdToImageMapping["NypRCRGykSwKUuRBQx2b9o:2:degree:1.0"]
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          {/* 
        @Todo : Null Check for Image Source if we don have the image for specific schema id
        */}
          <Image source={imageSource} style={styles.image} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Credential Info</Text>
          {credentialOffer && (
            <View style={styles.cardContent}>
              <Text style={styles.schemaId}>
                Issued By: {connectionDetails?.theirLabel}
              </Text>
              <Text style={styles.schemaId}>
                Issued On: {connectionDetails?.createdAt.toLocaleString()}
              </Text>
              <Text style={styles.schemaId}>Info</Text>
              {credentialOffer.credentialAttributes?.map((attribute, index) => (
                <React.Fragment key={index}>
                  {attribute.name === "picture" ? (
                    <View>
                      <Text>{attribute.name}</Text>
                      <Image
                        source={{ uri: attribute.value }} // Assuming attribute.value is a valid image URL
                        style={{ width: 300, height: 300 }}
                      />
                    </View>
                  ) : (
                    <Text style={styles.attribute}>
                      {attribute.name}: {attribute.value}
                    </Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 10,
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
    fontSize: 14,
    marginBottom: 8,
  },
  attribute: {
    fontSize: 14,
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Credential;
