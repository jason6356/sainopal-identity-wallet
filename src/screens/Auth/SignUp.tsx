import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import NumberPad from "./components/NumberPad"
import { RouteProp, NavigationProp } from "@react-navigation/native"
import * as SQLite from "expo-sqlite"
import UserTable from "../../../sqlite/userTable"
import { encode, decode } from "base-64"

type RootStackParamList = {
  SignUp: undefined
  Login: undefined
}

type SignUpScreenNavigationProp = NavigationProp<RootStackParamList, "SignUp">

type SignUpScreenRouteProp = RouteProp<RootStackParamList, "SignUp">

const db = SQLite.openDatabase("db.db")

const SignUp: React.FC<{
  navigation: SignUpScreenNavigationProp
  route: SignUpScreenRouteProp
}> = ({ navigation, route }) => {
  const passwordLength = 6
  const [firstCode, setFirstCode] = useState<string>("")
  const [secondCode, setSecondCode] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const pinInputRef = React.createRef<SmoothPinCodeInput>()

  const logUserData = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from user;", [], (_, { rows }) => {
        console.log("User Data:", rows._array)
      })
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      logUserData()
    })
    return unsubscribe
  }, [navigation])

  const checkPinAndNavigate = () => {
    if (step === 1 && firstCode.length === passwordLength) {
      setStep(2)
    } else if (step === 2 && secondCode.length === passwordLength) {
      if (firstCode === secondCode) {
        const uniqueIdentifier = `${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}`
        const walletName = `imported_wallet_${uniqueIdentifier}`
        const encodedData = encode(secondCode)
        UserTable.storeUserData(encodedData, walletName)
        navigation.navigate("Login")
      } else {
        setFirstCode("")
        setSecondCode("")
        setStep(1)
        alert("PIN entries do not match. Please try again.")
      }
    }
  }

  useEffect(() => {
    console.log("First Code:", firstCode)
    console.log("Second Code:", secondCode)
    checkPinAndNavigate()
  }, [firstCode, secondCode])

  const onKeyPress = (value: number) => {
    if (step === 1) {
      setFirstCode((prevCode) =>
        prevCode.length < passwordLength
          ? prevCode + value.toString()
          : prevCode
      )
    } else {
      setSecondCode((prevCode) =>
        prevCode.length < passwordLength
          ? prevCode + value.toString()
          : prevCode
      )
    }

    console.log(firstCode.toString(), "==", secondCode)
  }

  const onDelete = () => {
    if (step === 1) {
      setFirstCode((prevCode) => prevCode.slice(0, -1))
    } else {
      setSecondCode((prevCode) => prevCode.slice(0, -1))
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/signUp.png")} />
      <TouchableOpacity
        style={styles.forgotPin}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.forgotPinText}>Back to Login</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {step === 1 ? "Enter New PIN" : "Confirm New PIN"}
      </Text>
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
            value={step === 1 ? firstCode : secondCode}
            onTextChange={(code: React.SetStateAction<string>) =>
              step === 1 ? setFirstCode(code) : setSecondCode(code)
            }
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

export default SignUp
