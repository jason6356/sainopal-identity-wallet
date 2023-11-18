import { Agent, CredentialFormat } from "@aries-framework/core";

import { GetCredentialFormatDataReturn } from "@aries-framework/core";
import { getSchemaNameFromOfferID } from "./schema";

type CredentialFormatData = {
  name: string;
  value: string;
};
export async function getCredentialName(agent: Agent, id: string) {
  const name = await getSchemaNameFromOfferID(agent, id);
  return name;
}

export async function getCredentialFormat(agent: Agent, id: string) {
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
    console.log("Error!, this offer does not have any attributes");
    return [];
  }
}
