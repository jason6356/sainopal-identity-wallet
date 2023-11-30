import React from "react"
import { Platform, Text, View, ViewStyle } from "react-native"
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import ContactScreenStack from "./ContactStack"
import ScanScreenStack from "./ScanStack"
import SettingStackScreen from "./SettingStack"
import WalletScreenStack from "./WalletStack"

export type RootStackParamList = {
  WalletStack: undefined
  ContactsStack: undefined
  SettingsStack: undefined
  ScanStack: undefined
}

const Tab = createBottomTabNavigator<RootStackParamList>()

interface ScreenOptions {
  tabBarShowLabel: boolean
  headerShown: boolean
  tabBarStyle: {
    position: "absolute"
    bottom: 0
    right: 0
    left: 0
    elevation: number
    height: number
    backgroundColor: string
    paddingBottom: number
    paddingTop: number
  }
}

const screenOptions: ScreenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 70,
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingTop: 20,
  },
}

const notificationAlert: ViewStyle = {
  position: "absolute",
  bottom: 30,
  left: 30,
  backgroundColor: "#93b6f8",
  borderRadius: 10,
  width: 15,
  height: 15,
  justifyContent: "center",
  alignItems: "center",
}

const BottomNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="WalletStack"
          component={WalletScreenStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Entypo
                  name="wallet"
                  size={24}
                  color={focused ? "#0e2b45" : "#828c9f"}
                />

                <Text style={{ fontSize: 14, color: "#0e2b45" }}>Wallet</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ContactsStack"
          component={ContactScreenStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={focused ? "#0e2b45" : "#828c9f"}
                />
                <Text style={{ fontSize: 14, color: "#0e2b45" }}>Contacts</Text>
                <View style={notificationAlert}>
                  <Text style={{ color: "white", fontSize: 12 }}></Text>
                </View>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="SettingsStack"
          component={SettingStackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Ionicons
                  name="settings"
                  size={24}
                  color={focused ? "#0e2b45" : "#828c9f"}
                />
                <Text style={{ fontSize: 14, color: "#0e2b45" }}>Settings</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ScanStack"
          component={ScanScreenStack}
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: Platform.OS === "ios" ? 50 : 60,
                  height: Platform.OS === "ios" ? 50 : 60,
                  top: Platform.OS === "ios" ? -10 : -30,
                  borderRadius: Platform.OS === "ios" ? 25 : 30,
                  backgroundColor: "#0e2b45",
                  position: "relative",
                }}
              >
                <FontAwesome name="qrcode" size={24} color="#fff" />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#0e2b45",
                    position: "absolute",
                    top: 62,
                  }}
                >
                  Scan
                </Text>
              </View>
            ),
            tabBarStyle: {
              display: "none",
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default BottomNavigation
