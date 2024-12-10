import Resolver from "@forge/resolver";
import forge from "@forge/api";
import { route, storage } from "@forge/api";

const resolver = new Resolver();

// Create a storage key utility
const createStorageKey = (cloudId, projectId, issueId, item) =>
  `site:${cloudId}:project:${projectId}:issue:${issueId}:item:${item}`;

// https://developer.atlassian.com/platform/forge/runtime-reference/forge-resolver/
resolver.define("getGithubRepos", async ({ payload }) => {
  const { cloudId, projectId } = payload;

  // https://supabase.com/docs/guides/api/sql-to-rest
  const queryParams = new URLSearchParams({
    select: "github_owner_name,github_repo_name,github_owner_id",
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

// Trigger GitAuto by calling the FastAPI endpoint
resolver.define("triggerGitAuto", async ({ payload }) => {
  const endpoint = process.env.GITAUTO_URL + "/jira-webhook";
  const response = await forge.fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload }),
  });
  if (!response.ok) throw new Error(`Failed to trigger GitAuto: ${response.status}`);
  return await response.json();
});

// Convert Atlassian Document Format to Markdown
const adfToMarkdown = (adf) => {
  if (!adf || !adf.content) return "";

  return adf.content
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.content?.map((item) => item.text || "").join("") + "\n\n";
        case "heading":
          const level = block.attrs?.level || 1;
          const hashes = "#".repeat(level);
          return `${hashes} ${block.content?.map((item) => item.text || "").join("")}\n\n`;
        case "bulletList":
          return (
            block.content
              ?.map((item) => `- ${item.content?.map((subItem) => subItem.text || "").join("")}`)
              .join("\n") + "\n\n"
          );
        case "orderedList":
          return (
            block.content
              ?.map(
                (item, index) =>
                  `${index + 1}. ${item.content?.map((subItem) => subItem.text || "").join("")}`
              )
              .join("\n") + "\n\n"
          );
        case "codeBlock":
          return `\`\`\`\n${block.content?.map((item) => item.text || "").join("")}\n\`\`\`\n\n`;
        default:
          return "";
      }
    })
    .join("")
    .trim();
};

// Get issue details from Jira
// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get
resolver.define("getIssueDetails", async ({ payload }) => {
  const { issueId } = payload;
  const response = await forge.asApp().requestJira(route`/rest/api/3/issue/${issueId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch issue details: ${response.status}`);
  const data = await response.json();
  // console.log("Jira issue details:", data);

  // Format comments into readable text list
  const comments =
    data.fields.comment?.comments?.map((comment) => {
      const timestamp = new Date(comment.created).toLocaleString();
      return `${comment.author.displayName} (${timestamp}):\n${adfToMarkdown(comment.body)}`;
    }) || [];

  return {
    // project: {
    //   id: data.fields.project.id,
    //   key: data.fields.project.key,
    //   name: data.fields.project.name,
    // },
    issue: {
      id: data.id,
      key: data.key,
      title: data.fields.summary,
      body: adfToMarkdown(data.fields.description),
      comments: comments,
    },
    creator: {
      id: data.fields.creator.accountId,
      displayName: data.fields.creator.displayName,
      email: data.fields.creator.emailAddress,
    },
    reporter: {
      id: data.fields.reporter.accountId,
      displayName: data.fields.reporter.displayName,
      email: data.fields.reporter.emailAddress,
    },
  };
});

export const handler = resolver.getDefinitions();
