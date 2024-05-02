// TaskCardList.js

import TaskCard from "./TaskCard";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";

function TaskCardList({ tasks, activityId }) {
  console.log("I get the data " + tasks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if tasks is defined and not empty
    if (tasks && tasks.length > 0) {
      setIsLoading(false);
    }
  }, [tasks]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // Assuming tasks is an array, you can also check its length to handle empty data case
  if (tasks.length === 0) {
    return <div>No tasks found.</div>;
  }
  return (
    <DragDropContext>
      <Droppable droppableId={`activity-${activityId}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskCardList;
