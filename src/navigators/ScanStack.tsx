import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Scan from "../screens/Scan/Scan";
import { ConnectionRecord, OutOfBandInvitation } from "@aries-framework/core";
import ConnectionRequest from "../screens/Connection/ConnectionRequest";
import { Text } from "react-native";

type ScanStackProps = {};

type ConnectionRequestScreenProps = {
  inviteObj: OutOfBandInvitation;
  url: string;
};

export type ScanStackParamList = {
  Scan: undefined;
  ConnectionRequest: ConnectionRequestScreenProps | undefined;
  ContactStack: undefined;
};

const ScanStack = createStackNavigator<ScanStackParamList>();

const ScanScreenStack: React.FC = () => {
  return (
    <ScanStack.Navigator>
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
  );
};

export default ScanScreenStack;
