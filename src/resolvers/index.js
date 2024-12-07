import Resolver from "@forge/resolver";
import forge from "@forge/api";

const resolver = new Resolver();

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
  console.log(url);

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
  console.log(data);
  return data;
});

export const handler = resolver.getDefinitions();
