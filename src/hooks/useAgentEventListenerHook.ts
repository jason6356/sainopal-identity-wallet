import {
  CredentialEventTypes,
  CredentialState,
  ProofEventTypes,
  ProofState,
} from "@aries-framework/core"
import { useAgent } from "@aries-framework/react-hooks"
import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"

export default function useAgentEventListenerHook() {
  const navigation = useNavigation()
  const agent = useAgent()

  useEffect(() => {
    const cleanupFns: { (): void; (): void }[] = []

    const credentialStateChangedHandler = async ({ payload }) => {
      switch (payload.credentialRecord.state) {
        case CredentialState.OfferReceived:
          console.log("received a credential")
          navigation.navigate("CredentialOffer", {
            credential_offer_id: payload.credentialRecord.id,
            connection_id: payload.credentialRecord.connectionId,
          })
        case CredentialState.Done:
          console.log(
            `Credential for credential id ${payload.credentialRecord.id} is accepted`
          )
      }
    }
    agent.agent.events.on(
      CredentialEventTypes.CredentialStateChanged,
      credentialStateChangedHandler
    )
    cleanupFns.push(() =>
      agent.agent.events.off(
        CredentialEventTypes.CredentialStateChanged,
        credentialStateChangedHandler
      )
    )

    const proofStateChangedHandler = async ({ payload }) => {
      switch (payload.proofRecord.state) {
        case ProofState.RequestReceived:
          console.log("received a proof request")
          navigation.navigate("CredentialProof", {
            presentation_id: payload.proofRecord.id,
            connection_id: payload.proofRecord.connectionId,
          })
      }
    }
    agent.agent.events.on(
      ProofEventTypes.ProofStateChanged,
      proofStateChangedHandler
    )
    cleanupFns.push(() =>
      agent.agent.events.off(
        ProofEventTypes.ProofStateChanged,
        proofStateChangedHandler
      )
    )

    console.log("Event Listener Has Setup!")
    return () => {
      cleanupFns.forEach((cleanup) => {
        console.log("Cleanning Up the Event Listeners")
        cleanup()
      })
    }
  }, [agent.agent, navigation])
}
