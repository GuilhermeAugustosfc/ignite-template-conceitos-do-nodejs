const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// {
// 	id: 'uuid', // precisa ser um uuid
// 	name: 'Danilo Vieira',
// 	username: 'danilo',
// 	todos: []

function getUser(username) {
  return (exitsUsername = users.find((user) => user.username == username));
}

function commitUser(user) {
  const index = users.findIndex((_users) => _users.username == user.username);
  users[index] = user;
}

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const exitsUsername = getUser(request.headers.username);
  if (!exitsUsername) {
    response.status(400).send("user not exists");
  }

  next();
}

app.post("/users", (request, response) => {
  const username = request.body.username;

  const validCreate = getUser(username);
  if (!validCreate) {
    response.status(404).send("username already exists");
  }

  const name = request.body.name;
  const newUser = {
    id: uuidv4(), // precisa ser um uuid
    name: name,
    username: username,
    todos: [],
  };
  users.push(newUser);

  return response.json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const user = getUser(request.headers.username);
  return response.json(user.todos).status(200);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = getUser(request.headers.username);
  const title = request.body.title;
  const deadline = request.body.deadline;
  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = getUser(request.headers.username);
  const id = request.params.id;

  const new_title = request.body.title;
  const new_deadline = request.body.deadline;

  try {
    const todo = user.todos[id];
    todo.title = new_title;
    todo.deadline = new Date(new_deadline);
    user.todos[id] = todo;

    commitUser(user);

    return response.json(user).status(201);
  } catch (error) {
    response.status(404).send("not exits id todo");
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = getUser(request.headers.username);
  const id = request.params.id;

  try {
    const todo = user.todos[id];
    todo.done = true;
    commitUser(user);
    return response.json(user);
  } catch (error) {
    response.status(404).send("not exits id todo");
  }
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = getUser(request.headers.username);
  const id = request.params.id;

  try {
    delete user.todos[id];
    commitUser(user);
    return response.json(user);
  } catch (error) {
    response.status(400).send("not exits id todo");
  }
});

module.exports = app;
