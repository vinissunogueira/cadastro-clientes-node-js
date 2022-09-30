/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo para criar ou editar  um recurso (JSON)
 */

/** Middleware:
 * 
 * InterCEPtador de requisições que pode interromper uma requisição
 * ou alterar dados de uma requisição 
*/

const express = require('express');
const { uuid, isUuid } = require ('uuidv4');  

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
/** 
  A linha abaixo aplica o midlleware para todas as rotas iniciadas
  por /projects/:id (Alteração e deleção).
  Com ela poderia ser retirado o Nome da função dos métodos put e delete
*/
app.use('/users/:id', validateUserId);

const users = [];

// Função que mostra logs para exemplificar midlleware
function logRequests(request, response, next) {
  const {method, url} =request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next();

}

app.use(logRequests); // Chama a função (midlleware) logRequests

function validateUserId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)) 
     return (response.status(400).json({ error: 'Invalid user ID. (Middleware)' }));

  return next();

}

// Listagem de usuários
app.get('/users', (request, response) => {
  const { Nome, Email, CPF, Telefone, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP } = request.query;

  // Filtro (Query inserida no insomnia) por Nome
  results = Nome ?
    users.filter(user => user.Nome.includes(Nome)) :
    users;

  // Filtro (Query inserida no insomnia) por Email
  results = Email ?
    results.filter(user => user.Email.includes(Email)) :
    results;

  // Filtro (Query inserida no insomnia) por CPF
  results = CPF ?
    users.filter(user => user.CPF.includes(CPF)) :
    users;

  // Filtro (Query inserida no insomnia) por Telefone
  results = Telefone ?
    users.filter(user => user.Telefone.includes(Telefone)) :
    users;

  // Filtro (Query inserida no insomnia) por Logradouro
    results = Logradouro ?
    users.filter(user => user.Logradouro.includes(Logradouro)) :
    users;

  // Filtro (Query inserida no insomnia) por Numero
  results = Numero ?
  users.filter(user => user.Numero.includes(Numero)) :
  users;

  // Filtro (Query inserida no insomnia) por Complemento
    results = Complemento ?
    users.filter(user => user.Complemento.includes(Complemento)) :
    users;

  // Filtro (Query inserida no insomnia) por Bairro
    results = Bairro ?
    users.filter(user => user.Bairro.includes(Bairro)) :
    users;

  // Filtro (Query inserida no insomnia) por Cidade
    results = Cidade ?
    users.filter(user => user.Cidade.includes(Cidade)) :
    users;

  // Filtro (Query inserida no insomnia) por Estado
    results = Estado ?
    users.filter(user => user.Estado.includes(Estado)) :
    users;

  // Filtro (Query inserida no insomnia) por CEP
    results = CEP ?
    users.filter(user => user.CEP.includes(CEP)) :
    users;

  return response.json(results);
});

// Inclusão de usuários
app.post('/users', (request, response) => {
  const { Nome, Email, CPF, Telefone, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP } = request.body;
  const id = uuid ();

  const user = { id, Nome, Email, CPF, Telefone, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP };
  users.push(user);

  return response.json(user);
});

// Alteração de usuários
app.put('/users/:id', validateUserId, (request, response) => {
  const { id } = request.params;
  const { Nome, Email, CPF, Telefone, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP } = request.body;

  userIndex = users.findIndex(user => user.id === id);

  if (userIndex < 0) {
    return response.status(400).json({ error: 'Usuário não encontrado'});
  }

  const user = { id, Nome, Email, CPF, Telefone, Logradouro, Numero, Bairro, Complemento, Cidade, Estado, CEP};

  users[userIndex] = user;

  return response.json(user);
});

// Deleção de usuários
app.delete('/users/:id', validateUserId, (request, response) => {
  const { id } = request.params;

  userIndex = users.findIndex(user => user.id === id);

  if (userIndex < 0) {
    return response.status(400).json({ error: 'Usuário não encontrado'});
  }

  users.splice(userIndex, 1);

  return response.json({ 'delete': 'Usuário excluído com sucesso' });

});

app.listen(3333, () => {
  console.log('Servidor iniciado.')
});