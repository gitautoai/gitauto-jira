// Handle only webhook events
export const handler = async (event, context) => {
  console.log("Event: ", event);
  console.log("Context: ", context);
  const { changelog } = event;
  console.log("Changelog: ", changelog);

  if (event.type === "avi:jira:created:issue") {
    return handleIssueCreated(event);
  }

  if (event.type === "avi:jira:updated:issue") {
    return handleIssueUpdated(event);
  }
};

const handleIssueCreated = async (event) => {
  console.log("Issue created");
};

const handleIssueUpdated = async (event) => {
  console.log("Issue updated");
};
