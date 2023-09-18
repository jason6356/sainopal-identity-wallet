import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Settings from "../screens/Settings/Settings"
import NestedScreen1 from "../screens/Settings/Screen1"
import BackupWallet from "../screens/Backupwallet/WalletManager"
import RecoverWallet from "../screens/RecoverWallet/RecoverWallet"
import Home from "../screens/Home/Home"
export type SettingStackParamList = {
  Settings: undefined
  ChangePin: { msg: string }
  BackUpWallet: { msg: string }
  RecoverWallet: { msg: string }
}

const SettingStack = createStackNavigator<SettingStackParamList>()

const SettingStackScreen: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen name="ChangePin" component={Home} />
      <SettingStack.Screen name="BackUpWallet" component={BackupWallet} />
      <SettingStack.Screen name="RecoverWallet" component={RecoverWallet} />
    </SettingStack.Navigator>
  )
}

export default SettingStackScreen
