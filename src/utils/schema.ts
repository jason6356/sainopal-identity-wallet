import { CredentialExchangeRecord as CredentialRecord } from "@aries-framework/core";
import { AnonCredsCredentialMetadataKey } from "@aries-framework/anoncreds/build/utils/metadata";
import {
  Agent,
  GetCredentialFormatDataReturn,
  CredentialFormat,
} from "@aries-framework/core";

type Schema = {
  name: string;
  version: string;
};

//did:sov:WRfXPg8dantKVubE3HX8pw:Diploma:

function parseSchemaFromId(schemaId?: string): Schema {
  let name = "Credential";
  let version = "";
  if (schemaId) {
    const schemaIdRegex = /(.*?):([0-9]):([a-zA-Z .\-_0-9]+):([a-z0-9._-]+)$/;
    const schemaIdParts = schemaId.match(schemaIdRegex);
    if (schemaIdParts?.length === 5) {
      name = `${schemaIdParts?.[3].replace(/_|-/g, " ")}`
        .split(" ")
        .map(
          (schemaIdPart) =>
            schemaIdPart.charAt(0).toUpperCase() + schemaIdPart.substring(1)
        )
        .join(" ");
      version = schemaIdParts?.[4];
    }
  }

  return { name, version };
}

function credentialSchema(credential: CredentialRecord): string | undefined {
  return credential.metadata?.get(AnonCredsCredentialMetadataKey)?.schemaId;
}

function parsedSchema(credential: CredentialRecord): {
  name: string;
  version: string;
} {
  return parseSchemaFromId(credentialSchema(credential));
}

async function getSchemaID(agent: Agent, offerID: string) {
  try {
    const formatData: GetCredentialFormatDataReturn<CredentialFormat[]> =
      await agent.credentials.getFormatData(offerID);

    if (formatData.offer) {
      const { schema_id } = formatData.offer?.indy;
      return schema_id;
    }
  } catch (e) {
    console.error("Invalid Credential Offer ID!");
  }
}

async function getSchemaNameFromOfferID(agent: Agent, offerID: string) {
  const schemaID = await getSchemaID(agent, offerID);
  const schema = parseSchemaFromId(schemaID);
  return schema.name;
}

export { getSchemaNameFromOfferID, parsedSchema };
