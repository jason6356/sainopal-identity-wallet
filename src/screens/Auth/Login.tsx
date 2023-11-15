// Login component in src/screens/Auth/Login.tsx

import React, { useState } from "react"
import { View, Text, TextInput, Button } from "react-native"

interface LoginProps {
  onLogin: (password: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    onLogin(password)
  }

  return (
    <View>
      <Text>Login</Text>
      <View>
        <Text>Password:</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  )
}

export default Login
