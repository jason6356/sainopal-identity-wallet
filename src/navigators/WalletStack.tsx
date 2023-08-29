import { createStackNavigator } from "@react-navigation/stack"
import Wallet from "../screens/Wallet/Wallet"

import React from "react"
import Credential from "../screens/Wallet/Credential"

type WalletStackProps = {}

export type WalletStackParamList = {
  Wallet: undefined
  Credential: {
    credential_offer_id: string
    credential_name: string
    schema_id: string
  }
}

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletScreenStack: React.FC = () => {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen name="Wallet" component={Wallet} />
      <WalletStack.Screen name="Credential" component={Credential} />
    </WalletStack.Navigator>
  )
}

export default WalletScreenStack
