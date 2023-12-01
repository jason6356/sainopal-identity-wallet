import React from "react"
import { StyleSheet } from "react-native"
import Main from "./Main"
import { AuthProvider } from "./src/context/AuthProvider"
import { LogBox } from "react-native"

LogBox.ignoreAllLogs()

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
