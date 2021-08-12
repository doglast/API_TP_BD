const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

//Retorna lista de todos usuarios
router.get('/', (req, res, next)=>{
  mysql.getConnection((error, conn)=>{
    conn.query(
      'SELECT Nome, Email FROM usuarios ',
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
          usuarios: result
        });
      }
    )
  })
});


//Insere um novo cliente
router.post('/', function(req, res, next) {
  mysql.getConnection((error, conn)=>{
    conn.query(
      'INSERT INTO usuarios (Nome, Email, Senha) VALUES (?,?,?)',
      [
        req.body.Nome,
        req.body.Email,
        req.body.Senha
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
          mensagem:'Usuário inserido com sucesso',
          cliente: result
        });
      }
    )
  })
});


module.exports = router;