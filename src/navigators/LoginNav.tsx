// LoginNav.tsx
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../screens/Auth/Login"
// import SignUp from "../screens/Auth/SignUp"
import RecoveryPhrases from "../screens/Auth/RecoveryPhrase"
const Stack = createNativeStackNavigator()

const LoginNav = ({ onLogin }: LoginNavProps) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="RecoveryPhrases">
        {(props) => <RecoveryPhrases {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default LoginNav

interface LoginNavProps {
  onLogin: (isLoggedIn: boolean) => void
}
