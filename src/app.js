const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// List all repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// Create a new repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const likes = 0;

  const newRepository = { id, title, url, techs, likes };

  repositories.push(newRepository);

  return response.json(newRepository)
});

// Update an existing repository
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!id) {
    return response.status(400).json('Id cant be empty');
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1) {
    return response.status(400).send('None repository found by the given id');
  }

  const likes = repositories[repositoryIndex].likes;

  const newContent = { id, title, url, techs, likes };

  repositories[repositoryIndex] = newContent;

  return response.json(repositories[repositoryIndex]);
});

// Delete an existing repository
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!id) {
    return response.status(400).json('Id cant be empty');
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1) {
    return response.status(400).send('None repository found by the given id');
  }
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// Like an existing repository
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if(!id) {
    return response.status(400).send();
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1) {
    return response.status(400).send('None repository found by the given id');
  }

  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
