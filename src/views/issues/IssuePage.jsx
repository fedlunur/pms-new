import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import useAxios from "../../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import AuthContext from '../../context/AuthContext';
import './issuePage.css'; // Import the custom CSS file

const IssuePage = ({ task }) => {
  const taskId = task.id;


  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  const api = useAxios();
  let user_id = null;
  if (token) {
    const decoded = jwtDecode(token);
    user_id = decoded.user_id;
  }

  useEffect(() => {
    fetchComments();
  }, []);
  const getInitials = (firstName, middleName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const middleInitial = middleName ? middleName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${middleInitial}`;
  };
  const [showReplies, setShowReplies] = useState({}); 
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const fetchComments = async () => {
    try {
      const response = await api.get('/comments/');
      const formattedComments = response.data.map(comment => {
        const userInitials = getInitials(comment.user_data.first_name, comment.user_data.middle_name);
        const avatarUrl = `https://ui-avatars.com/api/?name=${userInitials}&background=random`;

        return {
          userId: comment.user.id,
          comId: comment.id,
          task: comment.task,
          fullName: `${comment.user_data.first_name} ${comment.user_data.middle_name}`,
          text: comment.text,
          avatarUrl: avatarUrl,
          replies: comment.replies.map(reply => {
            const replyUserInitials = getInitials(reply.user_data.first_name, reply.user_data.middle_name);
            const replyAvatarUrl = `https://ui-avatars.com/api/?name=${replyUserInitials}&background=random`;

            return {
              userId: reply.user.id,
              comId: reply.id.toString(),
              fullName: `${reply.user_data.first_name} ${reply.user_data.middle_name}`,
              userProfile: `https://www.example.com/profile/${reply.user.id}`,
              text: reply.text,
              avatarUrl: replyAvatarUrl
            };
          })
        };
      });
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentSubmit = async (text) => {
    try {
      const payload = {
        text,
        user: user_id,
        task: taskId,
        parent: null
      };
      const response = await api.post('/comments/', payload);
      const newComment = {
        userId: response.data.user,
        comId: response.data.id.toString(),
        fullName: response.data.user,
        userProfile: `https://www.example.com/profile/${response.data.user}`,
        text: response.data.text,
        avatarUrl: `https://ui-avatars.com/api/?name=${response.data.user}&background=random`,
        replies: []
      };
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplySubmit = async (data) => {
    console.log("Submitting reply data: the comment id is ", data.repliedToCommentId );
    try {
      const payload = {
        text: data.text,
        user: user_id,
        parent: data.parentId ? parseInt(data.parentId) : null,
        comment: data.repliedToCommentId ? parseInt(data.repliedToCommentId) : null // Parent comment ID
      };
  
      console.log("Payload for reply:", payload);
  
      const response = await api.post('/replies/', payload);
      const newReply = {
        userId: response.data.user, // Ensure this is correct and user details are included
        comId: response.data.comment,
        fullName: response.data.user.username, // Ensure user has a username field
        userProfile: `https://www.example.com/profile/${response.data.user.id}`, // Ensure user ID is correct
        text: response.data.text,
        avatarUrl: `https://ui-avatars.com/api/?name=${response.data.user.username}&background=random` // Ensure user has a username field
      };
  
      const updatedComments = comments.map(comment =>
        comment.comId === data.parentId ? { ...comment, replies: [...comment.replies, newReply] } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };
  

  const handleEdit = async (commentId, newText) => {
    try {
      const payload = {
        text: newText
      };
      const response = await api.put(`/comments/${commentId}/`, payload);
      const updatedComments = comments.map(comment =>
        comment.comId === commentId ? { ...comment, text: response.data.text } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };
  const customReplyStyles = {
    display: 'flex',
    backgroundColor:'Green',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const customIconStyles = {
    display: 'flex'
  };
  return (
    <div>
      <CommentSection
        currentUser={{
          currentUserId: user_id,
          currentUserImg: 'https://ui-avatars.com/api/?name=Riya&background=random',
          currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
          currentUserFullName: user.first_name
        }}
        hrStyle={{ border: '0.5px solid #ff0072' }}
        commentData={comments}
        logIn={{
          loginLink: 'http://localhost:3001/',
          signupLink: 'http://localhost:3001/'
        }}
        customImg='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=60'
        formStyle={{ backgroundColor: 'white' }}
        submitBtnStyle={{
          border: '1px solid black',
          backgroundColor: 'blue',
          color: 'white',
          padding: '7px 15px'
        }}
        cancelBtnStyle={{
          border: '1px solid gray',
          backgroundColor: 'gray',
          color: 'white',
          padding: '7px 15px'
        }}
        replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
        onSubmitAction={(data) => {

          console.log("££££££££The parent Id called inside On Submitt ",data.parentId)
          if (data.parentId) {
            handleReplySubmit(data);
          } else {
            handleCommentSubmit(data.text);
          }
        }}
        onDeleteAction={(commentId) => handleDelete(commentId)}
        onReplyAction={(data) => handleReplySubmit(data)}
        onEditAction={(commentId, newText) => handleEdit(commentId, newText)}
        className="custom-reply-btn"
      />
    </div>
  );
};

export default IssuePage;
