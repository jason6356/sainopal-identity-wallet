// LoginNav.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import Login from "@screens/Auth/Login"
import RecoveryPhrases from "@screens/Auth/RecoveryPhrase"
import SignUp from "@screens/Auth/SignUp"

export type LoginNavParamList = {
  RecoveryPhrases: undefined
  Login: undefined
  SignUp: undefined
}

const Stack = createNativeStackNavigator<LoginNavParamList>()

const LoginNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={Login}
      ></Stack.Screen>
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUp}
      ></Stack.Screen>
      <Stack.Screen
        name="RecoveryPhrases"
        component={RecoveryPhrases}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default LoginNav
