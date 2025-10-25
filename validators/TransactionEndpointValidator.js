// Validação de UUID usando regex

class TransactionEndpointValidator {
  /**
   * Valida todos os parâmetros do endpoint /api/validate
   * @param {Object} data - Dados a serem validados
   * @returns {Object} - Resultado da validação
   */
  static validateAll(data) {
    const { date, amount, payee_name, category_id } = data;
    const errors = [];

    // Verificar parâmetros obrigatórios
    const requiredParams = ['date', 'amount', 'payee_name', 'category_id'];
    const missingParams = requiredParams.filter(param => !data[param]);
    
    if (missingParams.length > 0) {
      errors.push(`Parâmetros obrigatórios ausentes: ${missingParams.join(', ')}`);
    }

    // Se há parâmetros ausentes, retornar erro imediatamente
    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        statusCode: 400
      };
    }

    // Validar cada parâmetro individualmente
    const dateValidation = this.validateDate(date);
    if (!dateValidation.isValid) {
      errors.push(dateValidation.error);
    }

    const amountValidation = this.validateAmount(amount);
    if (!amountValidation.isValid) {
      errors.push(amountValidation.error);
    }

    const payeeNameValidation = this.validatePayeeName(payee_name);
    if (!payeeNameValidation.isValid) {
      errors.push(payeeNameValidation.error);
    }

    const categoryIdValidation = this.validateCategoryId(category_id);
    if (!categoryIdValidation.isValid) {
      errors.push(categoryIdValidation.error);
    }

    return {
      isValid: errors.length === 0,
      errors,
      statusCode: errors.length > 0 ? 400 : 200
    };
  }

  /**
   * Valida formato da data
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Object} - Resultado da validação
   */
  static validateDate(date) {
    if (!date) {
      return {
        isValid: false,
        error: 'Data é obrigatória'
      };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return {
        isValid: false,
        error: 'Formato de data inválido. Use YYYY-MM-DD'
      };
    }

    // Validar se a data é válida
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return {
        isValid: false,
        error: 'Data inválida'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Valida o valor amount
   * @param {number} amount - Valor a ser validado
   * @returns {Object} - Resultado da validação
   */
  static validateAmount(amount) {
    if (amount === undefined || amount === null) {
      return {
        isValid: false,
        error: 'Amount é obrigatório'
      };
    }


    if (parseFloat(amount) <= 0) {
      return {
        isValid: false,
        error: 'Amount deve ser um número positivo'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Valida o nome do beneficiário
   * @param {string} payee_name - Nome a ser validado
   * @returns {Object} - Resultado da validação
   */
  static validatePayeeName(payee_name) {
    if (!payee_name) {
      return {
        isValid: false,
        error: 'Payee name é obrigatório'
      };
    }

    if (typeof payee_name !== 'string') {
      return {
        isValid: false,
        error: 'Payee name deve ser uma string'
      };
    }

    if (payee_name.trim().length === 0) {
      return {
        isValid: false,
        error: 'Payee name não pode estar vazio'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Valida o UUID da categoria
   * @param {string} category_id - UUID a ser validado
   * @returns {Object} - Resultado da validação
   */
  static validateCategoryId(category_id) {
    if (!category_id) {
      return {
        isValid: false,
        error: 'Category ID é obrigatório'
      };
    }

    if (typeof category_id !== 'string') {
      return {
        isValid: false,
        error: 'Category ID deve ser uma string'
      };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(category_id)) {
      return {
        isValid: false,
        error: 'Category ID deve ser um UUID válido'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Valida e retorna resposta JSON em caso de erro
   * @param {Object} data - Dados a serem validados
   * @param {Object} res - Response object do Express
   * @returns {boolean} - true se válido, false se inválido
   */
  static validateAndRespond(data, res) {
    const validation = this.validateAll(data);

    if (!validation.isValid) {
      res.status(validation.statusCode).json({
        success: false,
        error: validation.errors.join('; ')
      });
      return false;
    }

    return true;
  }

  /**
   * Middleware para validação de dados do endpoint
   * @param {Object} req - Request object do Express
   * @param {Object} res - Response object do Express
   * @param {Function} next - Next function do Express
   */
  static middleware(req, res, next) {
    const validation = this.validateAll(req.body);

    if (!validation.isValid) {
      return res.status(validation.statusCode).json({
        success: false,
        error: validation.errors.join('; ')
      });
    }

    next();
  }
}

module.exports = TransactionEndpointValidator;
