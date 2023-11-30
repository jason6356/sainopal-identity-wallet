import { BasicMessageRecord, BasicMessageRole } from "@aries-framework/core"
import React, { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

type MessageProps = {
  item: BasicMessageRecord
}

export function Message({ item }: MessageProps) {
  const isSentMessage = (role: BasicMessageRole) =>
    role === BasicMessageRole.Sender

  const formatTime = (sentTime: string) => {
    const date = new Date(sentTime)
    const hours = date.getUTCHours() + 8
    const minutes = date.getMinutes()
    const amOrPm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12

    return `${formattedHours}:${minutes} ${amOrPm}`
  }

  useEffect(() => {
    console.log(item)
  })

  return (
    <View>
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
