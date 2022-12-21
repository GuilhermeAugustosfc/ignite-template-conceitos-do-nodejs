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

function getUser(headers) {
  if (!headers.hasOwnProperty("username")) return false;
  const username = headers.username;
  return (exitsUsername = users.find((user) => user.username == username));
}

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const exitsUsername = getUser(request.headers);
  if (!exitsUsername) {
    return response.status(400).send({ error: "not exits id todo" });
  }

  next();
}

app.post("/users", (request, response) => {
  const validCreate = getUser(request.body);
  if (validCreate) {
    return response.status(400).json({ error: "Usuario already exists" });
  }
  const username = request.body.username;
  const name = request.body.name;
  const newUser = {
    id: uuidv4(), // precisa ser um uuid
    name: name,
    username: username,
    todos: [],
  };
  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const user = getUser(request.headers);
  return response.json(user.todos).status(200);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = getUser(request.headers);
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
  const user = getUser(request.headers);
  const idTodo = request.params.id;
  const indexTodo = getIndexTodoById(user.username, idTodo);

  const new_title = request.body.title;
  const new_deadline = request.body.deadline;
  if (indexTodo > -1) {
    const todo = user.todos[indexTodo];
    todo.title = new_title;
    todo.deadline = new Date(new_deadline);
    return response.json(todo).status(201);
  } else {
    return response.status(404).send({ error: "not exits id todo" });
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = getUser(request.headers);

  const idTodo = request.params.id;
  const indexTodo = getIndexTodoById(user.username, idTodo);
  if (indexTodo > -1) {
    const todo = user.todos[indexTodo];
    todo.done = true;
    return response.json(todo);
  } else {
    return response.status(404).send({ error: "not exits id todo" });
  }
});
function getIndexTodoById(username, idTodo) {
  const indexUser = users.findIndex((user) => user.username == username);
  return users[indexUser].todos.findIndex((todo) => todo.id == idTodo);
}
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = getUser(request.headers);
  const idTodo = request.params.id;
  const indexTodo = getIndexTodoById(user.username, idTodo);
  if (user.todos && indexTodo > -1) {
    user.todos.splice(indexTodo, 1);
    return response.status(204).json(user);
  } else {
    return response.status(404).send({ error: "not exits id todo" });
  }
});

module.exports = app;
