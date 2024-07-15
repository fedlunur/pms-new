import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import useAxios from "../../utils/useAxios";

function IssueDetail() {
  const { id: issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, [issueId]);

  const fetchData = async () => {
    try {
      const issueResponse = await api.get(`/issues/${issueId}/`);
      setIssue(issueResponse.data);
      setReplies(issueResponse.data.replies);
    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/issue-replies/', {
        issue: issueId,
        reply_text: replyText,
      });
      const newReply = response.data;
      setReplies([...replies, newReply]);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div>
      {issue && (
        <Fieldset legend={<legend style={{ textAlign: 'center' }}>{issue.title} <br /><small>{issue.description}</small></legend>}>
          {replies.map(reply => (
            <div key={reply.id} className={reply.user.username === issue.user ? 'reply left' : 'reply right'}>
              <p><b>Comment:</b>  {reply.reply_text}</p>
              <small><p><b>User:</b> {reply.user.username} </p></small>
            </div>
          ))}
          <form onSubmit={handleSubmitReply}>
            <InputTextarea
              rows={5}
              cols={30}
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
            />
            <Button label="Submit" type="submit" className="p-button-success" />
          </form>
        </Fieldset>
      )}
    </div>
  );
}

export default IssueDetail;
