import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
} from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"
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
import {
  IndySdkAnonCredsRegistry,
  IndySdkIndyDidResolver,
  IndySdkModule,
  IndySdkPoolConfig,
} from "@aries-framework/indy-sdk"
import { agentDependencies } from "@aries-framework/react-native"
import { anoncreds } from "@hyperledger/anoncreds-react-native"
import indySdk from "indy-sdk-react-native"
import { genesis } from "./genesis"

const poolConfig: IndySdkPoolConfig = {
  indyNamespace: "",
  id: "YourSovrinLocal", // <----<<< as shown here
  genesisTransactions: genesis,
  isProduction: false,
}

const mediatorInvitationUrl = `https://public.mediator.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMDVlYzM5NDItYTEyOS00YWE3LWEzZDQtYTJmNDgwYzNjZThhIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL3B1YmxpYy5tZWRpYXRvci5pbmRpY2lvdGVjaC5pbyIsICJyZWNpcGllbnRLZXlzIjogWyJDc2dIQVpxSktuWlRmc3h0MmRIR3JjN3U2M3ljeFlEZ25RdEZMeFhpeDIzYiJdLCAibGFiZWwiOiAiSW5kaWNpbyBQdWJsaWMgTWVkaWF0b3IifQ==`
//const localMediatorUrl = `https://1f6e-103-52-192-245.ngrok.io?c_i=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwgIkBpZCI6ICJjYWJjYWQwYS1mZjI1LTQxZjItYTNlZC1jMWEzMWU1NmEyMDAiLCAic2VydmljZUVuZHBvaW50IjogImh0dHBzOi8vMWY2ZS0xMDMtNTItMTkyLTI0NS5uZ3Jvay5pbyIsICJsYWJlbCI6ICJNZWRpYXRvciIsICJyZWNpcGllbnRLZXlzIjogWyJCUUxrU1A3ckQ4Tjh0WHFiUnZ4RzNKbnhvOE5pUm5LWGZ2ajM4ZW0yc1RiVCJdfQ==`

const config: InitConfig = {
  label: "SainoPal Mobile Wallet",
  walletConfig: {
    id: "wa",
    key: "testkey0090000000000000000000001",
  },
  logger: new ConsoleLogger(LogLevel.trace),
}

const indyProofFormat = new LegacyIndyProofFormatService()

const agent = new Agent({
  config,
  dependencies: agentDependencies,
  modules: {
    mediationRecipient: new MediationRecipientModule({
      mediatorInvitationUrl,
    }),
    indySdk: new IndySdkModule({
      indySdk,
      networks: [poolConfig],
    }),
    anoncredsRs: new AnonCredsRsModule({ anoncreds }),
    anoncreds: new AnonCredsModule({
      registries: [new IndySdkAnonCredsRegistry()],
    }),
    dids: new DidsModule({
      resolvers: [new IndySdkIndyDidResolver()],
    }),
    credentials: new CredentialsModule({
      credentialProtocols: [
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
        new V2ProofProtocol({
          proofFormats: [indyProofFormat, new AnonCredsProofFormatService()],
        }),
      ],
    }),
  },
})

agent.registerOutboundTransport(new HttpOutboundTransport())
agent.registerOutboundTransport(new WsOutboundTransport())

export const createLinkSecretIfRequired = async (agent: Agent) => {
  // If we don't have any link secrets yet, we will create a
  // default link secret that will be used for all anoncreds
  // credential requests.
  const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()
  if (linkSecretIds.length === 0) {
    await agent.modules.anoncreds.createLinkSecret({
      setAsDefault: true,
    })
  }
}

export { agent, config }
