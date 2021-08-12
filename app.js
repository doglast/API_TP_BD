const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const rotaUsuarios = require('./routes/usuarios');
const rotaFilmes = require('./routes/filmes');
const rotaSeries = require('./routes/series');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Access, Authorization'
    );
    if(req.method === 'OPTIONS'){
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).send({});
    }

    next();
})

app.use('/usuarios', rotaUsuarios);
app.use('/filmes', rotaFilmes);
app.use('/series', rotaSeries);

app.use((req, res, next)=>{
  const error = new Error('Não encontrado');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next)=>{
  res.status(error.status || 500);
  return res.send({
    erro:{
      mensagem: error.message
    }
  })
})

module.exports = app;