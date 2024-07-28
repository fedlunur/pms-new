import React from "react";
import "../Todolist.css"; // app one folder
import { useState } from "react";
import {
  BiCheckDouble,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
  BiRefresh,
  BiBookAdd,
} from "react-icons/bi";

const TaskActivitiesTutorial = () => {
  const [todos, setTodos] = useState([]);
  const [inputvalue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  const addTodo = () => {
    if (inputvalue.trim() !== "") {
      if (editIndex === -1) {
        setTodos([...todos, { task: inputvalue, completed: false }]);
      } else {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = {
          task: inputvalue,
          completed: updatedTodos[editIndex].completed,
        };
        setTodos(updatedTodos);
        setEditIndex(-1);
      }
      setInputValue("");
    }
  };

  const startEdit = (index) => {
    setInputValue(todos[index].task);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setInputValue("");
    setEditIndex(-1);
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const toggleCompleted = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <div className="todo-container ">
        <h1>To Do list</h1>
        <div className="input-section">
          <input
            placeholder="please add new task"
            value={inputvalue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            className="input-field"
          />
          {editIndex !== -1 ? (
            <>
              <button onClick={addTodo} className="update-btn">
                <BiCheckDouble />
              </button>
              <button onClick={cancelEdit} className="cancel-btn">
                <BiRefresh />
              </button>
            </>
          ) : (
            <>
              <button onClick={addTodo} className="add-btn">
                <BiBookAdd />
              </button>
            </>
          )}
        </div>

        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={index} className={todo.completed ? "completed" : ""}>
              {todo.task}
              <div className="btn-group">
                <button onClick={() => startEdit(index)} className="btn-edit">
                  <BiEdit />
                </button>
                <button
                  onClick={() => removeTodo(index)}
                  className="btn-remove"
                >
                  <BiTrash />
                </button>
                <button
                  className="btn-done"
                  onClick={() => toggleCompleted(index)}
                >
                  {todo.completed ? <BiReset /> : <BiCheckCircle />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskActivitiesTutorial;
