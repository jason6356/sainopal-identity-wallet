import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Clipboard,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RouteProp, NavigationProp } from "@react-navigation/native"
import * as SQLite from "expo-sqlite"
import { SettingStackParamList } from "../../navigators/SettingStack"
import { StackScreenProps } from "@react-navigation/stack"
import { Alert } from "react-native"
import { ConsoleLogger, InitConfig, LogLevel } from "@aries-framework/core"
import { DocumentPickerResponse } from "react-native-document-picker"
import RNFS from "react-native-fs"
import IndySdk, { WalletConfig } from "indy-sdk-react-native"
import {
  getAgent,
  config,
  agent,
  recoveryPhraseLocal,
  walletLocal,
  getAgentConfig,
  createLinkSecretIfRequired,
} from "../../../config/index"
import { useAgent } from "@aries-framework/react-hooks"
import { useAuth } from "../../../context/AuthProvider"
import { encode, decode } from "base-64"
import RecoveryPhrases from "../Auth/RecoveryPhrase"
import RecoveryPhraseTable from "../../../sqlite/recoveryPhrase"

type Props = StackScreenProps<SettingStackParamList, "RecoverWalletKey">

const db = SQLite.openDatabase("db.db")
const RecoverWalletKey = ({ navigation, route }: Props) => {
  const { path } = route.params
  const [loading, setLoading] = useState(false)
  const [recoveryPhrase, setRecoveryPhrase] = useState("")
  const [storedRecoveryPhrase, setStoredRecoveryPhrase] = useState([])
  const agent = useAgent()
  const { logout }: any = useAuth()

  const wordCount = recoveryPhrase.trim()
    ? recoveryPhrase.trim().split(/\s+/).length
    : 0

  useEffect(() => {
    console.log("pass:", path)
  }, [])

  const handleImport = async (selectedFile: DocumentPickerResponse | null) => {
    setLoading(true)

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
      const recovery = customEncode(recoveryPhrase)
      await RNFS.moveFile(selectedFile.uri, localFilePath)
      const configNew: InitConfig = {
        label: "SainoPal Mobile Wallet",
        walletConfig: {
          id: walletName,
          key: recovery,
        },
        logger: new ConsoleLogger(LogLevel.trace),
      }

      const walletConfig: WalletConfig = configNew.walletConfig || {}
      const walletCredentials = { key: configNew.walletConfig?.key || "" }

      const existingWalletPath = `${RNFS.DocumentDirectoryPath}/.indy_client/wallet/${walletName}`
      const walletExists = await RNFS.exists(existingWalletPath)

      console.log("localFilePath  ", localFilePath)

      if (walletExists) {
        await RNFS.unlink(existingWalletPath)
        console.log("Deleted existing wallet:", walletName)
      }

      console.log(customEncode(recoveryPhrase))

      await IndySdk.importWallet(walletConfig, walletCredentials, {
        path: localFilePath,
        key: customEncode(recoveryPhrase),
      })

      await updateUserData(walletName)
      RecoveryPhraseTable.updatePhrase(recoveryPhrase, () => {
        console.log("Callback after updating recovery phrase")
      })

      logout()
      // onLogin(true)
      // navigation.navigate("Login")

      console.log("Imported Wallet Successfully")
      Alert.alert(
        "Success",
        "Wallet imported successfully! Require restart app"
      )
    } catch (error) {
      console.error("Error during import:", error)
      Alert.alert("Error", "An error occurred during wallet import.")
    } finally {
      setLoading(false)
    }
  }

  const confirmButtonStyle =
    wordCount === 12
      ? { backgroundColor: "#90b4fc", borderColor: "#90b4fc" }
      : { backgroundColor: "#c1cbd7", borderColor: "#c1cbd7" }

  const confirmButtonTextStyle =
    wordCount === 12 ? { color: "white" } : { color: "#eef7ff" }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Set Pin",

      headerTitleStyle: {
        color: "#0e2e47",
      },
      headerTintColor: "#0e2e47",
    })
  }, [])

  const customEncode = (text: string) => {
    const words = text.trim().split(/\s+/)
    const encodedWords = words.map((word) => encode(word))
    const formattedText = encodedWords.join(" ")
    return formattedText
  }

  const handleConfirm = () => {
    if (wordCount === 12) {
      handleImport(path)
    } else {
      alert("Please enter a valid recovery phrase.")
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const content = await (Clipboard as any).getString()

      setRecoveryPhrase(content)
    } catch (error) {
      console.error("Error reading from clipboard:", error)
    }
  }

  const updateUserData = async (walletName: string) => {
    return new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "UPDATE user SET wallet = ?",
            [walletName],
            (_, result) => {
              console.log("User table updated successfully")
              resolve()
            },
            (_, error) => {
              console.error("Error updating user table:", error)
              reject()
            }
          )
        },
        null,
        () => {
          console.log("Transaction completed")
        }
      )
    })
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View>
        <Text style={styles.title}>
          Please insert your recovery phrase to reset your PIN
        </Text>
      </View>

      <View>
        <Text style={styles.subtitle}>
          To restore access to your wallet, you need your recovery phrase
          consisting of 12 words.
        </Text>
      </View>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Recovery phrase"
        textAlignVertical="top"
        value={recoveryPhrase}
        onChangeText={(text) => setRecoveryPhrase(text)}
      />
      <View style={styles.wordCountContainer}>
        <Text style={styles.wordCountText}>{wordCount} of 12 words</Text>
      </View>

      <View style={styles.conButton}>
        <TouchableOpacity
          style={[styles.confirmButton, confirmButtonStyle]}
          onPress={handleConfirm}
        >
          <Text style={[styles.confirmText, confirmButtonTextStyle]}>
            Confirm recovery phrase
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.Button}
          onPress={handlePasteFromClipboard}
        >
          <Text style={styles.ButtonText}>Paste from clipboard</Text>
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
  input: {
    marginTop: 50,
    height: 150,
    borderColor: "#a6a7b1",
    color: "#b4b9c1",
    fontWeight: "bold",
    borderWidth: 1.5,
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    fontSize: 14,
  },
  wordCountContainer: {
    marginBottom: 10,
  },
  wordCountText: {
    fontSize: 14,
    color: "#b4b9c1",
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "bold",
    marginTop: 20,
    color: "#324254",
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
  Button: {
    marginBottom: 20,
    marginTop: 10,
    borderColor: "#90b4fc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  ButtonText: {
    color: "#90b4fc",
    fontSize: 17,
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#c1cbd7",
    borderColor: "#c1cbd7",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  containerButton: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 90,
  },
  conButton: {
    position: "relative",
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
    marginTop: 50,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default RecoverWalletKey
