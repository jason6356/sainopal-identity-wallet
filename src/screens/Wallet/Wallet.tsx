import { CredentialState } from "@aries-framework/core"
import { useCredentialByState, useAgent } from "@aries-framework/react-hooks"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { WalletStackParamList } from "../../navigation/WalletStack"
import { getSchemaNameFromOfferID } from "../../utils/schema"

const schemaIdToImageMapping = {
  "NypRCRGykSwKUuRBQx2b9o:2:degree:1.0": require("../../assets/degree.png"),
}

type Props = StackScreenProps<WalletStackParamList, "Wallet", "Credential">

const Wallet = ({ navigation, route }: Props) => {
  const credentials = useCredentialByState(CredentialState.Done)
  const agent = useAgent()
  const [credentialMap, setCredentialMap] = useState(new Map())

  const mapCredentials = async () => {
    const newCredentialMap = new Map()

    for (const e of credentials) {
      const name = await getSchemaNameFromOfferID(agent.agent, e.id)
      newCredentialMap.set(e.id, name)
    }

    setCredentialMap(newCredentialMap)
  }

  useEffect(() => {
    mapCredentials()
  }, [credentials])

  useLayoutEffect(() => {
    //change header color to #09182d and text to white
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  })

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("SelfCredential")}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/selfCredential.png")}
            style={styles.image}
          />
          <Text style={styles.credentialName}>{"Self Credential"}</Text>
        </View>
      </Pressable>

      {credentials.length > 0 ? (
        <ScrollView>
          {credentials.map((credential, index) => {
            const schemaId = credential.metadata.get(
              "_anoncreds/credential"
            )?.schemaId
            const credentialName = credentialMap.get(credential.id)
            const imageSource =
              schemaIdToImageMapping["NypRCRGykSwKUuRBQx2b9o:2:degree:1.0"]
            console.log(credential.id)

            return (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Credential", {
                    credential_offer_id: credential.id,
                    parentRoute: "Wallet",
                  })
                }
              >
                <View style={styles.card}>
                  <Image source={imageSource} style={styles.image} />
                  <Text style={styles.credentialName}>{credentialName}</Text>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      ) : (
        <Text>There is no credentials yet</Text>
      )}
    </View>
  )
}

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
})

export default Wallet
