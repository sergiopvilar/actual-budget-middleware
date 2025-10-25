class TokenValidator {
  /**
   * Valida se o token fornecido corresponde ao token da variável de ambiente
   * @param {string} token - Token a ser validado
   * @param {string} envToken - Token da variável de ambiente
   * @returns {Object} - Resultado da validação
   */
  static validateToken(token, envToken) {
    // Verificar se o token foi fornecido
    if (!token) {
      return {
        isValid: false,
        error: 'Token é obrigatório',
        statusCode: 400
      };
    }

    // Verificar se o token corresponde à variável de ambiente
    if (token !== envToken) {
      return {
        isValid: false,
        error: 'Token inválido',
        statusCode: 401
      };
    }

    return {
      isValid: true,
      error: null,
      statusCode: 200
    };
  }

  /**
   * Valida token usando a variável de ambiente TOKEN
   * @param {string} token - Token a ser validado
   * @returns {Object} - Resultado da validação
   */
  static validate(token) {
    return this.validateToken(token, process.env.TOKEN);
  }

  /**
   * Middleware para validação de token em rotas Express
   * @param {Object} req - Request object do Express
   * @param {Object} res - Response object do Express
   * @param {Function} next - Next function do Express
   */
  static middleware(req, res, next) {
    const { token } = req.body;
    const validation = this.validate(token);

    if (!validation.isValid) {
      return res.status(validation.statusCode).json({
        success: false,
        error: validation.error
      });
    }

    next();
  }

  /**
   * Valida token e retorna resposta JSON em caso de erro
   * @param {string} token - Token a ser validado
   * @param {Object} res - Response object do Express
   * @returns {boolean} - true se válido, false se inválido
   */
  static validateAndRespond(token, res) {
    const validation = this.validate(token);

    if (!validation.isValid) {
      res.status(validation.statusCode).json({
        success: false,
        error: validation.error
      });
      return false;
    }

    return true;
  }

  /**
   * Valida token com token customizado
   * @param {string} token - Token a ser validado
   * @param {string} expectedToken - Token esperado
   * @returns {Object} - Resultado da validação
   */
  static validateWithCustomToken(token, expectedToken) {
    return this.validateToken(token, expectedToken);
  }
}

module.exports = TokenValidator;
