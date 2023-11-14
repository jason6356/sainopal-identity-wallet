import React from "react";
import { Platform, Text, View, ViewStyle } from "react-native";
import { ConnectionRecord } from "@aries-framework/core";
import { StackScreenProps } from "@react-navigation/stack";
import { ScanStackParamList } from "../../navigators/ScanStack";

type Props = StackScreenProps<ScanStackParamList, "ConnectionRequest">;

export default function ConnectionRequest({ navigation, route }: Props) {
  const record = route.params;

  return (
    <View>
      <Text>This is connection detail page</Text>
      <Text>{JSON.stringify(record)}</Text>
    </View>
  );
}
