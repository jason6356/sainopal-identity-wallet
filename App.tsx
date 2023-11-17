import Login from "./src/screens/Auth/Login"
import { Agent } from "@aries-framework/core"
import AgentProvider from "@aries-framework/react-hooks"
import React, { useEffect, useState } from "react"
import { agent } from "./config"
import BottomNavigation from "./src/navigators/BottomNavigation"
import { GluestackUIProvider } from "@gluestack-ui/react"
import { createLinkSecretIfRequired } from "./config/agent"
import LoginNav from "./src/navigators/LoginNav"
import { NavigationContainer } from "@react-navigation/native"

const App: React.FC = () => {
  const [initializedAgent, setInitializedAgent] = useState<Agent<any> | null>(
    null
  )
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    async function initializeAgent() {
      try {
        await agent.initialize()
        await createLinkSecretIfRequired(agent)
        setInitializedAgent(agent)
      } catch (error) {
        console.error("Error initializing agent:", error)
      }
    }

    if (loggedIn) {
      initializeAgent()
    }
  }, [loggedIn])

  const handleLogin = async (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      setLoggedIn(true)
    }
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

export default App
