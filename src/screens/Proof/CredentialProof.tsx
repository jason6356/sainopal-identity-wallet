import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect } from "react"
import { Button, Text, View } from "react-native"
import { ContactStackParamList } from "../../navigators/ContactStack"
import { useAgent, useProofById } from "@aries-framework/react-hooks"
import { AgentEventTypes, ProofState } from "@aries-framework/core"

type Props = StackScreenProps<ContactStackParamList, "CredentialProof">

const CredentialProof: React.FC<Props> = ({ navigation, route }: Props) => {
  const agent = useAgent()
  const { presentation_id } = route.params
  const proof = useProofById(presentation_id)

  useEffect(() => {
    console.log(proof)
  })

  async function acceptRequest(id: any) {
    await agent.agent.proofs.acceptRequest({
      proofRecordId: id,
    })
  }

  return (
    <View>
      {proof?.state === ProofState.RequestReceived ? (
        <Button
          title="Send Presentation"
          onPress={async () => {
            await acceptRequest(proof.id)
          }}
        />
      ) : (
        <Text>Cool</Text>
      )}
    </View>
  )
}

export default CredentialProof
