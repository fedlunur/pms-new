import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import useAxios from "../../utils/useAxios";

function IssueDetail({ id, position, onClose, count }) {
  const [issue, setIssue] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null); // State to manage the ID of the reply being edited
  const [editingReplyText, setEditingReplyText] = useState(''); // State to manage the text being edited
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
  const commentRef = useRef(null); // Reference to the comment section
  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const issueResponse = await api.get(`/protask/api/issues/${id}/`);
      setIssue(issueResponse.data);
      setReplies(issueResponse.data.replies);
    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = dateTime.toISOString().split('T')[0];
    return { time, date };
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/issue-replies/', {
        issue: id,
        reply_text: replyText,
      });
      const newReply = response.data;
      setReplies([...replies, newReply]);
      setReplyText('');
      scrollToCommentSection();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleEditReply = async (replyId) => {
    try {
      const response = await api.put(`/api/issue-replies/${replyId}/`, {
        reply_text: editingReplyText,
      });
      const updatedReply = response.data;
      // Update the replies array with the updated reply
      setReplies(replies.map(reply => reply.id === replyId ? updatedReply : reply));
      // Reset the editing state
      setEditingReplyId(null);
      setEditingReplyText('');
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };
  


  const scrollToCommentSection = () => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      commentRef.current.focus();
    }
  };

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: position.top, 
        left: position.left, 
        width: '100%', // Ensures the width is dynamic and adjusts to the screen size
        maxWidth: '500px', // Sets a maximum width for the component
        zIndex: 1000, 
        backgroundColor: 'white',
        border: '1px solid gray',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      {issue && (
        <Fieldset>
          <div className="overflow-y-auto max-h-64"> {/* Add this div for scrollable container */}
            {replies.map(reply => {
              const { time, date } = formatDateTime(reply.created_at);
              return (
                <article key={reply.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 relative">
                  <footer className="flex justify-between items-center mb-2 relative">
                    <div className="flex items-center">
                      <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img className="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt={reply.user.username} />
                        {reply.user.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate datetime={reply.created_at}>{date}</time> | {time}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDropdown(showDropdown === reply.id ? null : reply.id)} // Toggle dropdown visibility for specific reply
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      type="button">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                      </svg>
                      <span className="sr-only">Comment settings</span>
                    </button>
                    {showDropdown === reply.id && ( // Display dropdown if showDropdown matches reply.id
                      <div
                        className="absolute z-20 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 top-full right-0 mt-2">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <button
                              onClick={() => {
                                setEditingReplyId(reply.id);
                                setEditingReplyText(reply.reply_text);
                                setShowDropdown(false);
                              }}
                              className="block py-2 px-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </footer>
                  {editingReplyId === reply.id ? (
                    <div>
                      <textarea
                        value={editingReplyText}
                        onChange={(e) => setEditingReplyText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleEditReply(reply.id)}
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">{reply.reply_text}</p>
                  )}
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      type="button"
                      onClick={scrollToCommentSection}
                      className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                      <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l3-3-3-3v5h3a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <form onSubmit={handleSubmitReply}>
            <div ref={commentRef} className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">Your comment</label>
              <textarea
                id="comment"
                rows="3"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />
            </div>
            <Button
              label="Submit"
              type="submit"
              className="p-button-success"
              style={{ float: 'right', backgroundColor: '#4CAF50' }}
            />
          </form>
          {/* <div>Count: {count}</div> */}
        </Fieldset>
      )}
    </div>
  );
}

export default IssueDetail;

