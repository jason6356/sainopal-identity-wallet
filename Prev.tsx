import {
  Agent,
  AgentEventTypes,
  AgentMessageReceivedEvent,
  CredentialEventTypes,
  CredentialState,
  CredentialStateChangedEvent,
  ProofEventTypes,
  ProofState,
  ProofStateChangedEvent,
} from "@aries-framework/core"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import {
  Alert,
  Button,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { agent } from "./config"
import {
  initializeStore,
  startRecordListeners,
} from "@aries-framework/redux-store"
import { $CombinedState } from "redux"
import { useAgent } from "@aries-framework/react-hooks"

const store = initializeStore(agent)
startRecordListeners(agent, store.store)

const state = store.store.getState()

export default function App() {
  const [isInitialized, setStatus] = useState<boolean>(false)

  useEffect(() => {
    if (!isInitialized) {
      agent.initialize().then(() => {
        Alert.alert("Agent initialized")
        createLinkSecretIfRequired(agent)
        setupCredentialListener(agent)
        setupProofListener(agent)
      })
      setStatus(true)
    }
  }, [isInitialized])

  const createLinkSecretIfRequired = async (agent: Agent) => {
    // If we don't have any link secrets yet, we will create a
    // default link secret that will be used for all anoncreds
    // credential requests.
    const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()
    if (linkSecretIds.length === 0) {
      await agent.modules.anoncreds.createLinkSecret({
        setAsDefault: true,
      })
    }
  }

  agent.events.on<AgentMessageReceivedEvent>(
    AgentEventTypes.AgentMessageReceived,
    (data) => {
      console.log(data.payload.message)
    }
  )

  function handlePress(event: GestureResponderEvent) {
    const invitationUrl = `http://10.123.10.107:4001?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiYWYyZWY0MTItOWMyZS00MzNiLThhNWQtMzJjNWI3YjFkZGI3IiwgImxhYmVsIjogIlRBUlVDIiwgInJlY2lwaWVudEtleXMiOiBbIkJrZWM4UmhuUVo1NE1FQUdWWWRKeldMRjZuOVE0ZVVVWFBiSnhZdmFpb3ZhIl0sICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cDovLzEwLjEyMy4xMC4xMDc6NDAwMSJ9`

    agent.oob
      .receiveInvitationFromUrl(invitationUrl)
      .then((e) => console.log(e))

    // agent.connections
    //   .getById("9eb0a064-a27d-4390-812b-0b116fb1a04e")
    //   .then((e) => console.log(e.theirLabel))
    //agent.connections.getAll().then((e) => console.log(e[0].id))
    // agent.credentials
    //   .getAll()
    //   .then((e) =>
    //     e
    //       .filter((e) => e.state === "done")
    //       .forEach((e) => console.log(JSON.stringify(e)))
    //   )

    // agent.credentials
    //   .getFormatData("c30b12c8-3fc0-4d54-be2f-cdf01b9cf06a")
    //   .then((e) => console.log(JSON.stringify(e.request)))

    // agent.proofs.getAll().then((e) => e.forEach((e) => console.log()))
    // agent.proofs
    //   .getCredentialsForRequest({
    //     proofRecordId: "8624b00b-0618-4785-b133-74393adc172b",
    //   })
    //   .then((e) => {
    //     console.log(JSON.stringify(e))
    //   })

    // agent.proofs
    //   .acceptRequest({
    //     proofRecordId: "94fa7785-1f5e-4c6f-9b19-b1a2b6b5ff1a",
    //   })
    //   .then((e) => console.log(e))

    // agent.credentials.proposeCredential({
    //   connectionId: "48562ed6-9ce4-40e0-ba8f-7c9d95b59366",
    //   protocolVersion: "v2",
    //   credentialFormats: {
    //     indy: {
    //       credentialDefinitionId: "NypRCRGykSwKUuRBQx2b9o:3:CL:44:diploma",
    //       attributes: [
    //         {
    //           name: "merit",
    //           value: "bad",
    //         },
    //         {
    //           name: "cgpa",
    //           value: "4",
    //         },
    //         {
    //           name: "course name",
    //           value: "skipped the proposal",
    //         },
    //       ],
    //     },
    //   },
    // })

    // agent.credentials
    //   .acceptOffer({
    //     credentialRecordId: "a51d4756-285f-499b-8863-e7ce3d7cb78e",
    //   })
    //   .then((e) => console.log(e))

    console.log("button pressed")
  }

  const setupCredentialListener = (holder: Agent) => {
    holder.events.on<CredentialStateChangedEvent>(
      CredentialEventTypes.CredentialStateChanged,
      async ({ payload }) => {
        switch (payload.credentialRecord.state) {
          case CredentialState.OfferReceived:
            console.log("received a credential")
            // custom logic here
            await holder.credentials.acceptOffer({
              credentialRecordId: payload.credentialRecord.id,
            })
          case CredentialState.RequestSent:
            console.log("Request Sent!")
          case CredentialState.CredentialReceived:
            console.log("storing to wallet")
            await holder.credentials.acceptCredential({
              credentialRecordId: payload.credentialRecord.id,
            })
          case CredentialState.Done:
            console.log(
              `Credential for credential id ${payload.credentialRecord.id} is accepted`
            )
        }
      }
    )
  }

  const setupProofListener = (holder: Agent) => {
    holder.events.on<ProofStateChangedEvent>(
      ProofEventTypes.ProofStateChanged,
      async ({ payload }) => {
        switch (payload.proofRecord.state) {
          case ProofState.RequestReceived:
            console.log("Request Received")
          case ProofState.Done:
            console.log("Proof Done")
        }
      }
    )
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button title="Press me " onPress={handlePress}></Button>
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
})
