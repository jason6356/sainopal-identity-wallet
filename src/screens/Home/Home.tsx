import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native"
import { useState, useEffect } from "react"
import AgentService from "../../services/AgentService"
import { Buffer } from "buffer"
import axios from "axios"
import { useNavigation } from "@react-navigation/native"
import { useAgent } from "@aries-framework/react-hooks"
import React from "react"
interface AlertBox {
  msg: string
}

export default function Home() {
  const [text, setText] = useState<string>("")
  const agent = useAgent()
  const navigation = useNavigation()

  function handleConnection(invitationUrl: string) {
    agent.agent.oob
      .receiveInvitationFromUrl(invitationUrl)
      .then((e) => console.log(e, " WORK LIAO"))
      .catch((e) => console.error(e, " HAILAT LIAO"))
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Sainopal</Text>
      </View>

      <View style={styles.content}>
        <Text>Type Something Below To Test Something</Text>
        <TextInput
          style={styles.textInputStyle}
          multiline={true}
          textAlignVertical="top"
          onChangeText={setText}
          placeholder="Input Text Here"
        />
        <Button
          title="Click me to Alert"
          onPress={() => handleConnection(text)}
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  content: {
    marginTop: 20,
  },
  textInputStyle: {
    textAlign: "center",
    alignItems: "center",
  },
})
