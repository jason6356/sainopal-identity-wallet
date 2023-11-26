import React, { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import * as LocalAuthentication from "expo-local-authentication"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function authenticate() {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to access sensitive info",
          disableDeviceFallback: true, 
          fallbackLabel: "Use your device PIN",
          cancelLabel: "Cancel",
        })

        setIsAuthenticated(result.success)
      } catch (error) {
        console.error("Authentication error:", error)
      }
    }
    authenticate()
  }, [])

  return (
    <View style={styles.container}>
      <Text>
        {isAuthenticated
          ? "Here's some sensitive info!"
          : "Uh oh! Access Denied"}
      </Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
