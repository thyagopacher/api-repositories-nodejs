const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/** faz a validação do ID de projeto */
function validateProjectId(request, response, next){
  const { id } = request.params;
  const ehUUid = uuidValidate(id);
  if(!ehUUid){
      return response.status(400).json({ error: 'Invalid repositorie ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = { id: uuidv4(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  const repositorie = {
    id,
    title,
    url, 
    techs
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
