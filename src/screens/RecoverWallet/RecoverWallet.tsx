import React, { useLayoutEffect, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker"
import RNFS from "react-native-fs"
//import IndySdk, { WalletConfig } from "indy-sdk-react-native"
import { recoveryPhraseLocal } from "../../../agentStuff/agent"

import {
  ConsoleLogger,
  InitConfig,
  LogLevel,
  WalletConfig,
} from "@aries-framework/core"
import { StackScreenProps } from "@react-navigation/stack"

import { useAgent } from "@aries-framework/react-hooks"
import useHideBottomTabBar from "@hooks/useHideBottomTabBar"
import { SettingStackParamList } from "@navigation/SettingStack"

type Props = StackScreenProps<SettingStackParamList, "RecoverWallet">

const RecoverWallet = ({ navigation }: Props) => {
  useHideBottomTabBar()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Recover Wallet",
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  }, [navigation])

  const [importedFileName, setImportedFileName] = useState<string | null>(null)
  const agent = useAgent()

  const pickDocument = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: "documentDirectory",
      })

      const selectedFile = response[0]
      setImportedFileName(selectedFile.name)
      console.log(`${selectedFile.name} file picked`)
      // handleImport(selectedFile)
      // navigation.navigate("RecoverWalletKey", "sohai")
      navigation.push("RecoverWalletKey", {
        path: selectedFile,
      })
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error("Error picking document:", err)
        Alert.alert("Error", "An error occurred while picking the document.")
      }
    }
  }

  const handleImport = async (selectedFile: DocumentPickerResponse | null) => {
    try {
      if (!selectedFile) {
        console.log("No file selected")
        return
      }

      const uniqueIdentifier = `${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`
      const walletName = `imported_wallet_${uniqueIdentifier}`
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${selectedFile.name}`

      await RNFS.moveFile(selectedFile.uri, localFilePath)
      const recovertWallet: string = await recoveryPhraseLocal()
      const configNew: InitConfig = {
        label: "SainoPal Mobile Wallet",
        walletConfig: {
          id: walletName,
          key: recovertWallet,
        },
        logger: new ConsoleLogger(LogLevel.trace),
      }

      const walletConfig: WalletConfig = configNew.walletConfig || {
        id: "",
        key: "",
      }
      const walletCredentials = { key: configNew.walletConfig?.key || "" }

      // Check if the wallet already exists
      const existingWalletPath = `${RNFS.DocumentDirectoryPath}/.indy_client/wallet/${walletName}`
      const walletExists = await RNFS.exists(existingWalletPath)

      console.log("localFilePath  ", localFilePath)

      // Delete existing wallet if it exists
      if (walletExists) {
        await RNFS.unlink(existingWalletPath)
        console.log("Deleted existing wallet:", walletName)
      }

      // Import the wallet
      // await IndySdk.importWallet(walletConfig, walletCredentials, {
      //   path: localFilePath,
      //   key: "123456",
      // })

      await agent.agent.wallet.import(walletConfig, {
        path: localFilePath,
        key: "123456",
      })

      console.log("Imported Wallet Successfully")
      Alert.alert("Success", "Wallet imported successfully!")
    } catch (error) {
      console.error("Error during import:", error)
      Alert.alert("Error", "An error occurred during wallet import.")
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Please select your backup file to restore your credentials and
          contacts
        </Text>
      </View>
      <View>
        <Text style={styles.subtitle}>
          You choose the storage location of your backup file yourself while
          setting it up. It must be a ZIP file.
        </Text>
      </View>

      <View style={styles.containerButton}>
        {/* Conditional rendering for displaying selected file */}
        {importedFileName && (
          <Text style={styles.selectedFileText}>
            Selected file: {importedFileName}
          </Text>
        )}

        {/* Import Button */}
        <TouchableOpacity style={styles.importButton} onPress={pickDocument}>
          <Text style={styles.importButtonText}>Select backup file</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "bold",
    marginTop: 20,
    color: "#243853",
  },
  subtitle: {
    marginTop: 10,
    lineHeight: 25,
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaafb8",
  },
  selectedFileText: {
    marginTop: 15,
    fontSize: 16,
    color: "#243853",
  },
  importButton: {
    marginTop: 20,
    backgroundColor: "#90b4fc",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  importButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerButton: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 90,
  },
})

export default RecoverWallet
