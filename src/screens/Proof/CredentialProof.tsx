import {
  useAgent,
  useConnectionById,
  useProofById,
} from "@aries-framework/react-hooks"
import { ContactCard } from "@components/Card/ContactCard"
import { ContactStackParamList } from "@navigation/ContactStack"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import {
  MappedAttributes,
  RequestedAttributes,
  RequestedPredicate,
  getAttributesRequested,
  getAvailableCredentialsForProof,
  getPredicateFromFormatData,
  getProofFormatData,
  mapRequestAttributes,
} from "../../utils/proof"

type Props = StackScreenProps<ContactStackParamList, "CredentialProof">

const credentialImage = require("../../assets/degree.png")

const CredentialProof: React.FC<Props> = ({ navigation, route }: Props) => {
  const agent = useAgent()
  const { presentation_id, connection_id } = route.params
  const proof = useProofById(presentation_id)
  const connectionInvitation = useConnectionById(connection_id)
  const [proofFormatData, setProofFormatData] = useState<any>([])
  const [requestedAttributes, setRequestedAttributes] = useState<
    RequestedAttributes[]
  >([])
  const [mappedAttributes, setMappedAttributes] = useState<MappedAttributes[]>(
    []
  )
  const [predicate, setPredicate] = useState<RequestedPredicate[]>([])

  const [loading, setIsLoading] = useState(false)

  useEffect(() => {
    retrieveProofFormatData()
  }, [proof])

  async function retrieveProofFormatData() {
    const data = await getProofFormatData(agent.agent, presentation_id)
    const predicate = getPredicateFromFormatData(data)
    const attributesNeeded = getAttributesRequested(data)

    if (predicate.length > 0) {
      console.log("Predicate Type Credentials?")
      console.log(JSON.stringify(predicate))
      setPredicate(predicate)
    }

    if (attributesNeeded.length > 0) {
      console.log("Interesting")
      console.log(JSON.stringify(attributesNeeded))
      const availableCredentials = await getAvailableCredentialsForProof(
        agent.agent,
        presentation_id
      )
      const mappedAttributes = mapRequestAttributes(
        availableCredentials.proofFormats.indy.attributes,
        attributesNeeded
      )
      setRequestedAttributes(attributesNeeded)
      setMappedAttributes(mappedAttributes)
    }

    setProofFormatData(data)
  }

  async function acceptRequest(id: any) {
    setIsLoading(true)
    agent.agent.proofs
      .acceptRequest({
        proofRecordId: presentation_id,
      })
      .then((e) => {
        Alert.alert("Proof Sent!")
      })
      .catch((e) => {
        Alert.alert("Error", e.message)
      })
      .finally(() => {
        setIsLoading(false)
        navigation.goBack()
      })
  }

  async function declineRequest() {
    setIsLoading(true)
    agent.agent.proofs
      .declineRequest({
        proofRecordId: presentation_id,
      })
      .then((e) => {
        Alert.alert("Proof Declined!")
      })
      .catch((e) => {
        Alert.alert("Error", e.message)
      })
      .finally(() => {
        setIsLoading(false)
        navigation.goBack()
      })
  }

  async function selectCredential(id: any, format: any) {
    try {
      await agent.agent.proofs.selectCredentialsForRequest({
        proofRecordId: id,
        proofFormats: [format[0]],
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            An organization is asking for information.
          </Text>

          <ContactCard connectionInvitation={connectionInvitation} />

          {predicate.length > 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructions}>
                The organization would like to you to proof these information
              </Text>
            </View>
          )}

          {predicate.map((e, index) => (
            <View style={styles.card} key={index * 10}>
              <View style={styles.credentialHeader}>
                <View style={styles.leftContent}>
                  <Image
                    style={{ width: 70, height: 70 }}
                    source={credentialImage}
                  />
                </View>
                <View style={styles.rightContent}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {e.predicateName}
                  </Text>
                </View>
              </View>
              <View style={styles.credentialFormData}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{}}>{e.name}</Text>
                  <Text style={{}}>{e.predicate}</Text>
                  <Text style={{}}>{e.threshold}</Text>
                </View>
              </View>
            </View>
          ))}

          {mappedAttributes.length > 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructions}>
                The organization would like to verify these information
              </Text>
            </View>
          )}

          {mappedAttributes.map((e, i) => (
            <View style={styles.card} key={i}>
              <View style={styles.credentialHeader}>
                <View style={styles.leftContent}>
                  <Image
                    style={{ width: 70, height: 70 }}
                    source={credentialImage}
                  />
                </View>
                <View style={styles.rightContent}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {e.credential_name}
                  </Text>
                </View>
              </View>
              <View style={styles.credentialFormData}>
                {e.attributes.map((e, index) => (
                  <View key={index} style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%", paddingVertical: 5 }}>
                      <Text style={styles.credentialAttribute}>{e.name}</Text>
                    </View>
                    <View style={{ width: "50%", paddingVertical: 5 }}>
                      <Text style={styles.credentialValue}>{e.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          {loading ? (
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <>
              <TouchableHighlight onPress={acceptRequest}>
                <View style={styles.acceptButton}>
                  <Text style={styles.acceptText}>Send</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={declineRequest}>
                <View style={styles.declineButton}>
                  <Text style={styles.declineText}>Decline</Text>
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
    zIndex: 2, // Ensure it's above other elements
  },
  credentialHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#d3d3d3",
  },
  credentialFormData: {
    flexDirection: "column",
    width: "100%",
    padding: 10,
  },
  credentialAttribute: {
    fontSize: 15,
    color: "#808080",
  },
  credentialValue: {
    fontSize: 15,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  instructions: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
})
export default CredentialProof
