const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
  }
})

const fileFilter = (req, file, callBack) =>{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
    callBack(null, true);
  }else{
    callBack(null, false);
  }
}

const upload = multer({
  storage,
  limits:{
    fileSize: 1024 * 1024 *10
  },
  fileFilter: fileFilter
});


//Retorna lista de todos filmes
router.get('/lista', (req, res, next)=>{
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


//Insere um novo filme
router.post('/cadastro' ,function(req, res, next) {
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