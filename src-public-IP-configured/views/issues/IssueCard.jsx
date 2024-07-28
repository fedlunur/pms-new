import React, { useState, useEffect } from 'react';

function IssueCard({ issue, onViewComments, buttonRef }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setCommentCount(issue.replies.length);
  }, [issue.replies]);

  const handleButtonClick = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    onViewComments(issue.id, buttonRect);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');
  };

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{issue.title}</h5>
      </a>
      {issue.description.split(' ').length > 25 ? (
        <div>
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            {showFullDescription ? issue.description : truncateDescription(issue.description)}
          </p>
          <button
            onClick={toggleDescription}
            className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            type="button"
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        </div>
      ) : (
        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{issue.description}</p>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleButtonClick}
          ref={buttonRef}
          className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong relative"
          type="button"
        >
          Comments
          {commentCount > 0 && (
            <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-700 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
              {commentCount > 99 ? '99+' : commentCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default IssueCard;
