import { StackScreenProps } from "@react-navigation/stack";
import IndySdk, { WalletConfig } from "indy-sdk-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import RNFS from "react-native-fs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { config, recoveryPhraseLocal } from "../../../config/index";
import { WalletStackParamList } from "../../navigators/WalletStack";
import useHideBottomTabBar from "@hooks/useHideBottomTabBar";

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">;
const WalletManager = ({ navigation }: Props) => {
  useHideBottomTabBar();

  let recoveryPhrase: string = "";
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Backup Wallet",
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      recoveryPhrase = await recoveryPhraseLocal();
      setExportConfig({
        path: `${RNFS.DownloadDirectoryPath}/exported_wallet${Date.now()}.json`,
        key: recoveryPhrase,
      });
    };
    fetchData();
  }, []);

  const [exportConfig, setExportConfig] = useState({
    path: `${RNFS.DownloadDirectoryPath}/exported_wallet${Date.now()}.json`,
    key: "123456",
  });

  let walletConfig: WalletConfig | undefined;
  let walletCredentials: { key: string } | undefined;
  const handleExport = async () => {
    try {
      console.log("sss : ", exportConfig);
      if (config?.walletConfig) {
        walletConfig = config.walletConfig;
        walletCredentials = { key: config.walletConfig.key };
      }
      if (walletConfig && walletCredentials) {
        const walletHandle = await IndySdk.openWallet(
          walletConfig,
          walletCredentials
        );
        await IndySdk.exportWallet(walletHandle, exportConfig);
        await IndySdk.closeWallet(walletHandle);
        console.log("Exported Wallet Successfully");
      } else {
        console.log("CANNOT SIA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.containerImage]}>
        <Image
          source={require("../../assets/backupIcon.png")}
          style={styles.image}
        />
      </View>
      <View>
        <Text style={[styles.title]}>Your Wallet is backed up</Text>
      </View>
      <View>
        <Text style={[styles.subtitle]}>
          In case you lose access to your wallet, you will be able to recover
          your data with your recovery phrase and your exported file.
        </Text>
      </View>
      {/* Input fields and export button */}
      {/* <Button
        title="Create a new backup file"
        onPress={handleExport}
      /> */}
      <View style={[styles.containerBtn]}>
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}> Create new backup file </Text>
        </TouchableOpacity>
      </View>
      {/* <Text>Import Wallet</Text> */}
      {/* Input fields and import button */}
      {/* <Button title="Import" onPress={handleImport} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  containerImage: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  containerBtn: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 100,
  },
  image: {
    width: 150,
    height: 150,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#90b4fc",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "bold",
    color: "#243853",
  },
  subtitle: {
    marginTop: 10,
    lineHeight: 25,
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaafb8",
  },
});

export default WalletManager;
