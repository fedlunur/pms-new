import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import IssueCard from './IssueCard';
import NewIssueForm from './NewIssueForm';
import IssueDetail from './IssueDetail';
import useAxios from "../../utils/useAxios";
import Layout from '../Layout';


function IssuePage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null)
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [issueDetailPosition, setIssueDetailPosition] = useState({ top: 0, left: 0 });
  const api = useAxios();
  const buttonRefs = useRef([]);

  useEffect(() => {
    fetchData();
    fetchTask();
  }, [taskId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/protask/api/issues/?task=${taskId}`);
      setIssues(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'An error occurred');
      setLoading(false);
    }
  };
  const fetchTask = async () =>{
    try{
      setLoading(true);
      const response = await api.get(`/protask/api/tasks/${taskId}`)
      setTask(response.data)
      setLoading(false)
    } catch(error){
      setError(error.message || 'An error occured');
      setLoading(false);
    }
    }

  const addIssue = (newIssue) => {
    setIssues([...issues, newIssue]);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleViewComments = (issueId, index) => {
    if (selectedIssueId === issueId) {
      setSelectedIssueId(null); // Hide IssueDetail if the same issue is clicked again
    } else {
      setSelectedIssueId(issueId);
      const buttonRef = buttonRefs.current[index];
      if (buttonRef) {
        const rect = buttonRef.getBoundingClientRect();
        const cardRect = buttonRef.parentElement.parentElement.getBoundingClientRect();
        setIssueDetailPosition({
          top: rect.bottom + window.pageYOffset,
          left: cardRect.left + window.pageXOffset,
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
    <div className="flex flex-col items-center mx-auto px-4 py-8 max-w-screen-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">{task ? `Issues for Task ${taskId}: ${task.task_name}` : `Issues for Task ${taskId}`}</h1>
      <div className="mb-4">
        <button 
          onClick={toggleFormVisibility} 
          type="button" 
          className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          New Issue
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <Button icon="pi pi-times" className="absolute top-2 right-2" onClick={toggleFormVisibility} />
            <NewIssueForm addIssue={addIssue} taskId={taskId} toggleForm={toggleFormVisibility} />
          </div>
        </div>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${showForm ? 'filter blur-sm' : ''}`}>
        {issues.map((issue, index) => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            onViewComments={(issueId) => handleViewComments(issueId, index)} 
            buttonRef={(ref) => buttonRefs.current[index] = ref} 
            api={api} // Pass the Axios instance here
          />
        ))}
      </div>
      {selectedIssueId && (
        <IssueDetail
          id={selectedIssueId}
          position={{ top: issueDetailPosition.top, left: issueDetailPosition.left }}
          onClose={() => setSelectedIssueId(null)}
          count={issues.find(issue => issue.id === selectedIssueId)?.replies.length || 0} // Pass the comment count
        />
      )}
    </div>
    </Layout>
  );
}

export default IssuePage;
