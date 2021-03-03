const express = require('express');
const router = express.Router();

const UsuariosControllers = require('../controllers//usuarios-controller');

router.post('/cadastro', UsuariosControllers.cadastrarUsuario);
router.post('/login', UsuariosControllers.loginUsuario);
router.patch('/', UsuariosControllers.updateUsuarioPlano);

module.exports = router;