const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //const decode = jwt.verify(req.body.token, process.env.JWT_KEY);  //PEGA O TOKEN PELO BODY 
        const decode = jwt.verify(token, process.env.JWT_KEY); // PASSANDO PELO BEARER HEADER
        req.usuario = decode;
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: 'Falha na autenticacao'});
    }
    
}

exports.opcional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (error) {
        next();
    }
    
}