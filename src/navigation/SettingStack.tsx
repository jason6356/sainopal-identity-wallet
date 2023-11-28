import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Settings from "@screens/Settings/Settings";
import NestedScreen1 from "@screens/Settings/Screen1";

export type SettingStackParamList = {
  Settings: undefined;
  BackUpWallet: { msg: string };
};

const SettingStack = createStackNavigator<SettingStackParamList>();

const SettingStackScreen: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen name="BackUpWallet" component={NestedScreen1} />
    </SettingStack.Navigator>
  );
};

export default SettingStackScreen;
