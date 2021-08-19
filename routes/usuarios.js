const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Insere um novo cliente
router.post('/cadastro', function(req, res, next) {
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
router.post('/login', (req, res, next)=>{
  mysql.getConnection((error, conn)=>{
    if(error){return res.status(500).send({erro: error})}
    conn.query(
      `SELECT * FROM usuarios WHERE Email = ?`, 
      [req.body.Email],
      (error, results, fields)=>{
        conn.release();
        if(error){
          return res.status(500).send({erro:error})
        }
        if(results.length < 1){
          return res.status(401).send({mensagem: 'Falha na autenticação'});
        }
        bcrypt.compare(req.body.Senha, results[0].Senha, (error, result)=>{
          if(error){
            return res.status(401).send({mensagem: 'Falha na autenticação'});
          }
          if(result){
            const token = jwt.sign({
              idUsuario: results[0].idUsuario,
              Email: results[0].Email
            }, 
            'tpbd',
            {
              expiresIn:"1h"
            }
            );
            return res.status(200).send({ 
              mensagem: 'Autenticado com sucesso',
              token: token
            });
          }
          return res.status(401).send({mensagem: 'Falha na autenticação'});
        })
      })
  })
});


module.exports = router;