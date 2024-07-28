// TodoList.js

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAxios from "../utils/useAxios";

function TodoList() {
  const api = useAxios();
  const [todos, setTodos] = useState([]);

  const token = localStorage.getItem("authTokens");

  if (token) {
    const decode = jwtDecode(token);
    var user_id = decode.user_id;
    var username = decode.username;
    var full_name = decode.full_name;
  }
  console.log("here is data ===>  " + user_id + username + full_name);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/protodo/api/todos/");

      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  return (
    <div className="container-fluid" style={{ paddingTop: 100 }}>
      <h2>Todos</h2>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
