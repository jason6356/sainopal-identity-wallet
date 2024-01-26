import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
} from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"
import { AskarModule } from "@aries-framework/askar"
import type { InitConfig } from "@aries-framework/core"
import {
  Agent,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  LogLevel,
  MediationRecipientModule,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  WsOutboundTransport,
} from "@aries-framework/core"
import { ariesAskar } from "@hyperledger/aries-askar-react-native"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  IndyVdrPoolConfig,
  IndyVdrSovDidResolver,
} from "@aries-framework/indy-vdr"
import { indyVdr } from "@hyperledger/indy-vdr-react-native"
// import {
//   IndySdkAnonCredsRegistry,
//   IndySdkIndyDidResolver,
//   IndySdkModule,
//   IndySdkPoolConfig,
// } from "@aries-framework/indy-sdk"
import { agentDependencies } from "@aries-framework/react-native"
import { anoncreds } from "@hyperledger/anoncreds-react-native"
import * as SQLite from "expo-sqlite"
//import indySdk from "indy-sdk-react-native"
import { genesis } from "./genesis"
import _ledger from "./ledger.json"

const poolConfig = {
  indyNamespace: "",
  id: "i2hub-von-network", // <----<<< as shown here
  genesisTransactions: genesis,
  isProduction: false,
}

const ledgers: any = _ledger
ledgers.push(poolConfig)

const db = SQLite.openDatabase("db.db")

const mediatorInvitationUrl = `https://public.mediator.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMDVlYzM5NDItYTEyOS00YWE3LWEzZDQtYTJmNDgwYzNjZThhIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL3B1YmxpYy5tZWRpYXRvci5pbmRpY2lvdGVjaC5pbyIsICJyZWNpcGllbnRLZXlzIjogWyJDc2dIQVpxSktuWlRmc3h0MmRIR3JjN3U2M3ljeFlEZ25RdEZMeFhpeDIzYiJdLCAibGFiZWwiOiAiSW5kaWNpbyBQdWJsaWMgTWVkaWF0b3IifQ==`
//const localMediatorUrl = `https://1f6e-103-52-192-245.ngrok.io?c_i=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwgIkBpZCI6ICJjYWJjYWQwYS1mZjI1LTQxZjItYTNlZC1jMWEzMWU1NmEyMDAiLCAic2VydmljZUVuZHBvaW50IjogImh0dHBzOi8vMWY2ZS0xMDMtNTItMTkyLTI0NS5uZ3Jvay5pbyIsICJsYWJlbCI6ICJNZWRpYXRvciIsICJyZWNpcGllbnRLZXlzIjogWyJCUUxrU1A3ckQ4Tjh0WHFiUnZ4RzNKbnhvOE5pUm5LWGZ2ajM4ZW0yc1RiVCJdfQ==`

let userTableName: string = ""
let recoveryPhrase: string = ""
let config: InitConfig | null = null
let agent: Agent | null = null

async function walletLocal(): Promise<string> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM user;", [], (_, { rows }) => {
        const userData = rows._array
        console.log(userData, "HERE?")
        const wordsOnly = userData.map((item) => item.wallet)
        const pass = userData.map((item) => item.password)
        const wordsString = wordsOnly.join(" ")
        console.log("Wallet agent :", wordsString)
        userTableName = wordsString
        resolve(wordsString)
      })
    })
  })
}

async function recoveryPhraseLocal(): Promise<string> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any = rows._array
        const wordsOnly = recoveryPhraseData.map(
          (item: { word: any }) => item.word
        )
        const wordsString = wordsOnly.join(" ")
        console.log("Wallet Key(Recovery Phrase) :", wordsString)
        resolve(wordsString)
      })
    })
  })
}

function getAgentConfig(
  name: string,
  recoveryPhraseWallet: string
): InitConfig {
  config = {
    label: "SainoPal Mobile Wallet",
    walletConfig: {
      id: name ? name : "sainopal-wallet",
      key: recoveryPhraseWallet,
    },
    logger: new ConsoleLogger(LogLevel.trace),
  }
  return config
}

function getAgent(config: InitConfig) {
  const indyProofFormat = new LegacyIndyProofFormatService()

  agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({
        ariesAskar,
      }),
      mediationRecipient: new MediationRecipientModule({
        mediatorInvitationUrl,
      }),
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: ledgers,
      }),
      // indySdk: new IndySdkModule({
      //   indySdk,
      //   networks: ledgers,
      // }),
      anoncredsRs: new AnonCredsRsModule({ anoncreds }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry()],
      }),
      dids: new DidsModule({
        resolvers: [new IndyVdrSovDidResolver(), new IndyVdrIndyDidResolver()],
      }),
      credentials: new CredentialsModule({
        credentialProtocols: [
          new V1CredentialProtocol({
            indyCredentialFormat: new LegacyIndyCredentialFormatService(),
          }),
          new V2CredentialProtocol({
            credentialFormats: [
              new LegacyIndyCredentialFormatService(),
              new AnonCredsCredentialFormatService(),
            ],
          }),
        ],
      }),
      proofs: new ProofsModule({
        proofProtocols: [
          new V1ProofProtocol({
            indyProofFormat: new LegacyIndyProofFormatService(),
          }),
          new V2ProofProtocol({
            proofFormats: [indyProofFormat, new AnonCredsProofFormatService()],
          }),
        ],
      }),
    },
  })

  agent.registerOutboundTransport(new HttpOutboundTransport())
  agent.registerOutboundTransport(new WsOutboundTransport())
  return agent
}

const createLinkSecretIfRequired = async (agent: Agent) => {
  // If we don't have any link secrets yet, we will create a
  // default link secret that will be used for all anoncreds
  // credential requests.
  const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()
  if (linkSecretIds.length === 0) {
    await agent.modules.anoncreds.createLinkSecret({
      setAsDefault: true,
    })
  }
  console.log(`Table name: ${userTableName}`)
}

export {
  agent,
  config,
  createLinkSecretIfRequired,
  getAgent,
  getAgentConfig,
  ledgers,
  recoveryPhraseLocal,
  walletLocal,
}
