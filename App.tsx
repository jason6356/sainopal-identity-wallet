import React, { useEffect, useState } from "react"
import { ActivityIndicator, View, Image, StyleSheet } from "react-native"
import { Agent } from "@aries-framework/core"
import { agent, createLinkSecretIfRequired } from "./config/agent"
import AgentProvider from "@aries-framework/react-hooks"
import BottomNavigation from "./src/navigators/BottomNavigation"
import LoginNav from "./src/navigators/LoginNav"
import { NavigationContainer } from "@react-navigation/native"

const App: React.FC = () => {
  const [initializedAgent, setInitializedAgent] = useState<Agent<any> | null>(
    null
  )
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function initializeAgent() {
      try {
        // Set loading to false when initialization is complete
        await agent.initialize()
        await createLinkSecretIfRequired(agent)
        setInitializedAgent(agent)
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      } catch (error) {
        console.error("Error initializing agent:", error)
      } finally {
      }
    }

    if (loggedIn) {
      initializeAgent()
    }
  }, [loggedIn])

  const handleLogin = async (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      setLoggedIn(true)
      setLoading(true)
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#09182d",
        }}
      >
        <Image
          style={styles.image}
          source={require("./src/assets/logo2.png")}
        />
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }

  return (
    <>
      {!loggedIn ? (
        <NavigationContainer>
          <LoginNav onLogin={handleLogin} />
        </NavigationContainer>
      ) : (
        initializedAgent && (
          <AgentProvider agent={initializedAgent}>
            <BottomNavigation />
          </AgentProvider>
        )
      )}
    </>
  )
}
const styles = StyleSheet.create({
  image: {
    width: "30%",
    height: "30%",
    resizeMode: "contain",
  },
})

export default App
