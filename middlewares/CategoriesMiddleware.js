const ApiMiddleware = require('./ApiMiddleware');

class CategoriesMiddleware {
  static async getCategories() {
    try {
      const apiInstance = new ApiMiddleware();
      const api = await apiInstance.init();
      return await api.getCategories();
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      throw new Error('Falha ao conectar com a API do Actual');
    }
  }
}

module.exports = CategoriesMiddleware