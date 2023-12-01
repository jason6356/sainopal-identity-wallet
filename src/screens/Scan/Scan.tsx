import { useAgent } from "@aries-framework/react-hooks"
import { AntDesign } from "@expo/vector-icons"
import { StackScreenProps } from "@react-navigation/stack"
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner"
import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native"
import { ScanStackParamList } from "@navigation/ScanStack"

type Props = StackScreenProps<ScanStackParamList, "Scan">

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

  const handleBack = () => {
    navigation.goBack()
  }

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    setScanned(true)
    try {
      const result = await agent.agent.oob.parseInvitation(data)
      console.log("Connection Request Received!")
      navigation.navigate("ConnectionRequest", {
        inviteObj: result,
        url: data,
      })
    } catch (e) {
      console.log("Invalid QR Code")
    } finally {
      setTimeout(() => {
        setScanned(false)
      }, 5000)
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
          style={{
            width: 500,
            height: 910,
          }}
        />
      )}
      <View style={styles.backIcon}>
        <TouchableHighlight onPress={handleBack}>
          <AntDesign name="back" size={30} color="#fff" />
        </TouchableHighlight>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlignVertical: "center",
            paddingLeft: 30,
            fontWeight: "bold",
          }}
        >
          Back To Wallet
        </Text>
      </View>
      <View style={styles.borderContainer}></View>

      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Press Me To Scan Again</Text>
        </TouchableOpacity>
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
  backIcon: {
    position: "absolute",
    flexDirection: "row",
    top: 50,
    left: 10,
    zIndex: 1,
  },
  button: {
    backgroundColor: "#09182d",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
