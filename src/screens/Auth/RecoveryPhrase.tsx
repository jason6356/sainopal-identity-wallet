import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import NumberPad from "./components/NumberPad"
import { RouteProp, NavigationProp } from "@react-navigation/native"
import * as SQLite from "expo-sqlite"

type RootStackParamList = {
  RecoveryPhrases: undefined
  Login: undefined
}

type SignUpScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "RecoveryPhrases"
>

type SignUpScreenRouteProp = RouteProp<RootStackParamList, "RecoveryPhrases">

const db = SQLite.openDatabase("db.db")

const RecoveryPhrases: React.FC<{
  navigation: SignUpScreenNavigationProp
  route: SignUpScreenRouteProp
}> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>Sohai</Text>
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
})

export default RecoveryPhrases
