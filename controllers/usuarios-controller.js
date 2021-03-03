const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async (req, res, next) => {
    try {
        console.log(req.body);
        var query = `SELECT * FROM usuarios WHERE email = ?`;
        var result = await mysql.execute(query, [req.body.email]);
        if (result.length > 0) {
            return res.status(409).send({ mensagem: 'Usuário já cadastrado' })
        }
        const hash = await bcrypt.hashSync(req.body.senha, 10);
        query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?)';
        const results = await mysql.execute(query, [req.body.nome, req.body.email,hash]);
        response = {
            mensagem: 'Usuario criado com sucesso',
            usuarioCriado: {
               id_usuario: results.insertId,
                nome: req.body.nome,
                email: req.body.email
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error}) 
    }
};

exports.loginUsuario = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        var results = await mysql.execute(query, [req.body.email]);

        console.log(results);

        if (results.length < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }
        if (await bcrypt.compareSync(req.body.senha, results[0].senha)) {
            const token = jwt.sign({
                id_usuario: results[0].id_usuario,
                nome: results[0].nome,
                email: results[0].email
            },
        
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            });
            return res.status(200).send({
                mensagem: 'Autenticado com sucesso',
                token: token,
            });
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
    } catch (error) {
        return res.status(401).send({ mensagem: 'Falha na autenticação'});
    }
};

exports.updateUsuarioPlano = async (req, res, next) =>{
    try {
        const query =`UPDATE usuarios 
                            SET
                                id_plano          = ?
                            WHERE id_usuarios       = ?`;
        await mysql.execute(query,  
            [
                req.body.id_plano,
                req.body.id_usuario,
            ]);
            const response = {
                mensagem: 'Usuario atualizado com sucesso',
                usuarioAtualizado: {
                    id_plano: req.body.id_plano,
                    id_usuario: req.body.id_usuario,
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Atualiza o usuario com um plano especifico',
                        url: 'http://localhost:3899/usuarios/' + req.body.id_usuario
                    }
                }
            }
            return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error})
    }
};
