import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import ConnectionDetails from "@screens/Connection/ConnectionDetails"
import Contacts from "@screens/Connection/Contacts"
import CredentialProof from "@screens/Proof/CredentialProof"
import Credential from "@screens/Wallet/Credential"
import CredentialOffer from "@screens/Offer/CredentialOffer"
import Proof from "@screens/Proof/Proof"
import Communication from "@screens/Communication/Communication"

export type ContactStackParamList = {
  Contacts: undefined
  ConnectionDetails: {
    connection_id: string
  }
  CredentialOffer: {
    credential_offer_id: string
    connection_id: string
  }
  CredentialProof: {
    presentation_id: string
    connection_id: string
  }
  Credential: {
    credential_offer_id: string
    parentRoute: string
  }
  Proof: {
    preentation_id: string
    connection_id: string
  }
  Communication: {
    connection_id: string
    connection_name: string | undefined
  }
}

const ContactStack = createStackNavigator<ContactStackParamList>()

const ContactScreenStack: React.FC = () => {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen name="Contacts" component={Contacts} />
      <ContactStack.Screen
        name="ConnectionDetails"
        component={ConnectionDetails}
      />
      <ContactStack.Screen name="CredentialOffer" component={CredentialOffer} />
      <ContactStack.Screen name="CredentialProof" component={CredentialProof} />
      <ContactStack.Screen name="Credential" component={Credential} />
      <ContactStack.Screen name="Proof" component={Proof} />
      <ContactStack.Screen name="Communication" component={Communication} />
    </ContactStack.Navigator>
  )
}

export default ContactScreenStack
