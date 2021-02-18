const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const rotaPlanos = require('./routes/planos');
const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false})); // APENAS DADOS SIMPLES
app.use(bodyParser.json()); // JSON DE ENTRADA NO BODY

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/planos', rotaPlanos);
app.use('/usuarios', rotaUsuarios);

// QUANDO NAO ENCONTRA ROTA, ENTRA AQUI
app.use((req, res, next) => {
    const erro = new Error('Nao encontrado!');
    erro.status = 404;
    next(erro);  
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;