"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { signOut, user } = useAuthenticator();

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [groups, setGroups] = useState([]);

  const [groupName, setGroupName] = useState("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  async function listGroupsForUser() {
    client.mutations.listGroupsForUser()
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  useEffect(() => {
    listTodos();
    listGroupsForUser()
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  async function addUserToGroup() {
    await client.mutations.addUserToGroup({
      groupName,
      userId: user.userId,
    });
  }

  return (
    <main>
      <div className="container">
        <div className="left">
          <h2>Signed in as {user?.signInDetails?.loginId}</h2>
          <button onClick={signOut}>Sign out</button>
          <div>
            <h2>Join group</h2>
            <div className="groupBlock">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button onClick={addUserToGroup}>Join group</button>
            </div>

            <ul>
              {groups.map((group) => (
                <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                  {todo.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul> */}
    </main>
  );
}
