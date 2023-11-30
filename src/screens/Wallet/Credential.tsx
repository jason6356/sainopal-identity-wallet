import {
  useAgent,
  useConnectionById,
  useCredentialById,
} from "@aries-framework/react-hooks"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { WalletStackParamList } from "../../navigation/WalletStack"

import { getCredentialFormat, getCredentialName } from "../../utils/credentials"
import { ContactStackParamList } from "../../navigation/ContactStack"

type CredentialFormatData = {
  name: string
  value: string
}

type Props =
  | StackScreenProps<WalletStackParamList, "Credential">
  | StackScreenProps<ContactStackParamList, "Credential">

const credentialImage = require("../../assets/degree.png")

const tabBarStyle = {
  position: "absolute",
  bottom: 0,
  right: 0,
  left: 0,
  elevation: 0,
  height: 70,
  backgroundColor: "#fff",
  paddingBottom: 20,
  paddingTop: 20,
}

const Credential = ({ navigation, route }: Props) => {
  const { credential_offer_id, parentRoute } = route.params
  const credentialOffer = useCredentialById(credential_offer_id)
  const agent = useAgent()
  const connectionDetails = useConnectionById(
    credentialOffer?.connectionId ? credentialOffer.connectionId : ""
  )

  const [credentialFormatData, setCredentialFormatData] = useState<
    CredentialFormatData[]
  >([])

  const [credentialName, setCredentialName] = useState<string>("")

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
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    })
    updateNameAndFormat(credential_offer_id)

    if (parentRoute === "Wallet") {
      return () =>
        navigation.getParent()?.setOptions({ tabBarStyle: tabBarStyle })
    }
  }, [navigation])

  async function updateNameAndFormat(id: string) {
    setCredentialName(await getCredentialName(agent.agent, id))
    setCredentialFormatData(await getCredentialFormat(agent.agent, id))
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/*  Credential Card Section */}
        <View style={styles.card}>
          {/* 
        @Todo : Null Check for Image Source if we don have the image for specific schema id
        */}
          <Image source={credentialImage} style={{ width: 70, height: 70 }} />
        </View>

        {/*  Credential Info Section */}

        <View style={styles.card}>
          <View style={{ padding: 10 }}>
            <Text style={styles.cardTitle}>Info</Text>
          </View>
          <View style={styles.credentialHeader}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%", paddingVertical: 5 }}>
                <Text style={styles.credentialAttribute}>Credential</Text>
              </View>
              <View style={{ width: "50%", paddingVertical: 5 }}>
                <Text style={styles.credentialValue}>{credentialName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%", paddingVertical: 5 }}>
                <Text style={styles.credentialAttribute}>Issuer</Text>
              </View>
              <View style={{ width: "50%", paddingVertical: 5 }}>
                <Text style={styles.credentialValue}>
                  {connectionDetails?.theirLabel}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.credentialFormData}>
            {credentialFormatData.map((e, index) => (
              <View key={index} style={{ flexDirection: "row" }}>
                <View style={{ width: "50%", paddingVertical: 5 }}>
                  <Text style={styles.credentialAttribute}>{e.name}</Text>
                </View>
                <View style={{ width: "50%", paddingVertical: 5 }}>
                  <Text style={styles.credentialValue}>{e.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  credentialHeader: {
    flexDirection: "column",
    paddingHorizontal: 10,
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
})

export default Credential
