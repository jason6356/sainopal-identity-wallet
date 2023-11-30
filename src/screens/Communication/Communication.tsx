import {
  BasicMessageRecord,
  BasicMessageRole,
  CredentialExchangeRecord,
  CredentialState,
  ProofExchangeRecord,
  ProofState,
} from "@aries-framework/core"
import {
  useAgent,
  useBasicMessagesByConnectionId,
  useConnectionById,
  useCredentialsByConnectionId,
  useProofsByConnectionId,
} from "@aries-framework/react-hooks"
import {
  CredentialOfferCard,
  PresentationDoneCard,
  PresentationOfferCard,
} from "@components/Card"
import { CredentialReceivedCard } from "@components/Card/CredentialReceivedCard"
import { Message } from "@components/MessageBubble/Message"
import useHideBottomTabBar from "@hooks/useHideBottomTabBar"
import { useIsFocused } from "@react-navigation/native"
import { getProofNameFromID } from "@utils/proof"
import { getSchemaNameFromOfferID } from "@utils/schema"
import * as SQLite from "expo-sqlite"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

const db = SQLite.openDatabase("db.db")

type CommunicationProps = {
  navigation: { setOptions: (options: { title: string }) => void }
  route: { params: { connection_id: string; connection_name: string } }
}

type ReceivedMessages =
  | CredentialExchangeRecord
  | BasicMessageRecord
  | ProofExchangeRecord

const Communication: React.FC<CommunicationProps> = ({ navigation, route }) => {
  const { connection_id, connection_name } = route.params
  const [message, setMessage] = useState("")
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessages[]>(
    []
  )
  const isFocused = useIsFocused()
  const flatListRef = useRef<FlatList<ReceivedMessages>>(null)
  const [displayedDates, setDisplayedDates] = useState<string[]>([])
  const basicMessages = useBasicMessagesByConnectionId(connection_id)

  const connection = useConnectionById(connection_id)
  const credentialsOffer: CredentialExchangeRecord[] =
    useCredentialsByConnectionId(connection_id)
  const presentationOffer = useProofsByConnectionId(connection_id)
  const agent = useAgent()
  const [credentialMap, setCredentialMap] = useState(new Map())
  const [proofMap, setProofMap] = useState(new Map())

  useHideBottomTabBar()

  const mapCredentials = async () => {
    const newCredentialMap = new Map()

    for (const e of credentialsOffer) {
      const name = await getSchemaNameFromOfferID(agent.agent, e.id)
      newCredentialMap.set(e.id, name)
    }

    setCredentialMap(newCredentialMap)
  }

  const mapProofs = async () => {
    const newProofsMap = new Map()

    for (const e of presentationOffer) {
      const name = await getProofNameFromID(agent.agent, e.id)
      newProofsMap.set(e.id, name)
    }

    setProofMap(newProofsMap)
  }

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

  useEffect(() => {
    setReceivedMessages(() =>
      [...basicMessages, ...credentialsOffer, ...presentationOffer].reverse()
    )
    console.log("Received messages:", receivedMessages)
  }, [
    basicMessages,
    credentialsOffer,
    presentationOffer,
    isFocused,
    connection_id,
  ])

  useEffect(() => {
    mapCredentials()
    mapProofs()
  }, [credentialsOffer, presentationOffer, connection_id])

  const isSentMessage = (role: BasicMessageRole) =>
    role === BasicMessageRole.Sender

  const handleSendMessage = async () => {
    try {
      await agent.agent.basicMessages.sendMessage(connection_id, message)
      console.log(agent.agent.config)
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
    item: ReceivedMessages
    index: number
  }) => {
    const currentDate = formatTime(item.sentTime)
    index > 0 ? formatTime(receivedMessages[index - 1].sentTime) : null

    console.log(item)

    // Check if the date has already been displayed
    const isDateDisplayed = displayedDates.includes(currentDate)

    if (item instanceof CredentialExchangeRecord) {
      if (item.state === CredentialState.OfferReceived) {
        return (
          <CredentialOfferCard
            key={index}
            credentialExchangeRecord={item}
            name={credentialMap.get(item.id)}
            navigation={navigation}
          />
        )
      } else if (item.state === CredentialState.Done) {
        return (
          <CredentialReceivedCard
            key={item.id.toUpperCase()}
            id={item.id}
            name={credentialMap.get(item.id)}
            navigation={navigation}
          />
        )
      } else {
        return <></>
      }
    }

    if (item instanceof ProofExchangeRecord) {
      if (item.state === ProofState.RequestReceived) {
        return (
          <PresentationOfferCard
            key={item.id}
            proofExchangeRecord={item}
            name={proofMap.get(item.id)}
            navigation={navigation}
          />
        )
      } else if (item.state === ProofState.Done) {
        return (
          <PresentationDoneCard
            key={item.id}
            id={item.id}
            name={proofMap.get(item.id)}
            navigation={navigation}
            proofExchangeRecord={item}
          />
        )
      } else {
        return <></>
      }
    }
    return <Message item={item} />
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
    await agent.agent.basicMessages.sendMessage(connection_id, message)
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.messageList}
        data={receivedMessages}
        keyExtractor={(item) => item.id}
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
    marginBottom: 20,
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
