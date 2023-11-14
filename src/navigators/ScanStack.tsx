import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Scan from "../screens/Scan/Scan";
import { ConnectionRecord } from "@aries-framework/core";
import ConnectionRequest from "../screens/Connection/ConnectionRequest";

type ScanStackProps = {};

export type ScanStackParamList = {
  Scan: undefined;
  ConnectionRequest: ConnectionRecord | undefined;
};

const ScanStack = createStackNavigator<ScanStackParamList>();

const ScanScreenStack: React.FC = () => {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen name="Scan" component={Scan} />
      <ScanStack.Screen
        name="ConnectionRequest"
        component={ConnectionRequest}
      />
    </ScanStack.Navigator>
  );
};

export default ScanScreenStack;
