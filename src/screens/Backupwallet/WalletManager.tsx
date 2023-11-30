import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  ImageProps as DefaultImageProps,
  ImageURISource,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { config, recoveryPhraseLocal } from "../../../config/index"
import { WalletConfig } from "indy-sdk-react-native"
import IndySdk from "indy-sdk-react-native"
import RNFS from "react-native-fs"
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker"
import { TouchableOpacity } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { WalletStackParamList } from "../../navigators/WalletStack"
import React from "react"
import { InitConfig } from "@aries-framework/core"

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">
const WalletManager = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false)
  let recoveryPhrase: string = ""
  const [exportConfig, setExportConfig] = useState({
    path: ``,
    key: "",
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Backup Wallet",
    })
  })

  useEffect(() => {
    const fetchData = async () => {
      recoveryPhrase = await recoveryPhraseLocal()
      setExportConfig({
        path: `${RNFS.DownloadDirectoryPath}/exported_wallet${Date.now()}.json`,
        key: recoveryPhrase,
      })
    }
    fetchData()
  }, [])

  let walletConfig: WalletConfig | undefined
  let walletCredentials: { key: string } | undefined
  const handleExport = async () => {
    try {
      setLoading(true)
      console.log("sss : ", exportConfig)
      if (config?.walletConfig) {
        walletConfig = config.walletConfig
        walletCredentials = { key: config.walletConfig.key }
      }
      if (walletConfig && walletCredentials) {
        const walletHandle = await IndySdk.openWallet(
          walletConfig,
          walletCredentials
        )
        await IndySdk.exportWallet(walletHandle, exportConfig)
        await IndySdk.closeWallet(walletHandle)

        Alert.alert(
          "Successfully",
          `Exported wallet to your local dowload folder.`
        )
        console.log("Exported Wallet Successfully")
      } else {
        console.log("CANNOT SIA")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
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
      <View style={[styles.containerBtn]}>
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}> Create new backup file </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default WalletManager
