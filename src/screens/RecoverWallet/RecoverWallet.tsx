import React, { useLayoutEffect, useState } from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker"
import RNFS from "react-native-fs"
import IndySdk, { WalletConfig } from "indy-sdk-react-native"
import { config } from "../../../config/agent"

import { StackScreenProps } from "@react-navigation/stack"
import { WalletStackParamList } from "../../navigators/WalletStack"

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">

const RecoverWallet = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Recover Wallet",
    })
  })
  const [fileResponse, setFileResponse] =
    useState<DocumentPickerResponse | null>()
  const [importedFileName, setImportedFileName] = useState<string | null>(null)

  const pickDocument = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
      })
      const fileResponse = response.map((item) => {
        return item
      })[0]
      setFileResponse(fileResponse)
      console.log(fileResponse?.uri + " Test")
      handleImport(fileResponse) // Call handleImport after successfully picking the document
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the file picker
      } else {
        // Handle any other errors
        console.error("Error picking document:", err)
      }
    }
  }

  const handleImport = async (fileResponse: DocumentPickerResponse | null) => {
    try {
      if (fileResponse?.name) {
        setImportedFileName(fileResponse.name)
        // Rest of your import logic here
      } else {
        console.log("No file selected")
      }
    } catch (error) {
      console.error("Error during import:", error)
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
    marginTop: 150,
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
    marginBottom: 100,
  },
})

export default RecoverWallet
