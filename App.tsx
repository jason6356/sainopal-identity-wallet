import React, { useEffect, useState } from "react"
import { ActivityIndicator, View, Image, StyleSheet } from "react-native"
import { Agent } from "@aries-framework/core"
import {
  createLinkSecretIfRequired,
  getAgent,
  getAgentConfig,
  recoveryPhraseLocal,
  walletLocal,
} from "./config"
import AgentProvider from "@aries-framework/react-hooks"
import BottomNavigation from "./src/navigators/BottomNavigation"
import LoginNav from "./src/navigators/LoginNav"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider, useAuth } from "./context/AuthProvider"
import Main from "./Main"

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <Main />
      </AuthProvider>
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
