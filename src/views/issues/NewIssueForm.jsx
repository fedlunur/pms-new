import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import useAxios from "../../utils/useAxios";

function NewIssueForm({ addIssue, taskId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false); 
  const api = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/issues/', {
        title,
        description,
        task: taskId,
      });
      addIssue(response.data);
      setTitle('');
      setDescription('');
      setSubmitted(true); 
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  if (submitted) {  
    return <div></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="new-issue-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="p-field">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-inputtext"
        />
      </div>
      <div className="p-field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          rows={5}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-inputtextarea"
        />
      </div>
      <div className="p-field">
        <Button label="Submit" type="submit" className="p-button-success" style={{ width: '100px', alignSelf: 'flex-end' }} />
      </div>
    </form>
  );
}

export default NewIssueForm;
