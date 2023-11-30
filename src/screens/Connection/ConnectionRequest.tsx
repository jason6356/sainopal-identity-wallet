import { useAgent } from "@aries-framework/react-hooks"
import { MaterialIcons } from "@expo/vector-icons"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useLayoutEffect, useState } from "react"
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  ToastAndroid,
} from "react-native"
import { defaultUserAvatar } from "../../constants/constants"
import { ScanStackParamList } from "../../navigation/ScanStack"

type Props = StackScreenProps<ScanStackParamList, "ConnectionRequest">

export default function ConnectionRequest({ navigation, route }: Props) {
  const connectionInvitation = route.params?.inviteObj
  const inviteUrl = route.params?.url
  const agent = useAgent()
  const [loading, setIsLoading] = useState(false)

  function handleAccept() {
    if (inviteUrl) {
      setIsLoading(true)
      agent.agent.oob
        .receiveInvitationFromUrl(inviteUrl, {})
        .then((e) => {
          setIsLoading(false)
          ToastAndroid.show(
            "Successfully established Connection",
            ToastAndroid.LONG
          )
        })
        .catch((e) => {
          setIsLoading(false)
          ToastAndroid.show(
            `Error has occured : ${e.message}`,
            ToastAndroid.LONG
          )
        })
        .finally(() => {
          navigation.navigate("ContactsStack" as keyof ScanStackParamList)
          navigation.reset({
            index: 0,
            routes: [{ name: "Scan" }],
          })
        })
    }
  }

  useLayoutEffect(() => {
    //change header color to #09182d and text to white
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  })

  function handleDecline() {
    ToastAndroid.show(`Successfully Declined!`, ToastAndroid.LONG)
    navigation.navigate("ContactsStack" as keyof ScanStackParamList)
    navigation.reset({
      index: 0,
      routes: [{ name: "Scan" }],
    })
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Do you want to accept the new contact?</Text>
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Image
                style={{ width: 70, height: 70 }}
                source={{
                  uri: connectionInvitation?.imageUrl
                    ? connectionInvitation?.imageUrl
                    : defaultUserAvatar,
                }}
              />
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.connectionLabel}>
                {connectionInvitation?.label}
              </Text>
              <View>
                <Text style={styles.verifiedStatus}>
                  Contact is Verified
                  <MaterialIcons name="verified-user" size={14} color="green" />
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <TouchableHighlight onPress={handleAccept}>
              <View style={styles.acceptButton}>
                <Text style={styles.acceptText}>Accept</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={handleDecline}>
              <View style={styles.declineButton}>
                <Text style={styles.declineText}>Decline</Text>
              </View>
            </TouchableHighlight>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 30,
    padding: 20,
    lineHeight: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative", // Required for positioning the overlay
  },
  contentContainer: {
    flexDirection: "row",
    zIndex: 1, // Ensure content is above the overlay
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.2,
  },
  leftContent: {
    flexDirection: "row",
    paddingRight: 15,
    // borderStyle: "solid",
    // borderRightWidth: 0.5,
    // borderRightColor: "#333",
  },
  rightContent: {
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  connectionLabel: {
    textAlign: "left",
    fontSize: 18,
  },
  verifiedStatus: {
    marginTop: 10,
    fontSize: 14,
    color: "green",
  },
  notVerifiedStatus: {},
  buttonContainer: {
    width: "100%",
  },
  acceptButton: {
    backgroundColor: "#8CB1FF",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
    marginVertical: 5,
  },
  acceptText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
  declineButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "#8CB1FF",
    borderWidth: 1,
    borderStyle: "solid",
    height: 50,
    marginVertical: 5,
  },
  declineText: {
    textAlign: "center",
    color: "#8CB1FF",
    fontSize: 18,
  },
  activity: {
    ...StyleSheet.absoluteFillObject, // Make the activity indicator cover the entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure it's above other elements
  },
})
