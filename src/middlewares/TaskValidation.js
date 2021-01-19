const TaskModel = require('../model/TaskModel');
const { isPast } = require('date-fns');

const TaskValidation = async(req, res, next) => {
    
    // DESESTRUTURAÇÃO da requisição, ou seja, separando a req em variáveis/constantes
    const {macaddress, type, title, description, when} = req.body;

    if(!macaddress)
    return res.status(400).json({ error: 'Macaddress é obrigatório'});
    else if(!type)
    return res.status(400).json({ error: 'Tipo é obrigatório'});
    else if(!title)
    return res.status(400).json({ error: 'Título é obrigatório'});
    else if(!description)
    return res.status(400).json({ error: 'Descrição é obrigatório'});
    else if(!when)
    return res.status(400).json({ error: 'Data e Hora são obrigatórios'});
    // O when chega como texto, por isso na comparação da função isPast é realizado a conversão new Date() 
    else if (isPast(new Date(when)))
    return res.status(400).json({ error: 'Escolha uma data e hora futura'});
    // Só permite o cadastro se não houver uma tarefa para a pessoa na mesma data/horario
    else {

        let exists;

        // Permitir atualização de um registro (mesmo que seja na mesma data e horário)
        // Se nos parametros da requisição existe o tal id, signifia que ele quer atualizar a tarefa
        // Além de verificar pela data e macaddress ele inclui TAMBÉM comparação do id
        // Se existe o ID na requisição, significa que ele quer ALTERAR uma tarefa existente
        if(req.params.id){
            exists = await TaskModel.
                    findOne({ 
                        // operador '$ne' = negação/diferente -> ignorando o id da própria tarefa
                        // Alusão: tirando eu, tem alguma tarefa para essa mesma data e horário?
                        //         Se não tem uma outra tarefa com mesmo id, significa estar cadastrando uma tarefa nova
                        //         e portanto cairá no else seguinte
                        '_id': {'$ne': req.params.id},
                        'when': {'$eq': new Date(when)},
                        'macaddress': {'$in': macaddress}
                    });
                        
        } else {    
            // Espera ir na tabela da model, pesquisar por UM CARA (findOne) que seja igual ($eq) contido no mesmo macaddress ($in)
            exists = await TaskModel.
                    findOne({ 
                        // operador '$eq' = igual
                        'when': {'$eq': new Date(when)},
                        'macaddress': {'$in': macaddress}
                    });
            if(exists){
                return res.status(400).json({ error: 'já existe uma tarefa nesse dia e horário'});
            }
            // Avança para o cadastro da tarefa
            next();
        }
    }
}

module.exports = TaskValidation;