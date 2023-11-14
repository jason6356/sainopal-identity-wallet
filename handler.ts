import { Agent, AutoAcceptCredential } from "@aries-framework/core";

const handleAcceptCredential = async (
  agent: Agent,
  credential_exchange_id: string
) => {
  return agent.credentials.acceptOffer({
    credentialRecordId: credential_exchange_id,
    autoAcceptCredential: AutoAcceptCredential.ContentApproved,
  });
};

const handleRejectCredential = async (
  agent: Agent,
  credential_exchange_id: string
) => {
  return agent.credentials.declineOffer(credential_exchange_id);
};
