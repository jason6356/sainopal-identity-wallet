// LoginNav.tsx
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "./Login"
import SignUp from "./SignUp"

const Stack = createNativeStackNavigator()

const LoginNav = ({ onLogin, onDataFromLogin }: LoginNavProps) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => (
          <Login
            {...props}
            onLogin={onLogin}
            onDataFromLogin={onDataFromLogin}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUp}
      />
    </Stack.Navigator>
  )
}

export default LoginNav

interface LoginNavProps {
  onLogin: (password: string) => void
  //   onDataFromLogin: (data: any) => void // Define the type according to the data you want to pass
}
