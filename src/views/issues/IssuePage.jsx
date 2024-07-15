import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import IssueCard from './IssueCard';
import NewIssueForm from './NewIssueForm';
import useAxios from "../../utils/useAxios";
import { Panel } from 'primereact/panel';

function IssuePage() {
  const { taskId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/issues/?task=${taskId}`);
      setIssues(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  const addIssue = (newIssue) => {
    setIssues([...issues, newIssue]);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-d-flex p-flex-column p-jc-center p-ai-center">

      <h1 >Issues for Task {taskId}</h1>
      <div className="p-d-flex p-jc-center p-mb-4">
        <Button onClick={toggleFormVisibility} label="New Issue" className="p-button-raised p-button-text" />
      </div>
      {showForm && <NewIssueForm addIssue={addIssue} taskId={taskId} toggleForm={toggleFormVisibility} />}
      <div className="p-d-flex p-flex-wrap p-jc-center">
        {issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

export default IssuePage;
