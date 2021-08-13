const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');

//Insere um novo cliente
router.post('/', function(req, res, next) {
  mysql.getConnection((error, conn)=>{
    if (error){ return res.status(500).send({error: error})}
    bcrypt.hash(req.body.Senha, 10, (errBcrypt, hash) =>{
      if(errBcrypt){
        return res.status(500).send({error: 'fudeu'})
      }
      conn.query(
        `INSERT INTO usuarios (Nome, Email, Senha) VALUES (?,?,?)`,
        [
          req.body.Nome,
          req.body.Email,
          hash
        ],
        (error, results)=>{
          conn.release();
          if(error){
            return res.status(500).send({error: error})
          }
          response = {
            mensagem: 'Usuário criado com sucesso',
            usuario:{
              Nome: req.body.Nome,
              Email: req.body.Email
            }
          }
          return res.status(201).send(response);
        }
      )
    })
  });
    
});

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


module.exports = router;