const express = require('express');
const TokenValidator = require('./validators/TokenValidator');
const TransactionEndpointValidator = require('./validators/TransactionEndpointValidator');
const TransactionMiddleware = require('./middlewares/TransactionMiddleware');
const CategoriesMiddleware = require('./middlewares/CategoriesMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Middleware de timeout para evitar requisições travadas
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: 'Timeout da requisição'
      });
    }
  }, 30000); // 30 segundos

  res.on('finish', () => clearTimeout(timeout));
  next();
});

// Middleware global para capturar erros não tratados
app.use((error, req, res, next) => {
  console.error('Erro não tratado capturado:', error);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/get-categories', async (req, res) => {
  try {
    const { token } = req.query;
    if (!TokenValidator.validateAndRespond(token, res)) {
      return;
    }

    const response = await CategoriesMiddleware.getCategories();

    res.status(200).json({
      success: true,
      message: 'Categorias obtidas com sucesso',
      data: response
    });
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Exemplo de endpoint adicional que usa a validação de token
app.post('/api/add-transaction', async (req, res) => {
  try {
    const { token, date, amount, payee_name, category_id, notes } = req.body;
    console.log(token)
    // Usar a classe TokenValidator para validar o token
    if (!TokenValidator.validateAndRespond(token, res)) {
      return;
    }

    // Validar parâmetros da transação
    if (!TransactionEndpointValidator.validateAndRespond(req.body, res)) {
      return;
    }

    const transactionMiddleware = new TransactionMiddleware(date, amount, payee_name, category_id, notes);
    const response = await transactionMiddleware.addTransaction();

    res.status(200).json({
      success: true,
      message: 'Transação adicionada com sucesso',
      data: response
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado'
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Exceção não capturada:', error);
  // Não encerrar o processo, apenas logar o erro
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', reason);
  // Não encerrar o processo, apenas logar o erro
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Endpoint: POST http://localhost:${PORT}/api/validate`);
});
