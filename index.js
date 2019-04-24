
const express = require('express');
const cors = require('cors')
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()) //habilitando cors na nossa aplicacao

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//filtrando
router.get('/users/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Users' + filter, res);
});

//deletando
router.delete('/users/:id', (req, res) =>{
    execSQLQuery('DELETE FROM Users WHERE ID=' + parseInt(req.params.id), res);
});

//inserindo
router.post('/users', (req, res) =>{
    const name = req.body.name.substring(0,150);
    const email = req.body.email.substring(0,11);
    const password = req.body.password.substring(0,11);
    const phone = req.body.phone.substring(0,11);
    const isAdmin = req.body.isAdmin.substring(0,11);

    execSQLQuery(`INSERT INTO Users(name, email, password, phone, isAdmin) VALUES('${name}','${email}','${password}','${phone}','${isAdmin}')`, res);
});

//atualizando
router.patch('/users/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const name = req.body.name.substring(0,150);
    const email = req.body.email.substring(0,11);
    const password = req.body.password.substring(0,11);
    const phone = req.body.phone.substring(0,11);
    const isAdmin = req.body.isAdmin.substring(0,11);

    execSQLQuery(`UPDATE Users SET name='${name}', email='${email}', password='${password}', phone='${phone}', isAdmin='${isAdmin}' WHERE ID=${id}`, res);
});


//authentication
app.post('/users', (req, res, next) => {
  if(req.body.user === 'rdo' && req.body.pwd === '123'){
    //auth ok
    const id = 1; //esse id viria do banco de dados
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    });
    res.status(200).send({ auth: true, token: token });
    console.log('Login válido')
  }
  
  res.status(500).send('Login inválido!');
  console.log('Login inválido');
});

//inicia o servidor
app.listen(port);
console.log('API funcionando!');



  
function execSQLQuery(sqlQry, res){
    const connection = mysql.createConnection({
      host: 'mysql995.umbler.com',
      port: 41890,
      user: 'rdovarel',
      password: 'Perfect575429',
      database: 'financialcontrol'
    });
  
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
  }
  
