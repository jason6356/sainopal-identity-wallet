import NumberPad from "@components/NumberPad/NumberPad"
import { useAuth } from "@context/AuthProvider"
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native"
import * as LocalAuthentication from "expo-local-authentication"
import React, { useEffect, useState } from "react"
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import LoginFailedTable from "../../models/LoginFailedTable"
import RecoveryPhraseTable from "../../models/RecoveryPhraseTable"
import UserTable from "../../models/UserTable"
import { LoginNavParamList } from "@navigation/LoginNav"


type LoginScreenNavigationProp = NavigationProp<LoginNavParamList, "Login">

type LoginScreenRouteProp = RouteProp<LoginNavParamList, "Login">


const Login: React.FC<{
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
}> = ({ navigation, route }) => {
  const passwordLength = 6
  const lockoutDuration = 180000 // 3 minutes in milliseconds
  const maxFailedAttempts = 3
  const [code, setCode] = useState<string>("")
  const pinInputRef = React.createRef<SmoothPinCodeInput>()
  const [password, setPassword] = useState<string>("")
  const { login }: any = useAuth()
  const [errorAnimation] = useState(new Animated.Value(0))
  const [loginFail, setLoginFailed] = useState<number>(0)
  const [pinLabelText, setPinLabelText] = useState<string>("Enter PIN")
  const [pinDisabled, setPinDisabled] = useState<boolean>(false)

  useFocusEffect(
    React.useCallback(() => {
      handleFailedLogin()

      UserTable.getAllUsers()
        .then((users) => {
          console.log("Users:", users)
        })
        .catch((error) => {
          console.error("Error fetching users:", error)
        })

      //dropTables() //<-For testing purpose  //remember comment it back when screen in signup

      UserTable.getPassword(
        (password) => {
          console.log("Retrieved Password:", password)
          setPassword(password)
          authenticate()
        },
        (error) => {
          navigation.navigate("SignUp")
        }
      )

      RecoveryPhraseTable.addPhrasesIfNotExist(() => {
        console.log("All phrases added successfully!")
      })

      RecoveryPhraseTable.getAllEncodedPhrasesArray((phrases) => {
        console.log("Retrieved Phrases:", phrases)
      })

      RecoveryPhraseTable.getAllPhrases((phrases) => {
        console.log("Retrieved Phrases:", phrases)
      })

      checkPinAndNavigate()
    }, [navigation])
  )

  useEffect(() => {
    console.log("Code:", code)
    checkPinAndNavigate()
  }, [code])

  async function handleFailedLogin(): Promise<void> {
    try {
      await LoginFailedTable.init()
      const lastFailedLogin = await LoginFailedTable.getLastFailedLogin()
      if (lastFailedLogin) {
        const elapsedTime =
          Date.now() - new Date(lastFailedLogin.timestamp).getTime()
        let remainingTime = lockoutDuration - elapsedTime

        const intervalId = setInterval(() => {
          if (remainingTime > 0) {
            setPinDisabled(true)

            const remainingMinutes = Math.floor(remainingTime / (60 * 1000))
            const remainingSeconds = Math.ceil(
              (remainingTime % (60 * 1000)) / 1000
            )

            const formattedMinutes = remainingMinutes
              .toString()
              .padStart(2, "0")
            const formattedSeconds = remainingSeconds
              .toString()
              .padStart(2, "0")

            setPinLabelText(`${formattedMinutes}:${formattedSeconds}`)

            remainingTime -= 1000
          } else {
            setPinDisabled(false)
            setPinLabelText("Enter PIN")
            clearInterval(intervalId)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Error fetching last failed login:", error)
    }
  }

  async function authenticate() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access sensitive info",
        disableDeviceFallback: true,
        fallbackLabel: "Use your device PIN",
        cancelLabel: "Cancel",
      })

      if (result.success) {
        login()
      }
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  async function dropTables() {
    await new Promise<void>((resolve, reject) => {
      RecoveryPhraseTable.dropTable(() => {
        console.log("RecoveryPhraseTable dropped successfully!")
        resolve()
      })
    })
    await new Promise<void>((resolve, reject) => {
      UserTable.dropTable(() => {
        console.log("UserTable dropped successfully!")
        resolve()
      })
    })
    console.log("All tables dropped successfully!")
  }

  const startErrorAnimation = () => {
    Animated.sequence([
      Animated.timing(errorAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(errorAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(errorAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const checkPinAndNavigate = async () => {
    console.log(password)

    if (code.length === passwordLength) {
      if (code === password) {
        login()
      } else {
        setCode("")
        startErrorAnimation()
        if (loginFail == 3) {
          setLoginFailed(0)
          setPinDisabled(true)
          LoginFailedTable.init().then(() => {
            console.log("LoginFailed table initialized successfully!")
          })
          LoginFailedTable.updateFailedLogin().catch((error) => {
            console.error("Error recording failed login:", error)
          })
          LoginFailedTable.getLastFailedLogin().then((lastFailedLogin) => {
            console.log("Last Failed Login:", lastFailedLogin)
          })
          handleFailedLogin()
        }
        if (loginFail <= 3) {
          setLoginFailed((prevAttempts) => prevAttempts + 1)
          console.log(loginFail)
          if (loginFail != 3) {
            Alert.alert(
              "Warning",
              `${
                maxFailedAttempts - loginFail
              } more attempts else will get blocked.`
            )
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
        errorAnimation.setValue(0)
      }
    }
  }

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
      <TouchableOpacity style={styles.forgotPin} onPress={handleForgotPin}>
        <Text style={styles.forgotPinText}>Forgot Your PIN?</Text>
      </TouchableOpacity>
      <Image style={styles.image} source={require("../../assets/login.png")} />
      <Animated.Text
        style={[
          styles.title,
          {
            color: pinDisabled
              ? "red"
              : errorAnimation.interpolate({
                  inputRange: [0, 10],
                  outputRange: ["#12283b", "red"],
                }),
          },
        ]}
      >
        {pinDisabled ? pinLabelText : "Enter PIN"}
      </Animated.Text>
      {!pinDisabled && (
        <TouchableOpacity style={styles.forgotPin} onPress={handleForgotPin}>
          <Text style={styles.forgotPinText}>Forgot Your PIN?</Text>
        </TouchableOpacity>
      )}
      <Animated.View
        style={[
          styles.formContainer,
          {
            transform: [
              {
                translateX: errorAnimation.interpolate({
                  inputRange: [0, 10],
                  outputRange: [0, 10],
                }),
              },
              {
                translateY: errorAnimation.interpolate({
                  inputRange: [0, 10],
                  outputRange: [0, 10],
                }),
              },
            ],
            display: pinDisabled ? "none" : "flex",
          },
        ]}
      >
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
      </Animated.View>
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
