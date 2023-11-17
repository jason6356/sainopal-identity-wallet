import { useCallback, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  ImageProps as DefaultImageProps,
  ImageURISource,
  StyleSheet,
  Image,
} from "react-native"
import { config } from "../../../config/agent"
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

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">

const WalletManager = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Backup Wallet",
    })
  })
  const [exportConfig, setExportConfig] = useState({
    path: `${RNFS.DownloadDirectoryPath}/exported_wallet${Date.now()}.json`,
    key: "123456",
  })

  const [fileResponse, setFileResponse] =
    useState<DocumentPickerResponse | null>()

  const pickDocument = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
      })
      const fileResponse = response.map((item) => {
        return item
      })[0]
      setFileResponse(fileResponse)
      console.log(fileResponse.uri + " Test")
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the file picker
      } else {
        // Handle any other errors
      }
    }
  }

  const [importConfig, setImportConfig] = useState({
    path: "imported_wallet.json",
    key: "import_key67890",
  })

  let walletConfig: WalletConfig | undefined
  let walletCredentials: { key: string } | undefined

  if (config.walletConfig) {
    walletConfig = config.walletConfig
    walletCredentials = { key: config.walletConfig.key }
  }

  const handleExport = async () => {
    try {
      if (walletConfig && walletCredentials) {
        const walletHandle = await IndySdk.openWallet(
          walletConfig,
          walletCredentials
        )

        await IndySdk.exportWallet(walletHandle, exportConfig)
        await IndySdk.closeWallet(walletHandle)
        console.log("Exported Wallet Successfully")
      } else {
        console.log("CANNOT SIA")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleImport = async () => {
    try {
      await pickDocument()

      console.log("fileResponse:", fileResponse?.uri)

      if (walletConfig && walletCredentials && fileResponse) {
        console.log("walletConfig:", walletConfig)
        console.log("walletCredentials:", walletCredentials)

        // Generate a unique wallet name with a timestamp
        const walletName = `imported_wallet_${Date.now()}`

        // Check if the wallet already exists and close it
        try {
          const existingWalletHandle = await IndySdk.openWallet(
            walletConfig,
            walletCredentials
          )
          await IndySdk.closeWallet(existingWalletHandle)

          console.log("Deleted existing wallet:", walletName)
        } catch (deleteError) {
          // Ignore errors if the wallet doesn't exist
        }

        // Now, you can access the selected file using fileResponse.uri
        if (fileResponse.uri) {
          const localFilePath = `${RNFS.DocumentDirectoryPath}/${walletName}.json`

          // Download the file from the URI to a local directory
          await RNFS.copyFile(fileResponse.uri, localFilePath)

          // Update the importConfig with the local file path and unique wallet name
          const updatedImportConfig = {
            ...importConfig,
            path: localFilePath,
            key: walletName,
          }

          console.log("updatedImportConfig:", updatedImportConfig)

          await IndySdk.importWallet(
            walletConfig,
            walletCredentials,
            updatedImportConfig
          )

          console.log("Imported Wallet Successfully") // Log success message
        } else {
          console.log("No file selected")
        }
      } else {
        console.log("CANNOT SIA")
      }
    } catch (error) {
      console.error("Error during import:", error)
    }
  }

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
})

export default WalletManager
