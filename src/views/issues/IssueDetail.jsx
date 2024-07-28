import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Collapse } from 'antd';
import useAxios from "../../utils/useAxios";

const { TextArea } = Input;
const { Panel } = Collapse;

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
      setReplies([...replies, response.data]);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {issue && (
        <Collapse defaultActiveKey={['1']}>
          <Panel header={`${issue.title} - ${issue.description}`} key="1">
            {replies.map(reply => (
              <div key={reply.id} style={{ marginBottom: '10px' }}>
                <b>User:</b> {reply.user.username} <br />
                <b>Comment:</b> {reply.reply_text}
              </div>
            ))}
            <form onSubmit={handleSubmitReply} style={{ marginTop: '20px' }}>
              <TextArea
                rows={4}
                placeholder="Write your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
                style={{ marginBottom: '10px' }}
              />
              <Button type="primary" htmlType="submit">Submit</Button>
            </form>
          </Panel>
        </Collapse>
      )}
    </div>
  );
}

export default IssueDetail;
