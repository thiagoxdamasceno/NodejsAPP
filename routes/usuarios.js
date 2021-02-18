const express = require('express');
const router = express.Router();
//const mysql = require('../mysql').pool;
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const UsuariosControllers = require('../controllers//usuarios-controller');

router.post('/cadastro', UsuariosControllers.cadastrarUsuario);
router.post('/login', UsuariosControllers.loginUsuario);

module.exports = router;