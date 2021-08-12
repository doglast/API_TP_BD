const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

//Retorna lista de todos usuarios
router.get('/', (req, res, next)=>{
  mysql.getConnection((error, conn)=>{
    conn.query(
      'SELECT * FROM filmes ',
      (error, result, field)=>{
        conn.release();
        if(error){
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(200).send({
          mensagem:'Consulta realizada com sucesso',
          filmes: result
        });
      }
    )
  })
});


//Insere um novo cliente
router.post('/', function(req, res, next) {
  mysql.getConnection((error, conn)=>{
    conn.query(
      'insert into filmes (Titulo, AnoLancamento, Tema, Imagem, Nota, Sinopse, Duracao) values (?, ?, ?, ?, ?, ?, ?)',
      [
        req.body.Titulo,
        req.body.AnoLancamento,
        req.body.Tema,
        req.body.Imagem,
        req.body.Nota,
        req.body.Sinopse,
        req.body.Duracao,
      ],
      (error, result, field)=>{
        conn.release();
        if(error){
          return res.status(500).send({
            error: error,
            response: null
          });
        }
        res.status(201).send({
          mensagem:'Filme inserido com sucesso',
          cliente: result
        });
      }
    )
  })
});


module.exports = router;