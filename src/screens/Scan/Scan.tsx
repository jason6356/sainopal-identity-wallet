import { useAgent } from "@aries-framework/react-hooks"
import { StackScreenProps } from "@react-navigation/stack"
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner"
import React, { useEffect, useState } from "react"
import { Alert, Button, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "../../navigators/BottomNavigation"

type Props = StackScreenProps<RootStackParamList, "Scan">

export default function Scan({ navigation, route }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const agent = useAgent()

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      if (status === "granted") {
        setHasPermission(true)
        setScanned(false)
      }
    }
    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    try {
      const result = await agent.agent.oob.parseInvitation(data)
      setScanned(true)
      Alert.alert(
        "Scanned Data",
        `Bar code with type ${type} and data ${data} has been scanned!`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setScanned(false)
            },
          },
          {
            text: "OK",
            onPress: () => {
              agent.agent.oob
                .receiveInvitationFromUrl(data)
                .then((e) => {
                  Alert.alert(
                    `Successfully Connected with the Agent ${e.connectionRecord?.theirLabel}`
                  )

                  navigation.navigate("ContactsStack")
                })
                .catch((e) => console.error(e))

              // setScanned(false)
            },
          },
        ],
        { cancelable: false }
      )
    } catch (e) {
      setScanned(true)
      Alert.alert("Invalid Url")
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.borderContainer}></View>

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  borderContainer: {
    position: "absolute",
    width: 300, // Set the width of the border container
    height: 300, // Set the height of the border container
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
})
