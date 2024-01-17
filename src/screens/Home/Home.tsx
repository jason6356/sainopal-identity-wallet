import { useAgent } from "@aries-framework/react-hooks"
import useHideBottomTabBar from "@hooks/useHideBottomTabBar"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { StyleSheet, Text, View, ActivityIndicator } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ledgers } from "@agentStuff/agent"
import { Feather } from "@expo/vector-icons"
import { canConnectToLedgerNode, fetchLedgerNodes } from "@utils/ledger"

interface AlertBox {
  msg: string
}

export default function Home() {
  const [text, setText] = useState<string>("")
  const [resultsMap, setResultsMap] = useState(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const agent = useAgent()
  const navigation = useNavigation()

  useHideBottomTabBar()

  useEffect(() => {
    testNetworkConnectivity()
  }, [ledgers])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Network Status",
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  }, [navigation])

  async function testNetworkConnectivity() {
    const map = new Map()
    setIsLoading(true)

    for (const ledger of ledgers) {
      console.log(ledger.id)
      const nodes = fetchLedgerNodes(ledger.indyNamespace)

      try {
        const result = await checkNodesStatus(nodes)
        map.set(ledger.id, result)
        console.log(`Ledger ${ledger.id} is ${result}`)
      } catch (error) {
        console.error(`Error checking ledger ${ledger.id}: ${error.message}`)
        map.set(ledger.id, false) // Handle the error as needed
      }
    }
    console.log(map)
    setResultsMap(map)
    setIsLoading(false)
  }

  async function checkNodesStatus(nodes) {
    for (const node of nodes) {
      if (node.host !== undefined && !Number.isNaN(node.port)) {
        try {
          const result = await canConnectToLedgerNode(node)
          console.log(
            `Node at ${node.host}:${node.port} is ${
              result ? "reachable" : "not reachable"
            }`
          )
          return result
        } catch (error) {
          // Handle errors if necessary
          console.error(
            `Error checking node at ${node.host}:${node.port}: ${error.message}`
          )
          return false
        }
      } else {
        return false
      }
    }

    return false
  }

  function handleConnection(invitationUrl: string) {
    agent.agent.oob
      .receiveInvitationFromUrl(invitationUrl)
      .then((e) => console.log(e, " WORK LIAO"))
      .catch((e) => console.error(e, " HAILAT LIAO"))
  }

  function renderNetwork(network: any) {
    return (
      <View style={styles.networkContainer}>
        <Text style={styles.networkName}>{network.item["id"]}</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : resultsMap.get(network.item["id"]) ? (
          <Feather name="check-circle" size={24} color="green" />
        ) : (
          <Feather name="check-circle" size={24} color="red" />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Identity Ledger Connection Status</Text>
      </View>
      <View style={styles.networkListContainer}>
        <FlatList data={ledgers} renderItem={renderNetwork} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  networkListContainer: {
    //backgroundColor: "blue",
    marginTop: 20,
    borderRadius: 8,
  },
  networkContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#09182d",
    borderRadius: 8,
  },
  networkName: {
    alignItems: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
})
