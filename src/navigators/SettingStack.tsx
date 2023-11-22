import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Settings from "../screens/Settings/Settings"
import WalletManager from "../screens/Backupwallet/WalletManager"
import RecoverWallet from "../screens/RecoverWallet/RecoverWallet"
import Home from "../screens/Home/Home"
import RecoveryPhrase from "../screens/RecoverWallet/RecoveryPhrase"
import Login from "../../App"
import RecoverWalletKey from "../screens/RecoverWallet/RecoverWalletKey"
import { DocumentPickerResponse } from "react-native-document-picker"
import App from "../../App"

export type SettingStackParamList = {
  Settings: undefined
  ChangePin: { msg: string }
  WalletManager: { msg: string }
  RecoverWallet: { msg: string }
  RecoveryPhrase: { msg: string }
  RecoverWalletKey: { path: DocumentPickerResponse }
  Login: undefined
  App: undefined
}

const SettingStack = createStackNavigator<SettingStackParamList>()

const SettingStackScreen: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen name="ChangePin" component={Home} />
      <SettingStack.Screen name="WalletManager" component={WalletManager} />
      <SettingStack.Screen name="RecoverWallet" component={RecoverWallet} />
      <SettingStack.Screen name="RecoveryPhrase" component={RecoveryPhrase} />
      <SettingStack.Screen
        name="RecoverWalletKey"
        component={RecoverWalletKey}
      />
      <SettingStack.Screen name="App" options={{ headerShown: false }}>
        {(props) => <App />}
      </SettingStack.Screen>
    </SettingStack.Navigator>
  )
}

export default SettingStackScreen
