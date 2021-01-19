// ##### Funções separadas dentro do Controller - BACKEND

const { response } = require('express');
const TaskModel = require('../model/TaskModel');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

// Constante para guardar a data e hora atual
const current = new Date();


// Criado como classe para poder atribuir e manipular atributos
class TaskController  {
    
    // Utilizando async/await para que ele aguarde o retorno do banco durante o processamento
    async create(req, res){
        // TaskModel recebe o que vem do corpo da requisição
        const task = new TaskModel(req.body);

        // Recebeu a requisição? 
        // .save() -> então SALVA no mongo
        // .then() -> ENTÃO se tudo der certo, pega a resposta e devolve pra quem solicitou (return res(200) - tudo certo)
        // .cath() -> SENÃO captura o erro e retorna o status 500 (erro) com o erro 
        await task.save()
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    // Função para atualizar os dados de uma tarefa
    async update(req, res) {
        
        // Resgatar os dados da tarefa por determinado id a ser atualizada
        // id vem da routes | passa pelo corpo da requisição e altera o item | retorna os dados da tarefa atualizado (new: true)
        // *** Se não usar a propriedade new: true, ele retornará a tarefa conforme era ANTES de ser atualizada

        await TaskModel.findByIdAndUpdate({'_id': req.params.id}, req.body, { new: true })
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    // Rota para listar todas as tarefas
    async all(req, res) {
        // Encontrar todos os valores baseado no filtro de macaddress (para mostrar só as tarefas de determinado dispositivo)
        await TaskModel.find( { macaddress: {'$in': req.body.macaddress} })
              //traz organizado por data e hora (sort)
              .sort('when')
              // Se caso der tudo certo, retorna status sucesso
              .then(response => {
                  return res.status(200).json(response);
              })
              //Caso constrário retorna erro
              .catch(error => {
                  return res.status(500).json(error);
              });
    }

    // Mostrar uma única tarefa
    async show(req, res) {
        // Busca tarefa pelo ID. Se existir uma resposta (logo, uma tarefa) ele retorna a tarefa
        // e se não existir ele retorna 404 (not found) e mensagem informando que a tarefa não foi encontrada
        // mas se tiver algum erro, retorna no catch 
        await TaskModel.findById(req.params.id)
        .then(response => {
            if(response)
                return res.status(200).json(response);
            else
                return res.status(404).json({ rror: 'tarefa não encontrada'});
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    // Função para excluir uma tarefa
    async delete(req, res) {
        await TaskModel.deleteOne({'_id': req.params.id})
              .then(response => {
                  return res.status(200).json(response); 
              })
              .catch(error => {
                  return res.status(500).json(error);
              });  
    }

    // Alterar o status de uma tarefa
    async done(req, res) {
        // Busca a tarefa pelo ID
        await TaskModel.findByIdAndUpdate(
            {'_id': req.params.id},     // passa o ID como parâmetro
            {'done': req.params.done},  // passa o campo que ele quer atualizar
            {new: true})                // retorna o valor da tarefa atualizado
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }

    // Exibir tarefas atrasadas
    async late(req, res) {
        // Procura por tarefas cujo data e hora sejam anteriores à data atual - operador '$ld' = less then = menor que
        // Também filtra por macaddress pois queremos apenas as tarefas do dispositivo (usuário) que está solicitando
        await TaskModel.find({
            'when': {'$lt': current},
            'macaddress': {'$in': req.body.macaddress}
        })
        .sort('when')
        .then( response => {
            return res.status(200).json(response);
        })
        .catch( error => {
            return res.status(500).json(error);
        });
    }

    // Filtrar as tarefas do dia
    async today(req, res) {
        // Operador '$gte' = great or equal then = maior ou igual
        // Utiliza funções que a biblioteca date-fns fornece referente ao início e fim do dia para utilizarmos na comparação
        // ou seja: essa função filtra os registros do dia corrente
        await TaskModel.find({
            'macaddress': {'$in': req.body.macaddress},
            'when': {'$gte': startOfDay(current) , '$lte': endOfDay(current)}
        })
        .sort('when')
        .then( response => {
            return res.status(200).json(response);
        })
        .catch( error => {
            return res.status(500).json(error);
        });
    }

    // Filtrar as tarefas da semama
    async week(req, res) {
        await TaskModel.find({
            'macaddress': {'$in': req.body.macaddress},
            'when': {'$gte': startOfWeek(current), '$lte': endOfWeek(current)}
        })
        .sort('when')
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    // Filtrar as tarefas por mês
    async month(req, res){
        await TaskModel.find({
            'macaddress': {'$in': req.body.macaddress},
            'when': {'$gte': startOfMonth(current), '$lte': endOfMonth(current)}
        })
        .sort('when')
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }
}

module.exports = new TaskController();
