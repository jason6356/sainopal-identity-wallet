import React, { useEffect, useLayoutEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker"
import RNFS from "react-native-fs"
import IndySdk, { WalletConfig } from "indy-sdk-react-native"
import { config } from "../../../config/agent"

import { StackScreenProps } from "@react-navigation/stack"
import { WalletStackParamList } from "../../navigators/WalletStack"
import { ConsoleLogger, InitConfig, LogLevel } from "@aries-framework/core"
import * as SQLite from "expo-sqlite"

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">
const db = SQLite.openDatabase("db.db")

const RecoveryPhrase = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Recover Wallet",
    })
  }, [navigation])
  const [storedRecoveryPhrase, setStoredRecoveryPhrase] = useState([])

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
          const recoveryPhraseData: any = rows._array
          const wordsOnly = recoveryPhraseData.map(
            (item: { word: any }) => item.word
          )
          const wordsString = wordsOnly.join(" ")
          console.log(wordsString)
          if (recoveryPhraseData.length > 0) {
            setStoredRecoveryPhrase(recoveryPhraseData)
          }
        })
      },
      (error) => {
        console.log("Transaction Error: " + error.message)
      }
    )
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Please secure your recovery phrase</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>
          You should store there 12 secret words in the right order in safe
          place
        </Text>
      </View>

      <View>
        <Text style={styles.subtitle}>{storedRecoveryPhrase}</Text>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.importButton}>
          <Text style={styles.importButtonText}>Copy to clipboard</Text>
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

export default RecoveryPhrase
