// #### Aqui ficam as rotas e qual rota chama qual função

const express = require('express');
// Utiliza um componente ROUTER do express
const router = express.Router();

const TaskController = require('../controller/TaskController');

const TaskValidation = require('../middlewares/TaskValidation');


// Para validação do campo ao chegar a requisição, passa no método post a rota PRIMEIRO a validação e então o create
router.post('/', TaskValidation, TaskController.create);

// Essas rotas então com mesmo caminho, porém observa-se que são ligadas a verbos HTTPs diferentes, portanto, ações independentes
router.put('/:id', TaskController.update);
router.get('/:id', TaskController.show); // nesse caso não precisa nem de validação, uma vez que busca tarefas por ID, e ID é único
router.delete('/:id', TaskController.delete);
router.put('/:id/:done', TaskController.done);

// Passando o macaddress por parâmetro, portanto não se faz necessário mais a validação do macadress porque ele acaba sendo obrigatório
router.get('/filter/all/:macaddress', TaskController.all);
router.get('/filter/late/:macaddress', TaskController.late);
router.get('/filter/today/:macaddress', TaskController.today);
router.get('/filter/week/:macaddress', TaskController.week);
router.get('/filter/month/:macaddress', TaskController.month);
router.get('/filter/year/:macaddress', TaskController.year);

module.exports = router;