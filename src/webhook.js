import forge, { route } from "@forge/api";

export const handler = async (event, context) => {
  // https://developer.atlassian.com/platform/forge/events-reference/life-cycle/
  console.log("Installation event payload:", event);
  console.log("Context:", context);

  if (event.eventType === "avi:forge:installed:app") {
    console.log("App was installed!");

    // Extract cloudId and contextToken
    const cloudId = event.context.cloudId;
    const contextToken = event.contextToken;

    try {
      let startAt = 0;
      const maxResults = 50; // Number of results per page
      let allProjects = [];
      let isLastPage = false;

      while (!isLastPage) {
        // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-search-get
        const url = route`/rest/api/3/project/search?startAt=${startAt}&maxResults=${maxResults}`;
        const response = await forge
          .asApp()
          .requestJira(url, { headers: { Accept: "application/json" } });

        // Add status code checking and response logging
        if (!response.ok) {
          console.error("API request failed:", {
            status: response.status,
            statusText: response.statusText,
            body: await response.text(),
          });
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        // console.log("Raw API response:", JSON.stringify(result, null, 2));
        const { values, total, isLast } = result;

        allProjects = [...allProjects, ...values];
        isLastPage = isLast;
        startAt += maxResults;

        console.log(`Fetched ${values.length} projects. Total: ${total}. Page complete: ${isLast}`);
      }

      console.log(
        "All projects found:",
        allProjects.map((p) => ({
          id: p.id,
          key: p.key,
          name: p.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  } else if (event.eventType === "avi:forge:upgraded:app") {
    console.log("App was upgraded!");
    // Handle upgrade logic here
  }

  return { status: 200, body: "Installation event processed" };
};
