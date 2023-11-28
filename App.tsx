import React from "react";
import { StyleSheet } from "react-native";
import Main from "./Main";
import { AuthProvider } from "./context/AuthProvider";

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </>
  );
};
const styles = StyleSheet.create({
  image: {
    width: "30%",
    height: "30%",
    resizeMode: "contain",
  },
});

export default App;
