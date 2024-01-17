import TcpSocket from "react-native-tcp-socket"
import { ledgers } from "@agentStuff/agent"
import { GenesisTransaction } from "../types/genesis"

export const canConnectToLedgerNode = async (node: {
  host: string
  port: number
}): Promise<boolean> =>
  new Promise((resolve) => {
    const socketTimeoutInMs = 3000
    console.log(`Testing with IP ${node.host}:${node.port}`)
    const client = TcpSocket.createConnection(node, () => {
      console.log("yay it works")
      resolve(true)
      client.destroy()
    })

    // Other events that can be safely be ignored. See the
    // library for more details:
    // https://www.npmjs.com/package/react-native-tcp-socket

    client.on("error", () => {
      console.log("I cannot reach leh cb")
      client.destroy()
      resolve(false)
    })

    client.on("timeout", () => {
      console.log("i see you too slow my guy")
      client.destroy()
      client.removeAllListeners()

      resolve(false)
    })

    client.setTimeout(socketTimeoutInMs)
  })

export const fetchLedgerNodes = (
  indyNamespace = "i2hub-von-network"
): Array<{ host: string; port: number }> => {
  const [pool] = ledgers.filter((p) => p.indyNamespace === indyNamespace)
  if (!pool) {
    return []
  }

  const genesisTransactionsAsString = pool.genesisTransactions
  let genesisTransactions: Array<GenesisTransaction> = []

  if (genesisTransactionsAsString) {
    try {
      genesisTransactions = genesisTransactionsAsString
        .split("\n")
        .map((g) => JSON.parse(g))
    } catch (error: unknown) {
      return []
    }
  }

  const nodes = genesisTransactions.map((g) => {
    return {
      host: g.txn.data.data.client_ip,
      port: parseInt(g.txn.data.data.client_port),
    }
  })

  return nodes
}
