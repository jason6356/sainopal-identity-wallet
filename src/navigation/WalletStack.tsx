import useAgentEventListenerHook from "@hooks/useAgentEventListenerHook"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import Credential from "@screens/Wallet/Credential"
import SelfCredential from "@screens/Wallet/SelfCredential"
import Wallet from "@screens/Wallet/Wallet"
import React from "react"

type WalletStackProps = {}

export type WalletStackParamList = {
  Wallet: undefined
  Credential: {
    credential_offer_id: string
    parentRoute: string
  }
  SelfCredential: undefined
}

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletScreenStack: React.FC = () => {
  useAgentEventListenerHook()

  return (
    <WalletStack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    >
      <WalletStack.Screen name="Wallet" component={Wallet} />
      <WalletStack.Screen name="Credential" component={Credential} />
      <WalletStack.Screen name="SelfCredential" component={SelfCredential} />
    </WalletStack.Navigator>
  )
}

export default WalletScreenStack
