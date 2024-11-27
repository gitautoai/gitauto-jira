import React, { useEffect, useState } from "react";
import ForgeReconciler, { Select, Text, useProductContext } from "@forge/react";
import { requestJira } from "@forge/bridge";

const App = () => {
  // Get Jira cloud ID (== workspace ID)
  const context = useProductContext();
  const [cloudId, setCloudId] = useState(null);
  useEffect(() => {
    if (context) {
      setCloudId(context.cloudId);
      console.log({ context });
      console.log(`Jira cloud ID: ${context.cloudId}`);
    }
  }, [context]);

  // Get repository list where GitAuto is installed
  const repositories = ["gitautoai/gitauto", "gitautoai/gitauto-jira"];
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);

  return (
    <>
      <Text>Target GitHub Repository:</Text>
      <Select
        value={selectedRepo}
        onChange={setSelectedRepo}
        options={repositories.map((repo) => ({ label: repo, value: repo }))}
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
