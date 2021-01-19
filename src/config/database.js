const mongoose = require('mongoose');

// Define a URL de conexão com o Mongo
// estrutura: mongodb://LOCAL:PORTA/NOME_BANCO
const url = 'mongodb://localhost:27017/todo';

// Inicializa o mongoose passando a URL criada e um OBJETO DE CONFIGURAÇÃO para que ele tenha compatibilidade com outras versões de mongo
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});

// Exporta a constante mongoose para utilização em outros módulos
module.exports = mongoose;