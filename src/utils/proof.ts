import { Agent, CredentialFormat } from "@aries-framework/core";
import { CredentialFormatData } from "../screens/Offer/CredentialOffer";

async function getProofNameFromID(agent: Agent, id: string) {
  const data = await getProofFormatData(agent, id);

  if (data.request) {
    return data.request.indy?.name;
  }
  return "Proof your credentials";
}

async function getProofFormatData(agent: Agent, id: string) {
  const data = await agent.proofs.getFormatData(id);
  return data;
}

async function getRequestAttributes(agent: Agent, id: string) {
  const data = await getProofFormatData(agent, id);
  if (data.request) {
    return data.request.indy?.requested_attributes;
  }
  return [];
}

async function getPredicates(agent: Agent, id: string) {
  const data = await getProofFormatData(agent, id);
  if (data.request) {
    return data.request.indy?.requested_predicates;
  }
  return [];
}

export type RequestedPredicate = {
  predicateName: string;
  name: string;
  predicate: string;
  threshold: number;
  cred_def_id: string;
};

function getPredicateFromFormatData(data: any) {
  const predicates = data.request.indy?.requested_predicates;
  console.log(`Predicates : ${JSON.stringify(predicates)}`);
  if (predicates) {
    const result: RequestedPredicate[] = [];
    Object.keys(predicates).forEach((key) => {
      let predicateName = key;
      let name = predicates[key]["name"];
      let predicate = predicates[key]["p_type"];
      let threshold = predicates[key]["p_value"];
      let cred_def_id = predicates[key]["restrictions"][0]["cred_def_id"];
      result.push({ predicateName, name, predicate, threshold, cred_def_id });
    });

    return result;
  }
  return [];
}

function getRequestAttributesFromFormatData(form_data: any) {
  return form_data.request.indy?.requested_attributes;
}

export type RequestedAttributes = {
  credential_name: string;
  attributes: string[];
  cred_def_id?: string;
};

function getAttributesRequested(data: any): RequestedAttributes[] {
  const attributes = data.request.indy?.requested_attributes;
  const result: RequestedAttributes[] = [];

  console.log(attributes);
  Object.keys(attributes).forEach((key) => {
    const attribute = attributes[key];
    const cred_def_id = attribute["restrictions"][0]["cred_def_id"];

    if (Object.keys(attribute).includes("name")) {
      result.push({
        credential_name: key,
        attributes: [attribute["name"]],
        cred_def_id: cred_def_id,
      });
    } else {
      result.push({
        credential_name: key,
        attributes: attribute["names"],
        cred_def_id: cred_def_id,
      });
    }
  });
  return result;
}

async function getAvailableCredentialsForProof(agent: Agent, id: string) {
  const credentials = await agent.proofs.getCredentialsForRequest({
    proofRecordId: id,
  });

  return credentials;
}

export type MappedAttributes = {
  credential_name: string;
  attributes: CredentialFormatData[];
};

function mapRequestAttributes(
  attributes: any,
  requestedAttributes: RequestedAttributes[]
): MappedAttributes[] {
  const result: MappedAttributes[] = [];
  requestedAttributes.forEach((requestedAttribute) => {
    const credentialFormats: CredentialFormatData[] = [];
    requestedAttribute.attributes.forEach((attribute) => {
      credentialFormats.push({
        name: attribute,
        value:
          attributes[requestedAttribute.credential_name][0]["credentialInfo"][
            "attributes"
          ][attribute],
      });
    });

    result.push({
      credential_name: requestedAttribute.credential_name,
      attributes: credentialFormats,
    });
  });

  return result;
}

export {
  getProofNameFromID,
  getRequestAttributes,
  getProofFormatData,
  getPredicates,
  getAvailableCredentialsForProof,
  getPredicateFromFormatData,
  getRequestAttributesFromFormatData,
  getAttributesRequested,
  mapRequestAttributes,
};
