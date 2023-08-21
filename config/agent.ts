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

const config: InitConfig = {
  label: "sainopal",
  walletConfig: {
    id: "sainopal",
    key: "testkey0030000000000000000000000",
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

agent.modules.anoncreds
export { agent }
