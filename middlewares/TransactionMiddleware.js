const ApiMiddleware = require('./ApiMiddleware');

class TransactionMiddleware {
  constructor(date, amount, payee_name, category_id, account_id = process.env.ACTUAL_ACCOUNT_ID, notes = "") {
    this.date = date;
    this.amount = amount;
    this.payee_name = payee_name;
    this.category_id = category_id;
    this.notes = notes;
    this.account_id = account_id;
  }

  get transaction() {
    return {
      date: this.date,
      amount: parseInt(this.amount) * 100,
      payee_name: this.payee_name,
      category: this.category_id,
      notes: this.notes,
    };
  }

  async addTransaction() {
    try {
      const apiInstance = new ApiMiddleware();
      const api = await apiInstance.init();
      
      // Usar importTransactions em vez de addTransactions para melhor reconciliação
      const result = await api.importTransactions(this.account_id, [this.transaction]);
      
      return {
        success: true,
        added: result.added,
        updated: result.updated,
        errors: result.errors,
        transaction: this.transaction
      };
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw new Error('Falha ao conectar com a API do Actual');
    }
  }
}

module.exports = TransactionMiddleware;