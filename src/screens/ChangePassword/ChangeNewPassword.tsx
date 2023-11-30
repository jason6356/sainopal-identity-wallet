import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import { useAuth } from "../../../context/AuthProvider"
import UserTable from "../../../sqlite/userTable"
import { SettingStackParamList } from "../../navigators/SettingStack"
import NumberPad from "../Auth/components/NumberPad"

type Props = StackScreenProps<SettingStackParamList, "ChangeNewPassword">

const ChangeNewPassword = ({ navigation }: Props) => {
  const passwordLength = 6
  const [firstCode, setFirstCode] = useState<string>("")
  const [secondCode, setSecondCode] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const pinInputRef = React.createRef<SmoothPinCodeInput>()
  const { logout }: any = useAuth()

  const checkPinAndNavigate = () => {
    if (step === 1 && firstCode.length === passwordLength) {
      setStep(2)
    } else if (step === 2 && secondCode.length === passwordLength) {
      if (firstCode === secondCode) {
        const uniqueIdentifier = `${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}`
        const walletName = `imported_wallet_${uniqueIdentifier}`
        UserTable.updatePassword(secondCode)
        alert("Password Changed Successfully! Kindly Login Again.")
        logout()
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

export default ChangeNewPassword
