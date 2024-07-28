import React, { useState } from 'react';
import { Card, Button, Collapse, Input } from 'antd';

const { TextArea } = Input;
const { Panel } = Collapse;

function IssueCard({ issue, onReplySubmit }) {
  const [replies, setReplies] = useState(issue.replies || []);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (e) => {
    e.preventDefault();
    onReplySubmit(issue.id, replyText, setReplies);
    setReplyText('');
  };

  return (
    <Card
      title={issue.title}
      bordered={false}
      className='w-full text-sm text-left font-regular'
    >
      {/* <p>{issue.description}</p> */}
      <Collapse>
        <Panel header="Replies" key="1">
          {replies.map(reply => (
            <div key={reply.id} style={{ marginBottom: '10px' }}>
              <b>User:</b> {reply.user.username} <br />
              <b>Comment:</b> {reply.reply_text}
            </div>
          ))}
          <form onSubmit={handleSubmitReply} style={{ marginTop: '20px' }}>
            <TextArea
              rows={2}
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              style={{ marginBottom: '10px' }}
            />
            <Button type="primary" htmlType="submit">Submit Reply</Button>
          </form>
        </Panel>
      </Collapse>
    </Card>
  );
}

export default IssueCard;
