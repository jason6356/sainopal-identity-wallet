import { OutOfBandInvitation } from "@aries-framework/core"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import React from "react"
import ConnectionRequest from "@screens/Connection/ConnectionRequest"
import Scan from "@screens/Scan/Scan"
import useAgentEventListenerHook from "@hooks/useAgentEventListenerHook"

type ScanStackProps = {}

type ConnectionRequestScreenProps = {
  inviteObj: OutOfBandInvitation
  url: string
}

export type ScanStackParamList = {
  Scan: undefined
  ConnectionRequest: ConnectionRequestScreenProps | undefined
  ContactStack: undefined
}

const ScanStack = createStackNavigator<ScanStackParamList>()

const ScanScreenStack: React.FC = () => {
  useAgentEventListenerHook()
  return (
    <ScanStack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    >
      <ScanStack.Screen
        name="Scan"
        component={Scan}
        options={{ headerShown: false }}
      />
      <ScanStack.Screen
        name="ConnectionRequest"
        component={ConnectionRequest}
        options={
          {
            // headerRight: () => <Text>Hello World</Text>,
            // headerLeft: () => <Text>Left</Text>,
            // headerTitle: () => <Text>Connection Request</Text>,
          }
        }
      />
    </ScanStack.Navigator>
  )
}

export default ScanScreenStack
