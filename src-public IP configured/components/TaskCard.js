// TaskCard.js
import React from "react";
import { Draggable } from "react-beautiful-dnd";

function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3>{task.task_name}</h3>
          <p>{task.description}</p>
          {/* Add editing and completion functionality here */}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
