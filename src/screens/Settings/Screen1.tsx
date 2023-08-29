import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { SettingStackParamList } from "../../navigators/SettingStack"

type Props = StackScreenProps<SettingStackParamList, "BackUpWallet">

const NestedScreen1: React.FC<Props> = ({ navigation, route }: Props) => {
  const { msg } = route.params // Access the passed parameter

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>I am NestedScreen1</Text>
      <Text>{msg}</Text>
    </View>
  )
}

export default NestedScreen1

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000025",
  },
  text: {
    color: "#000",
    fontWeight: "700",
    fontSize: 30,
  },
})
