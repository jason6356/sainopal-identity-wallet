import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Settings from "../screens/Settings/Settings"
import NestedScreen1 from "../screens/Settings/Screen1"
import BackupWallet from "../screens/backupwallet/WalletManager"

import Home from "../screens/Home/Home"
export type SettingStackParamList = {
  Settings: undefined
  ChangePin: { msg: string }
  BackUpWallet: { msg: string }
}

const SettingStack = createStackNavigator<SettingStackParamList>()

const SettingStackScreen: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen name="ChangePin" component={Home} />
      <SettingStack.Screen name="BackUpWallet" component={BackupWallet} />
    </SettingStack.Navigator>
  )
}

export default SettingStackScreen
