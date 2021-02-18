//const mysql = require('../mysql').pool;  // se for voltar ao normal, usa esse mysql aqqqq
const mysql = require('../mysql'); // to usando o exports.getplanos com mysql.execute, nao precissa do .pool no final
const login = require('../middleware/login');

exports.getPlanos = async(req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM planos;")
        const response ={
            quantidade: result.length,
            planos: result.map(plan => {
                return {
                    id_plano: plan.id_plano,
                    nome: plan.nome,
                    preco: plan.preco,
                    detalhe: plan.detalhe,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um plano especifico',
                        url: 'http://localhost:3899/planos/' + plan.id_plano
                        }
                    }
                })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.postPlanos = async (req, res, next) => {
    try {
        const query = 'INSERT INTO planos (nome, preco, detalhe) VALUES (?,?,?)';
        const result = await mysql.execute(query,[
            req.body.nome, 
            req.body.preco,
            req.body.detalhe
        ]);
        const response = {
            mensagem: 'Plano inserido com sucesso',
            planoCriado: {
                id_plano: result.id_plano,
                nome: req.body.nome,
                preco: req.body.preco,
                detalhe: req.body.detalhe,
                request: {
                    tipo: 'POST',
                    descricao: 'Retorna todos os planos',
                    url: 'http://localhost:3899/planos/'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error})
    }
};

exports.getUmPlano = async (req, res, next) =>{
    try {
        const query = 'SELECT * FROM planos WHERE id_plano = ?;';
        const result = await mysql.execute(query,[req.params.id_plano]);
        if(result.length == 0){
            return res.status(404).send({
                mensagem: 'Nao foi encontrado plano com este ID'
            })
        }
        const response = {
            plano: {
                id_plano: result[0].id_plano,
                nome: result[0].nome,
                preco: result[0].preco,
                detalhe: result[0].detalhe,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os planos',
                    url: 'http://localhost:3899/planos/'
                }
            }
        }
        return res.status(200).send({response: result})
    } catch (error) {
        return res.status(500).send({ error: error})
    }
};

exports.updatePlano = async (req, res, next) =>{
    try {
        const query =`UPDATE planos 
                            SET nome             = ?,
                                preco            = ?,
                                detalhe          = ?
                            WHERE id_plano       = ?`;
        await mysql.execute(query,  
            [
                req.body.nome, 
                req.body.preco,
                req.body.detalhe,
                req.body.id_plano
            ]);
            const response = {
                mensagem: 'Plano atualizado com sucesso',
                planoAtualizado: {
                    id_plano: req.body.id_plano,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    detalhe: req.body.detalhe,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um plano especifico',
                        url: 'http://localhost:3899/planos/' + req.body.id_plano
                    }
                }
            }
            return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error})
    }
};

exports.deletePlano = async (req, res, next) =>{
    try {
        const query = `DELETE FROM planos WHERE id_plano = ?`;
        const result = await mysql.execute(query,[req.body.id_plano]);
        const response = {
            mensagem: 'Plano removido com sucesso',
            request: {
                tipo: 'POST', 
                descricao: 'Insere um plano',
                url: 'http://localhost:3899/plano',
                body: {
                    nome: 'String',
                    preco: 'Number',
                    detalhe: "String"
                }
            }
        }
    return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error})
    }
};

/* exports.getPlanos = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error}) }
        conn.query(
             'SELECT * FROM planos;',
            (error, result, field) => { 
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response ={
                    quantidade: result.length,
                    planos: result.map(plan => {
                        return {
                            id_plano: plan.id_plano,
                            nome: plan.nome,
                            preco: plan.preco,
                            detalhe: plan.detalhe,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um plano especifico',
                                url: 'http://localhost:3899/planos/' + plan.id_plano
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    })
}; */

/* exports.postPlanos =  (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error}) }
        conn.query(
            'INSERT INTO planos (nome, preco, detalhe) VALUES (?,?,?)',
            [
                req.body.nome, 
                req.body.preco,
                req.body.detalhe
            ],
            (error, result, field) => { 
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: 'Plano inserido com sucesso',
                    planoCriado: {
                        id_plano: result.id_plano,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        detalhe: req.body.detalhe,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os planos',
                            url: 'http://localhost:3899/planos/'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )   
    });
}; */

/*exports.getUmPlano = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error}) }
        conn.query(
             'SELECT * FROM planos WHERE id_plano = ?;',
                [req.params.id_plano],
            (error, result, field) => { 
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Nao foi encontrado plano com este ID'
                    })
                }
                const response = {
                    plano: {
                        id_plano: result[0].id_plano,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        detalhe: result[0].detalhe,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os planos',
                            url: 'http://localhost:3899/planos/'
                        }
                    }
                }
                return res.status(200).send({response: result})
            }
        )
    })
}; */

/* exports.updatePlano = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error}) }
        conn.query(
            `UPDATE planos 
                SET nome             = ?,
                    preco            = ?,
                    detalhe          = ?
                WHERE id_plano       = ?`,
            [
                req.body.nome, 
                req.body.preco,
                req.body.detalhe,
                req.body.id_plano
            ],
            (error, result, field) => { 
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: 'Plano atualizado com sucesso',
                    planoAtualizado: {
                        id_plano: req.body.id_plano,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        detalhe: req.body.detalhe,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um plano especifico',
                            url: 'http://localhost:3899/planos/' + req.body.id_plano
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )   
    });
}; */

/* exports.deletePlano = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error}) }
        conn.query(
            `DELETE FROM planos WHERE id_plano = ?`, [req.body.id_plano],
            (error, result, field) => { 
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: 'Plano removido com sucesso',
                    request: {
                        tipo: 'POST', 
                        descricao: 'Insere um plano',
                        url: 'http://localhost:3899/plano',
                        body: {
                            nome: 'String',
                            preco: 'Number',
                            detalhe: "String"
                        }
                    }
                }
               return res.status(202).send(response);
            }
        )   
    });
}; */