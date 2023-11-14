import { useAgent } from "@aries-framework/react-hooks";
import { AntDesign } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import { ScanStackParamList } from "../../navigators/ScanStack";

type Props = StackScreenProps<ScanStackParamList, "Scan">;

export default function Scan({ navigation, route }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const agent = useAgent();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        setScanned(false);
      }
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    try {
      const result = await agent.agent.oob.parseInvitation(data);
      console.log("Connection Request Received!");
      navigation.navigate("ConnectionRequest", {
        inviteObj: result,
        url: data,
      });
    } catch (e) {
      console.log("Invalid QR Code");
    }
    setTimeout(() => {
      setScanned(false);
    }, 5000);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.backIcon}>
        <TouchableHighlight onPress={handleBack}>
          <AntDesign name="back" size={30} color="#fff" />
        </TouchableHighlight>
      </View>
      <View style={styles.borderContainer}></View>

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
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
    top: 50,
    left: 10,
    zIndex: 1,
  },
});
