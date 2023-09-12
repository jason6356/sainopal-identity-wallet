import { useCallback, useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  ImageProps as DefaultImageProps,
  ImageURISource,
} from "react-native"
import { config } from "../../../config/agent"
import { WalletConfig } from "indy-sdk-react-native"
import IndySdk from "indy-sdk-react-native"
import RNFS from "react-native-fs"
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker"
export default function WalletScreen() {
  const [exportConfig, setExportConfig] = useState({
    path: `${RNFS.DownloadDirectoryPath}/exported_wallet${Date.now()}.json`,
    key: "ChaCha20-Poly1305-IETF",
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

        // Export the wallet data
        await IndySdk.exportWallet(walletHandle, exportConfig)
        await IndySdk.closeWallet(walletHandle)
        console.log("Exported Wallet Successfully")
      } else {
        // Handle case where walletConfig or walletCredentials is undefined
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
          await IndySdk.deleteWallet(
            walletConfig,
            walletCredentials,
            walletName
          )
          console.log("Deleted existing wallet:", walletName)
        } catch (deleteError) {
          // Ignore errors if the wallet doesn't exist
          if (deleteError.indyCode !== 212) {
            console.error("Error deleting wallet:", deleteError)
          }
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
    <View>
      <Text>Export Wallet</Text>
      {/* Input fields and export button */}
      <Button title="Export" onPress={handleExport} />

      <Text>Import Wallet</Text>
      {/* Input fields and import button */}
      <Button title="Import" onPress={handleImport} />
    </View>
  )
}
