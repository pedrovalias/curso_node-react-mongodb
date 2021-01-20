// #### Aqui ficam as rotas e qual rota chama qual função

const express = require('express');
// Utiliza um componente ROUTER do express
const router = express.Router();

const TaskController = require('../controller/TaskController');

const TaskValidation = require('../middlewares/TaskValidation');

const MacaddressValidation = require('../middlewares/MacaddressValidation');


// Para validação do campo ao chegar a requisição, passa no método post a rota PRIMEIRO a validação e então o create
router.post('/', TaskValidation, TaskController.create);

// Essas rotas então com mesmo caminho, porém observa-se que são ligadas a verbos HTTPs diferentes, portanto, ações independentes
router.put('/:id', TaskController.update);
router.get('/:id', TaskController.show); // nesse caso não precisa nem de validação, uma vez que busca tarefas por ID, e ID é único
router.delete('/:id', TaskController.delete);
router.put('/:id/:done', TaskController.done);

router.get('/filter/all', MacaddressValidation, TaskController.all);
router.get('/filter/late', MacaddressValidation, TaskController.late);
router.get('/filter/today', MacaddressValidation, TaskController.today);
router.get('/filter/week', MacaddressValidation, TaskController.week);
router.get('/filter/month', MacaddressValidation, TaskController.month);
router.get('/filter/year', MacaddressValidation, TaskController.year);

module.exports = router;