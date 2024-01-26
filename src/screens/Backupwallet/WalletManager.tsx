import { config, recoveryPhraseLocal } from "@agentStuff/index"
import useHideBottomTabBar from "@hooks/useHideBottomTabBar"
import { SettingStackParamList } from "@navigation/SettingStack"
import { StackScreenProps } from "@react-navigation/stack"
import { useAgent } from "@aries-framework/react-hooks"
//import IndySdk, { WalletConfig } from "indy-sdk-react-native"
import { WalletConfig } from "@aries-framework/core"
import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native"
import RNFS from "react-native-fs"
import { TouchableOpacity } from "react-native-gesture-handler"

type Props = StackScreenProps<SettingStackParamList, "WalletManager">
const WalletManager = ({ navigation }: Props) => {
  useHideBottomTabBar()
  const agent = useAgent()

  const [loading, setLoading] = useState(false)
  let recoveryPhrase: string = ""
  const [exportConfig, setExportConfig] = useState({
    path: ``,
    key: "",
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Backup Wallet",
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  })

  useEffect(() => {
    const fetchData = async () => {
      recoveryPhrase = await recoveryPhraseLocal()
      setExportConfig({
        path: `${RNFS.ExternalDirectoryPath}/exported_wallet${Date.now()}.json`,
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
        // const walletHandle = await agent.agent.wallet.open(
        //   walletConfig
        //   //walletCredentials
        // )
        await agent.agent.wallet.export(exportConfig)
        await agent.agent.wallet.close()

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
