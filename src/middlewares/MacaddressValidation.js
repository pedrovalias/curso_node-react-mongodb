// recebe a requisição, a resosta e o next que será pra direcionar pra próxima função
const MacaddressValidation = (req, res, next) => {
    // Se o macaddress não existir, retorna mensagem de erro
    if(!req.body.macaddress)
        return res.status(400).json({ error: 'macaddress é obrigatório' });
    // caso constrário, permite seguir
    else
        next();
};

module.exports = MacaddressValidation;