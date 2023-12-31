import { createStackNavigator } from "@react-navigation/stack"
// import AuthRecoveryPhrase from "../screens/ChangePassword/"
import WalletManager from "@screens/Backupwallet/WalletManager"
import AuthChangePassword from "@screens/ChangePassword/AuthChangePassword"
import ChangeNewPassword from "@screens/ChangePassword/ChangeNewPassword"
import Home from "@screens/Home/Home"
import RecoverWallet from "@screens/RecoverWallet/RecoverWallet"
import RecoverWalletKey from "@screens/RecoverWallet/RecoverWalletKey"
import RecoveryPhrase from "@screens/RecoverWallet/RecoveryPhrase"
import Settings from "@screens/Settings/Settings"
import React from "react"
import { DocumentPickerResponse } from "react-native-document-picker"

export type SettingStackParamList = {
  Settings: undefined
  AuthChangePassword: undefined
  AuthRecoveryPhrase: undefined
  Testing: undefined
  WalletManager: undefined
  RecoverWallet: undefined
  RecoveryPhrase: undefined
  RecoverWalletKey: { path: DocumentPickerResponse }
  ChangeNewPassword: undefined
}

const SettingStack = createStackNavigator<SettingStackParamList>()

const SettingStackScreen: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen
        name="AuthChangePassword"
        component={AuthChangePassword}
      />
      <SettingStack.Screen
        name="ChangeNewPassword"
        component={ChangeNewPassword}
      />
      {/* <SettingStack.Screen
        name="AuthRecoveryPhrase"
        component={AuthRecoveryPhrase}
      /> */}
      <SettingStack.Screen name="WalletManager" component={WalletManager} />
      <SettingStack.Screen name="RecoverWallet" component={RecoverWallet} />
      <SettingStack.Screen name="RecoveryPhrase" component={RecoveryPhrase} />
      <SettingStack.Screen
        name="RecoverWalletKey"
        component={RecoverWalletKey}
      />
      <SettingStack.Screen name="Testing" component={Home} />
    </SettingStack.Navigator>
  )
}

export default SettingStackScreen
