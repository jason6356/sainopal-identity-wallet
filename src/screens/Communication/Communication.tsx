import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native"
import { useAgent } from "@aries-framework/react-hooks"
import { agent } from "../../../config/agent"
import {
  useBasicMessages,
  useBasicMessagesByConnectionId,
} from "@aries-framework/react-hooks"
import { useIsFocused } from "@react-navigation/native"
import { BasicMessageRecord, BasicMessageRole } from "@aries-framework/core"
import Icon from "react-native-vector-icons/FontAwesome"
import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase("db.db")

type CommunicationProps = {
  navigation: { setOptions: (options: { title: string }) => void }
  route: { params: { connection_id: string; connection_name: string } }
}

const Communication: React.FC<CommunicationProps> = ({ navigation, route }) => {
  const { connection_id, connection_name } = route.params
  const [message, setMessage] = useState("")
  const [receivedMessages, setReceivedMessages] = useState<
    BasicMessageRecord[]
  >([])
  const agentInstance = useAgent()
  const isFocused = useIsFocused()
  const flatListRef = useRef<FlatList<BasicMessageRecord>>(null)
  const [displayedDates, setDisplayedDates] = useState<string[]>([])
  const basicMessages = useBasicMessagesByConnectionId(connection_id)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connection_name,
      headerStyle: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
      headerTintColor: "black",
      headerTitleStyle: {
        fontSize: 18,
        color: "black",
        alignItems: "center",
        justifyContent: "center",
      },
      headerBackTitleStyle: {
        fontWeight: "bold",
      },
    })
  }, [navigation, connection_name, isFocused])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connection_name,
    })
  }, [navigation, connection_name, isFocused])

  useEffect(() => {
    setReceivedMessages((prevMessages) => [...basicMessages].reverse())
  }, [basicMessages, isFocused])

  const isSentMessage = (role: BasicMessageRole) =>
    role === BasicMessageRole.Sender

  const handleSendMessage = async () => {
    try {
      await agent.basicMessages.sendMessage(connection_id, message)
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatTime = (sentTime: string) => {
    const date = new Date(sentTime)
    const hours = date.getUTCHours() + 8
    const minutes = date.getMinutes()
    const amOrPm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12

    return `${formattedHours}:${minutes} ${amOrPm}`
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: BasicMessageRecord
    index: number
  }) => {
    const currentDate = formatTime(item.sentTime)
    const previousDate =
      index > 0 ? formatTime(receivedMessages[index - 1].sentTime) : null

    // Check if the date has already been displayed
    const isDateDisplayed = displayedDates.includes(currentDate)

    return (
      <View>
        {/* Display the date separator only once for each date */}
        {!isDateDisplayed && (index === 0 || currentDate !== previousDate) && (
          <Text style={styles.dateSeparator}></Text>
        )}

        <View
          style={[
            styles.messageContainer,
            isSentMessage(item.role) && styles.sentMessageContainer,
            !isSentMessage(item.role) && styles.receivedMessageContainer,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentMessage(item.role) && styles.sentMessageText,
              !isSentMessage(item.role) && styles.receivedMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={
              isSentMessage(item.role)
                ? styles.senderTimeText
                : styles.receiverTimeText
            }
          >
            {formatTime(item.sentTime)}
          </Text>
        </View>
      </View>
    )
  }

  const plusButton = async () => {
    let message = ""

    const readSelfCredential = new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM selfCredential WHERE id=?",
            [1],
            (_, result) => {
              const dataRows = (result.rows && result.rows._array) || []

              if (dataRows.length > 0) {
                const { name, email } = dataRows[0]
                message += `Name: ${name}\nEmail: ${email}\n`
                resolve()
              }
            },
            (error) => {
              console.log(
                "Error reading from selfCredential table: " + error.message
              )
              reject(error)
            }
          )
        },
        (error) => {
          console.log("Transaction Error: " + error.message)
          reject(error)
        }
      )
    })

    const readHardSkills = new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM hardSkills WHERE selfCredentialId=?",
            [1],
            (_, result) => {
              const dataRows = (result.rows && result.rows._array) || []

              dataRows.forEach((row) => {
                message += `Skill: ${row.value}\n`
              })

              resolve()
            },
            (error) => {
              console.log(
                "Error reading from hardSkills table: " + error.message
              )
              reject(error)
            }
          )
        },
        (error) => {
          console.log("Transaction Error: " + error.message)
          reject(error)
        }
      )
    })

    // Wait for both transactions to complete before sending the message
    await Promise.all([readSelfCredential, readHardSkills])

    console.log("Combined data:", message)

    // Send the message after both transactions have completed
    await agent.basicMessages.sendMessage(connection_id, message)
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.messageList}
        data={receivedMessages}
        keyExtractor={(item) => item.sentTime}
        renderItem={renderItem}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <Icon
          name="plus"
          size={20}
          color="#64737c"
          style={styles.icon}
          onPress={plusButton}
        />
        <TextInput
          style={styles.input}
          placeholder="Type message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={handleSendMessage} color="#64737c" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#128C7E",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  receivedMessageContainer: {
    backgroundColor: "#f0f1f5",
    borderRadius: 20,
    marginBottom: 8,
    padding: 10,
    maxWidth: "70%",
    alignSelf: "flex-start",
  },
  receivedMessageText: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 120,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffffff",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  messageContainer: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 10,
    maxWidth: "70%",
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  sentMessageText: {
    color: "black",
  },

  senderTimeText: {
    fontSize: 14,
    color: "#555",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  receiverTimeText: {
    fontSize: 14,
    color: "#555",
    alignSelf: "flex-start",
  },
  dateSeparator: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
    color: "#888",
  },
})

export default Communication
