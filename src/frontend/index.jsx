import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import ForgeReconciler, { Select, Text, useProductContext, Checkbox, Stack } from "@forge/react";

const App = () => {
  // Get Jira cloud ID (== workspace ID)
  const context = useProductContext();
  // console.log("context: ", context);

  // Get Jira cloud ID
  const [cloudId, setCloudId] = useState(null);
  useEffect(() => {
    if (context) setCloudId(context.cloudId);
  }, [context]);

  // Get Jira project ID
  const [projectId, setProjectId] = useState(null);
  useEffect(() => {
    if (context) setProjectId(context.extension.project.id);
  }, [context]);

  // Get Jira issue ID
  const [issueId, setIssueId] = useState(null);
  useEffect(() => {
    if (context) setIssueId(context.extension.issue.id);
  }, [context]);

  // Get corresponding GitHub repositories from Supabase
  const [githubRepos, setGithubRepos] = useState([]);
  useEffect(() => {
    const fetchRepositories = async () => {
      if (cloudId && projectId) {
        try {
          const response = await invoke("getGithubRepos", { cloudId, projectId });
          setGithubRepos(
            response.map((repo) => `${repo.github_owner_name}/${repo.github_repo_name}`)
          );
        } catch (error) {
          console.error("Error fetching repositories:", error);
          setGithubRepos([]);
        }
      }
    };

    fetchRepositories();
  }, [cloudId, projectId]);

  // Handle selected repository
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState("");
  useEffect(() => {
    if (!cloudId || !projectId) return;
    const loadSavedRepo = async () => {
      setIsLoading(true);
      try {
        const savedRepo = await invoke("getStoredRepo", { cloudId, projectId, issueId });
        setSelectedRepo(savedRepo || "");
      } catch (error) {
        console.error("Error loading saved repo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedRepo();
  }, [cloudId, projectId, issueId]);

  // Save repository when selected
  const handleRepoChange = async (value) => {
    setSelectedRepo(value);
    if (!cloudId || !projectId) return;
    try {
      await invoke("storeRepo", { cloudId, projectId, issueId, value });
    } catch (error) {
      console.error("Error saving repo:", error);
    }
  };

  // Handle checkbox
  const [isChecked, setIsChecked] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    if (!checked || !selectedRepo) return;
    setIsTriggering(true);
    try {
      await invoke("triggerGitAuto", { cloudId, projectId, issueId, selectedRepo });
    } catch (error) {
      console.error("Error triggering GitAuto:", error);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    // https://developer.atlassian.com/platform/forge/ui-kit-2/stack/
    <Stack space="space.075">
      <Text>Target GitHub Repository:</Text>
      <Select
        value={selectedRepo}
        onChange={handleRepoChange}
        options={githubRepos.map((repo) => ({ label: repo, value: repo }))}
        isDisabled={isLoading}
        placeholder="Select a repository"
      />
      <Checkbox
        label="Trigger GitAuto to open a pull request"
        onChange={handleCheckboxChange}
        value={isChecked}
        isDisabled={!selectedRepo || isTriggering}
      />
      {isTriggering && <Text>Triggering GitAuto...</Text>}
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
