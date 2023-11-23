import { Agent, CredentialFormat } from "@aries-framework/core";

import { GetCredentialFormatDataReturn } from "@aries-framework/core";
import { getSchemaNameFromOfferID } from "./schema";

type CredentialFormatData = {
  name: string;
  value: string;
};
async function getCredentialName(agent: Agent, id: string) {
  const name = await getSchemaNameFromOfferID(agent, id);
  return name;
}

async function getCredentialDefinition(agent: Agent, id: string) {
  const formatData = await agent.credentials.getFormatData(id);

  return formatData.credential?.indy?.cred_def_id;
}

async function getCredentialFormat(agent: Agent, id: string) {
  const formatData: GetCredentialFormatDataReturn<CredentialFormat[]> =
    await agent.credentials.getFormatData(id);
  let newCredentialFormatData: CredentialFormatData[] = [];

  if (formatData.offerAttributes) {
    formatData.offerAttributes.forEach((attr) => {
      newCredentialFormatData.push({
        name: attr.name,
        value: attr.value,
      });
    });
    return newCredentialFormatData;
  } else {
    console.error("Error!, this offer does not have any attributes");
    return [];
  }
}

export { getCredentialName, getCredentialFormat, getCredentialDefinition };
