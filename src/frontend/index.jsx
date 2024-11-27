import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, useProductContext } from "@forge/react";
import { requestJira } from "@forge/bridge";

const App = () => {
  const context = useProductContext();
  const [comments, setComments] = useState();
  console.log(`Number of comments on this issue: ${comments?.length}`);

  const fetchCommentsForIssue = async (issueIdOrKey) => {
    const res = await requestJira(`/rest/api/3/issue/${issueIdOrKey}/comment`);
    const data = await res.json();
    return data.comments;
  };

  // This is a test of the requestJira function
  useEffect(() => {
    if (context) {
      const issueId = context.extension.issue.id;
      fetchCommentsForIssue(issueId).then(setComments);
    }
  }, [context]);

  return (
    <>
      <Text>Hello world!</Text>
      <Text>Number of comments on this issue: {comments?.length}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
