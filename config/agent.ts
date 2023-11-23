import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
} from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";
import type { InitConfig } from "@aries-framework/core";
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
} from "@aries-framework/core";
import {
  IndySdkAnonCredsRegistry,
  IndySdkIndyDidResolver,
  IndySdkModule,
  IndySdkPoolConfig,
} from "@aries-framework/indy-sdk";
import { agentDependencies } from "@aries-framework/react-native";
import { anoncreds } from "@hyperledger/anoncreds-react-native";
import indySdk from "indy-sdk-react-native";
import _ledger from "./ledger.json";
import { genesis } from "./genesis";

const ledgers: IndySdkPoolConfig[] = _ledger;

const poolConfig: IndySdkPoolConfig = {
  indyNamespace: "",
  id: "AwSovrin", // <----<<< as shown here
  genesisTransactions: genesis,
  connectOnStartup: false,
  isProduction: false,
};

ledgers.push(poolConfig);

const mediatorInvitationUrl = `https://public.mediator.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMDVlYzM5NDItYTEyOS00YWE3LWEzZDQtYTJmNDgwYzNjZThhIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL3B1YmxpYy5tZWRpYXRvci5pbmRpY2lvdGVjaC5pbyIsICJyZWNpcGllbnRLZXlzIjogWyJDc2dIQVpxSktuWlRmc3h0MmRIR3JjN3U2M3ljeFlEZ25RdEZMeFhpeDIzYiJdLCAibGFiZWwiOiAiSW5kaWNpbyBQdWJsaWMgTWVkaWF0b3IifQ==`;
const localMediatorUrl = `https://b3ca-103-52-192-245.ngrok.io/?c_i=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwgIkBpZCI6ICJiMDU0OTVkYi1iNzhjLTQzMGYtYmRhOS05M2Q0ZjNiMTdiYTYiLCAicmVjaXBpZW50S2V5cyI6IFsiN2FuSFMxY056ZUp0a203YVZSWlZnaDU4alV1TXM1WDd4enQzTThHY0FmUXUiXSwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL2IzY2EtMTAzLTUyLTE5Mi0yNDUubmdyb2suaW8iLCAibGFiZWwiOiAiTWVkaWF0b3IifQ==`;

// const indyPoolConfig: IndySdkPoolConfig = {
//   genesisTransactions: indyGenesis,
//   id: "IndicioTestNet",
//   isProduction: false,
//   indyNamespace: "indicio:test",
// }

//ledgers.push(poolConfig);

const config: InitConfig = {
  label: "SainoPal Mobile Wallet",
  walletConfig: {
    id: "sainoWallet-11h",
    key: "testkey0040020000000000000000000",
  },
  logger: new ConsoleLogger(LogLevel.trace),
};

const indyProofFormat = new LegacyIndyProofFormatService();

const agent = new Agent({
  config,
  dependencies: agentDependencies,
  modules: {
    mediationRecipient: new MediationRecipientModule({
      mediatorInvitationUrl,
    }),
    indySdk: new IndySdkModule({
      indySdk,
      networks: ledgers,
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
        new V1ProofProtocol({ indyProofFormat }),
        new V2ProofProtocol({
          proofFormats: [indyProofFormat, new AnonCredsProofFormatService()],
        }),
      ],
    }),
  },
});

//agent.wallet.import({})
//agent.wallet.export({})

agent.registerOutboundTransport(new HttpOutboundTransport());
agent.registerOutboundTransport(new WsOutboundTransport());

export const createLinkSecretIfRequired = async (agent: Agent) => {
  // If we don't have any link secrets yet, we will create a
  // default link secret that will be used for all anoncreds
  // credential requests.
  const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds();
  if (linkSecretIds.length === 0) {
    await agent.modules.anoncreds.createLinkSecret({
      setAsDefault: true,
    });
  }
};

export { agent };
