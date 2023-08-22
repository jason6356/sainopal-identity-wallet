import { useAgent } from "@aries-framework/react-hooks"
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner"
import React, { useEffect, useState } from "react"
import { Alert, Button, StyleSheet, Text, View } from "react-native"

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const agent = useAgent()

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      if (status === "granted") {
        setHasPermission(true)
      }
    }

    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    // setScanned(true)
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
              .then((e) => console.log("Nice"))
          },
        },
      ],
      { cancelable: false }
    )
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
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
