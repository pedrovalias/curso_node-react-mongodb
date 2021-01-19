const express = require('express'); // importa o express
const server = express();           // inicializa o express

// informa que a aplicação irá receber e devolver em formato json
server.use(express.json());

const TaskRoutes = require('./routes/TaskRoutes');

// Injeta o arquivo que tem todas as rotas da aplicação na API
server.use('/task', TaskRoutes);

// Função para ele ficar ESCUTANDO em uma determinada porta
// ArrowFunctions são basicamente funções anônimas (SEM NOME)
server.listen(3000, () => {
    console.log('API ONLINE');
});

