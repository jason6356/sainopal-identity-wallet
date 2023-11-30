import { Agent } from "@aries-framework/core"
import AgentProvider from "@aries-framework/react-hooks"
import BottomNavigation from "@navigation/BottomNavigation"
import LoginNav from "@navigation/LoginNav"
import { NavigationContainer } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import {
  createLinkSecretIfRequired,
  getAgent,
  getAgentConfig,
  recoveryPhraseLocal,
  walletLocal,
} from "./config"
import { useAuth } from "./context/AuthProvider"

const Main: React.FC = () => {
  const [initializedAgent, setInitializedAgent] = useState<Agent<any> | null>(
    null
  )

  const { loggedIn, login, logout }: any = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log(`Testing Context Var loggedIn: ${loggedIn}`)
    async function initializeAgent() {
      try {
        setLoading(true)
        const id = await walletLocal()
        const recoveryPhrase = await recoveryPhraseLocal()
        const config = getAgentConfig(id, recoveryPhrase)
        const agent = getAgent(config)
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
      login()
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

export default Main
