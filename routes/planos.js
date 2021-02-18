const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');

const PlanosController = require('../controllers/planos-controller');

router.get('/',login.opcional, PlanosController.getPlanos); // RETORNA TODOS OS PLANOS
router.post('/' ,login.opcional , PlanosController.postPlanos); // INSERE UM PLANO
router.get('/:id_plano', PlanosController.getUmPlano); // RETORNA OS DADOS DE UM PLANO
router.patch('/', login.opcional, PlanosController.updatePlano); // ALTERA UM PLANO
router.delete('/', login.opcional, PlanosController.deletePlano); // REMOVE UM PLANO

module.exports = router;