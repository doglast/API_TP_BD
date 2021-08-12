const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

//Retorna lista de todos usuarios
router.get('/', (req, res, next)=>{
  mysql.getConnection((error, conn)=>{
    conn.query(
      'SELECT * FROM series ',
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
      'INSERT INTO usuarios (Titulo, AnoLancamento, Tema, Imagem, Nota, Sinopse, Duracao, SerieStatus, Horario, Canal) VALUES (?, ?, ?, ? , ? , ?, ?, ?, , ?, ?)',
      [
        req.body.Titulo,
        req.body.AnoLancamento,
        req.body.Tema,
        req.body.Imagem,
        req.body.Nota,
        req.body.Sinopse,
        req.body.Duracao,
        req.body.SerieStatus,
        req.body.Horario,
        req.body.Canal,
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
          mensagem:'Série inserida com sucesso',
          cliente: result
        });
      }
    )
  })
});


module.exports = router;