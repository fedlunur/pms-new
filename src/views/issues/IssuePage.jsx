import React, { useState, useEffect } from "react";
import { Button } from "antd";
import IssueCard from "./IssueCard";
import NewIssueForm from "./NewIssueForm";
import useAxios from "../../utils/useAxios";

function IssuePage({ task }) {
  const taskId = task.id;
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const api = useAxios();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/issues/`);
      setIssues(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addIssue = (newIssue) => {
    setIssues([...issues, newIssue]);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleReplySubmit = async (issueId, replyText, setReplies) => {
    try {
      const response = await api.post("/issue-replies/", {
        issue: issueId,
        reply_text: replyText,
      });
      setReplies((prevReplies) => [...prevReplies, response.data]);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", position: "relative", minHeight: "100vh" }} className="w-full">
      <h1>Issues for Task {taskId}</h1>
      
      <div className="flex flex-col gap-3">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onReplySubmit={handleReplySubmit}
          />
        ))}
      </div>
      {/* <Button onClick={toggleFormVisibility} type="primary" style={{ marginBottom: "20px" }}>
        New Issue
      </Button> */}
      {/* {showForm && ( */}
        <NewIssueForm
          addIssue={addIssue}
          taskId={taskId}
          toggleForm={toggleFormVisibility}
        />
      {/* )} */}
    </div>
  );
}

export default IssuePage;
