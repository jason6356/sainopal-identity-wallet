import type { InitConfig } from "@aries-framework/core"
import {
  Agent,
  AutoAcceptProof,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  LogLevel,
  MediationRecipientModule,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
} from "@aries-framework/core"
import { agentDependencies } from "@aries-framework/react-native"
import {
  HttpOutboundTransport,
  WsOutboundTransport,
} from "@aries-framework/core"
import {
  IndySdkModule,
  IndySdkPoolConfig,
  IndySdkModuleConfig,
  IndySdkAnonCredsRegistry,
  IndySdkIndyDidResolver,
} from "@aries-framework/indy-sdk"
import indySdk, { openPoolLedger } from "indy-sdk-react-native"
import genesis from "./genesis"
import { anoncreds } from "@hyperledger/anoncreds-react-native"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"
import type { AnonCredsRsModuleConfigOptions } from "@aries-framework/anoncreds-rs/build/AnonCredsRsModuleConfig"
import {
  AnonCredsModule,
  LegacyIndyCredentialFormat,
  AnonCredsCredentialFormat,
  LegacyIndyCredentialFormatService,
  AnonCredsCredentialFormatService,
  AnonCredsLinkSecretRepository,
  V1ProofProtocol,
  LegacyIndyProofFormatService,
  AnonCredsProofFormatService,
} from "@aries-framework/anoncreds"

const poolConfig: IndySdkPoolConfig = {
  indyNamespace: "",
  id: "YourSovrinLocal", // <----<<< as shown here
  genesisTransactions: genesis,
  isProduction: false,
}

const mediatorInvitationUrl = `https://619c-103-52-192-245.ngrok.io?c_i=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwgIkBpZCI6ICJlOThlZGY2MC0zYzk4LTQ4NTQtYjVmYS04OTkzNDkwZDZmZDAiLCAic2VydmljZUVuZHBvaW50IjogImh0dHBzOi8vNjE5Yy0xMDMtNTItMTkyLTI0NS5uZ3Jvay5pbyIsICJsYWJlbCI6ICJNZWRpYXRvciIsICJyZWNpcGllbnRLZXlzIjogWyJEYlBocG5IaXl5YmY0TGZFdzJrZENjU0d0OVNnZFZ1YUdja1E5d1VZN3hXRSJdfQ==`

const config: InitConfig = {
  label: "sainopal",
  walletConfig: {
    id: "sainopal",
    key: "testkey0030000000000000000000000",
  },
  logger: new ConsoleLogger(LogLevel.trace),
}

const indyCredentialFormat = new LegacyIndyCredentialFormatService()
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

export { agent }
