import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import NumberPad from "./components/NumberPad"
import { RouteProp, NavigationProp } from "@react-navigation/native"
import * as SQLite from "expo-sqlite"

type RootStackParamList = {
  RecoveryPhrases: undefined
  Login: undefined
}

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, "Login">

type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">

const db = SQLite.openDatabase("db.db")

const Login: React.FC<{
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
  onLogin: (isLoggedIn: boolean) => void
}> = ({ navigation, route, onLogin }) => {
  const passwordLength = 6
  const [code, setCode] = useState<string>("")
  const pinInputRef = React.createRef<SmoothPinCodeInput>()

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user';",
        [],
        (_, { rows }) => {
          const tableExists = rows.length > 0

          if (!tableExists) {
            console.log("User table does not exist in sqlite")
            navigation.navigate("SignUp")
          } else {
            tx.executeSql("SELECT * FROM user;", [], (_, { rows }) => {
              const userData = rows._array
              console.log(userData)

              if (userData.length === 0) {
                console.log("User table has no data")
                navigation.navigate("SignUp")
              }
            })
          }
        }
      )
    })
  }, [navigation])

  const checkPinAndNavigate = () => {
    if (code.length === passwordLength) {
      onLogin(true)
    }
  }

  useEffect(() => {
    console.log("Code:", code)
    checkPinAndNavigate()
  }, [code])

  const onKeyPress = (value: number) => {
    setCode((prevCode) =>
      prevCode.length < passwordLength ? prevCode + value.toString() : prevCode
    )
  }

  const onDelete = () => {
    setCode((prevCode) => prevCode.slice(0, -1))
  }

  const handleForgotPin = () => {
    navigation.navigate("RecoveryPhrases")
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/login.png")} />
      <TouchableOpacity style={styles.forgotPin} onPress={handleForgotPin}>
        <Text style={styles.forgotPinText}>Forgot Your PIN?</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter PIN</Text>
      <View style={styles.formContainer}>
        <View style={styles.passCon}>
          <SmoothPinCodeInput
            ref={pinInputRef}
            placeholder={<View style={styles.pinPlaceholder}></View>}
            mask={<View style={styles.mask}></View>}
            maskDelay={1000}
            password={true}
            cellStyle={null}
            cellStyleFocused={null}
            codeLength={6}
            value={code}
            onTextChange={(code: React.SetStateAction<string>) => setCode(code)}
            autoFocus={false}
          />
        </View>
        <NumberPad onKeyPress={onKeyPress} onDelete={onDelete} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  image: {
    width: "55%",
    height: "40%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: -30,
    color: "#12283b",
  },
  formContainer: {
    width: "100%",
  },
  passCon: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pinPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 25,
    opacity: 0.3,
    backgroundColor: "#0c263e",
  },
  mask: {
    width: 16,
    height: 16,
    borderRadius: 25,
    backgroundColor: "#172c43",
  },
  forgotPin: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  forgotPinText: {
    color: "#12283b",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0c263e",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
})

export default Login
