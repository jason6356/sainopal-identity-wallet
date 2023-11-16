import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import {
  // LoginScreenNavigatorProps,
  FirstScreenNavigatorProps,
  SecondScreenNavigatorProps,
  ThirdScreenNavigatorProps,
} from "./types" // Import your types

// import NestedScreen from "./screens/NestedScreen";
// import Screen1 from "./screens/Screen1";
// import Screen2 from "./screens/Screen2";
import Settings from "./src/screens/Settings/Settings"
import Connection from "./src/screens/Connections/Contacts"
import Screen1 from "./src/screens/Settings/Screen1"
// import Login from "./src/screens/Auth/Login"
// import SignUp from "./src/screens/Auth/SignUp"

export type RootStackParamList = {
  // Login: undefined
  // SignUp: undefined
  Settings: undefined
  BackUpWallet: { msg: string }
  Connections: undefined
  NestedScreen3: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

// const LoginScreenNavigator: React.FC<FirstScreenNavigatorProps> = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="SignUp" component={SignUp} />
//     </Stack.Navigator>
//   )
// }

const FirstScreenNavigator: React.FC<FirstScreenNavigatorProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="BackUpWallet" component={Screen1} />
    </Stack.Navigator>
  )
}

export { FirstScreenNavigator }

const SecondScreenNavigator: React.FC<SecondScreenNavigatorProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Connections" component={Connection} />
      {/* <Stack.Screen name="NestedScreen2" component={NestedScreen} /> */}
    </Stack.Navigator>
  )
}

export { SecondScreenNavigator }

const ThirdScreenNavigator: React.FC<ThirdScreenNavigatorProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="BackUpWallet" component={Screen1} />
    </Stack.Navigator>
  )
}

export { ThirdScreenNavigator }
