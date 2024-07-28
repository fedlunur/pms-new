import React from "react";

const Card = ({ task_name, activity }) => {
  return (
    <div className="card">
      <h3>{task_name}</h3>
      <p>{activity}</p>
    </div>
  );
};

export default Card;
