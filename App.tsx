import { Agent } from "@aries-framework/core";
import AgentProvider from "@aries-framework/react-hooks";
import React, { useEffect, useState } from "react";
import { agent } from "./config"; // Assuming this is where you have your agent configuration
import BottomNavigation from "./src/navigation/BottomNavigation";
import { GluestackUIProvider } from "@gluestack-ui/react";
import { createLinkSecretIfRequired } from "./config/agent";

const App: React.FC = () => {
  const [initializedAgent, setInitializedAgent] = useState<Agent<any> | null>(
    null
  );

  useEffect(() => {
    async function initializeAndSetAgent() {
      try {
        agent.config.label;
        await agent.initialize();
        await createLinkSecretIfRequired(agent);
        setInitializedAgent(agent);
      } catch (error) {
        console.error("Error initializing agent:", error);
      }
    }

    initializeAndSetAgent();
  }, []);

  return (
    <>
      {initializedAgent && (
        <AgentProvider agent={initializedAgent as Agent<any>}>
          <BottomNavigation />
        </AgentProvider>
      )}
    </>
  );
};

export default App;
