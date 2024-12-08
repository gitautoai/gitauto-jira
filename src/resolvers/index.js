import Resolver from "@forge/resolver";
import forge from "@forge/api";
import { storage } from "@forge/api";

const resolver = new Resolver();

// Create a storage key utility
const createStorageKey = (cloudId, projectId, issueId, item) =>
  `site:${cloudId}:project:${projectId}:issue:${issueId}:item:${item}`;

// https://developer.atlassian.com/platform/forge/runtime-reference/forge-resolver/
resolver.define("getGithubRepos", async ({ payload }) => {
  const { cloudId, projectId } = payload;

  // https://supabase.com/docs/guides/api/sql-to-rest
  const queryParams = new URLSearchParams({
    select: "*",
    jira_site_id: `eq.${cloudId}`,
    jira_project_id: `eq.${projectId}`,
  }).toString();
  const url = `${process.env.SUPABASE_URL}/rest/v1/jira_github_links?${queryParams}`;

  const response = await forge.fetch(url, {
    method: "GET",
    headers: {
      apikey: process.env.SUPABASE_API_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch repositories: ${response.status}`);

  const data = await response.json();
  return data;
});

// Get stored repo from Atlassian storage
// https://developer.atlassian.com/platform/forge/runtime-reference/storage-api-basic-api/#storage-get
resolver.define("getStoredRepo", async ({ payload }) => {
  const { cloudId, projectId, issueId } = payload;
  const key = createStorageKey(cloudId, projectId, issueId, "selectedRepo");
  return await storage.get(key);
});

// Store repo in Atlassian storage
// https://developer.atlassian.com/platform/forge/runtime-reference/storage-api-basic-api/#storage-set
resolver.define("storeRepo", async ({ payload }) => {
  const { cloudId, projectId, issueId, value } = payload;
  const key = createStorageKey(cloudId, projectId, issueId, "selectedRepo");
  return await storage.set(key, value);
});

export const handler = resolver.getDefinitions();
