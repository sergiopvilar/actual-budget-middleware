let api = require('@actual-app/api');
require('dotenv').config();

class ApiMiddleware {

  async init() {
    try {
      // Inicializar a API
      await api.init({
        // Budget data will be cached locally here, in subdirectories for each file.
        dataDir: '.actual',
        // This is the URL of your running server
        serverURL: process.env.ACTUAL_SERVER_URL,
        // This is the password you use to log into the server
        password: process.env.ACTUAL_PASSWORD,
      });

      // Obter lista de orçamentos disponíveis
      const budgets = await api.getBudgets();
      console.log('Orçamentos disponíveis:', budgets);
      
      if (budgets.length === 0) {
        throw new Error('Nenhum orçamento encontrado no servidor');
      }

      // Usar o primeiro orçamento disponível ou o especificado em ACTUAL_BUDGET_ID
      let budgetId = process.env.ACTUAL_BUDGET_ID;
      
      if (!budgetId) {
        // Para orçamentos locais, usar 'id', para remotos usar 'groupId' (ID de Sincronização)
        const budget = budgets[0];
        budgetId = budget.id || budget.groupId;
        console.log('Usando orçamento automático:', budgetId, 'do orçamento:', budget);
        console.log('budgetId tipo:', typeof budgetId, 'valor:', budgetId);
      } else {
        console.log('Usando orçamento especificado:', budgetId);
        console.log('budgetId tipo:', typeof budgetId, 'valor:', budgetId);
      }
      
      // Carregar o orçamento
      const budget = budgets.find(b => (b.id || b.groupId) === budgetId);
      
      if (budget && budget.state === 'remote') {
        console.log('Orçamento é remoto, fazendo download...');
        console.log('Usando syncId:', budgetId, 'tipo:', typeof budgetId);
        try {
          console.log('Tentando downloadBudget com ID de Sincronização:', budgetId);
          await api.downloadBudget(budgetId, { password: process.env.ACTUAL_PASSWORD });
        } catch (downloadError) {
          console.log(downloadError);
          
          console.log('Erro ao fazer download do orçamento:', downloadError.message);
          throw new Error(`Não foi possível fazer download do orçamento remoto: ${budgetId}`);
        }
      } else {
        console.log('Orçamento é local, carregando...');
        console.log('Usando syncId:', budgetId, 'tipo:', typeof budgetId);
        try {
          await api.loadBudget({ syncId: budgetId });
        } catch (loadError) {
          console.log('Erro ao carregar orçamento local:', loadError.message);
          throw new Error(`Não foi possível carregar o orçamento local: ${budgetId}`);
        }
      }

      // Verificar se o orçamento foi carregado corretamente
      console.log('Orçamento carregado com sucesso');
      
      return api;
    } catch (error) {
      console.error('Erro ao inicializar API do Actual:', error);
      throw new Error('Falha ao conectar com o servidor Actual');
    }
  }  
}

module.exports = ApiMiddleware;