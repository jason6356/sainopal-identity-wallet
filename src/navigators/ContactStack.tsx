import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import ConnectionUI from "../screens/Connections/Contacts"
import Contacts from "../screens/Connections/Contacts"
import ConnectionDetails from "../screens/Connections/ConnectionDetails"
import CredentialOffer from "../screens/Offer/CredentialOffer"

export type ContactStackParamList = {
  Contacts: undefined
  ConnectionDetails: {
    connection_id: string
  }
  CredentialOffer: {
    credential_offer_id: string
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
    </ContactStack.Navigator>
  )
}

export default ContactScreenStack