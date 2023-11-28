import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Clipboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import NumberPad from "./components/NumberPad"
import { RouteProp, NavigationProp } from "@react-navigation/native"
import * as SQLite from "expo-sqlite"
import { useAuth } from "../../../context/AuthProvider"
import RecoveryPhraseTable from "../../../sqlite/recoveryPhrase"

type RootStackParamList = {
  RecoveryPhrases: undefined
  Login: undefined
}

type SignUpScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "RecoveryPhrases"
>

type SignUpScreenRouteProp = RouteProp<RootStackParamList, "RecoveryPhrases">

const RecoveryPhrases: React.FC<{
  navigation: SignUpScreenNavigationProp
  route: SignUpScreenRouteProp
}> = ({ navigation, route }) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState("")
  const [storedRecoveryPhrase, setStoredRecoveryPhrase] = useState([])
  const wordCount = recoveryPhrase.trim().split(/\s+/).length
  const { login }: any = useAuth()

  useEffect(() => {
    RecoveryPhraseTable.getAllPhrasesArray((phrases: any) => {
      console.log("Retrieved Phrases Array:", phrases)
      setStoredRecoveryPhrase(phrases)
    })
  }, [])

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

  const handleConfirm = () => {
    if (wordCount === 12) {
      const enteredWords = recoveryPhrase.trim().split(/\s+/)
      const match = enteredWords.every(
        (word, index) => word === storedRecoveryPhrase[index]?.word
      )
      if (match) {
        login()
      } else {
        alert("Recovery phrases do not match. Please try again.")
      }
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

  return (
    <View style={styles.container}>
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
    marginTop: 130,
  },
})

export default RecoveryPhrases
