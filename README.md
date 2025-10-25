# Taro Actual Middleware

Aplicação Express.js com endpoint POST para validação de token e processamento de dados.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

3. Edite o arquivo `.env` e configure as variáveis:
```
TOKEN=seu_token_aqui
ACTUAL_SERVER_URL=http://localhost:5006
ACTUAL_PASSWORD=sua_senha_aqui
ACTUAL_ACCOUNT_ID=id_da_conta_aqui
ACTUAL_BUDGET_ID=id_do_orcamento_aqui
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Estrutura do Projeto

- `server.js` - Servidor principal
- `validators/TokenValidator.js` - Classe para validação de tokens
- `validators/ValidateEndpointValidator.js` - Classe para validação específica do endpoint /api/validate
- `package.json` - Configuração do projeto
- `env.example` - Exemplo de variáveis de ambiente

## Classe TokenValidator

A classe `TokenValidator` fornece métodos estáticos para validação de tokens:

### Métodos Disponíveis

- `TokenValidator.validate(token)` - Valida token contra variável de ambiente TOKEN
- `TokenValidator.validateAndRespond(token, res)` - Valida e retorna resposta em caso de erro
- `TokenValidator.middleware(req, res, next)` - Middleware para Express
- `TokenValidator.validateWithCustomToken(token, expectedToken)` - Valida com token customizado

### Exemplo de Uso

```javascript
const TokenValidator = require('./validators/TokenValidator');

// Validação simples
const validation = TokenValidator.validate(token);
if (!validation.isValid) {
  // Tratar erro
}

// Validação com resposta automática
if (!TokenValidator.validateAndRespond(token, res)) {
  return;
}
```

## Classe ValidateEndpointValidator

A classe `ValidateEndpointValidator` fornece validações específicas para o endpoint `/api/validate`:

### Métodos Disponíveis

- `validateAll(data)` - Valida todos os parâmetros de uma vez
- `validateDate(date)` - Valida formato e validade da data
- `validateAmount(amount)` - Valida se é número positivo
- `validatePayeeName(payee_name)` - Valida nome do beneficiário
- `validateCategoryId(category_id)` - Valida formato UUID
- `validateAndRespond(data, res)` - Valida e retorna resposta em caso de erro
- `middleware(req, res, next)` - Middleware para Express

### Exemplo de Uso

```javascript
const ValidateEndpointValidator = require('./validators/ValidateEndpointValidator');

// Validação completa
const validation = ValidateEndpointValidator.validateAll(req.body);
if (!validation.isValid) {
  // Tratar erros
}

// Validação com resposta automática
if (!ValidateEndpointValidator.validateAndRespond(req.body, res)) {
  return;
}

// Validação individual
const dateValidation = ValidateEndpointValidator.validateDate('2019-08-20');
```

## Endpoints

### POST /api/validate

Valida o token e processa os dados fornecidos.

**Parâmetros obrigatórios:**
- `token`: Token de autenticação
- `date`: Data no formato YYYY-MM-DD
- `amount`: Valor numérico positivo
- `payee_name`: Nome do beneficiário
- `category_id`: UUID da categoria

**Exemplo de requisição:**
```json
{
  "token": "seu_token_aqui",
  "date": "2019-08-20",
  "amount": 1200,
  "payee_name": "Kroger",
  "category_id": "c179c3f4-28a6-4fbd-a54d-195cced07a80"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Dados validados com sucesso",
  "data": {
    "date": "2019-08-20",
    "amount": 1200,
    "payee_name": "Kroger",
    "category_id": "c179c3f4-28a6-4fbd-a54d-195cced07a80"
  }
}
```

### POST /api/secure-action

Exemplo de endpoint que usa a validação de token.

**Parâmetros:**
- `token`: Token de autenticação
- `action`: Ação a ser executada (opcional)

### GET /health

Endpoint de health check para verificar se o servidor está funcionando.

## Validações

- Token deve corresponder à variável de ambiente `TOKEN`
- Data deve estar no formato YYYY-MM-DD
- Amount deve ser um número positivo
- Payee name não pode estar vazio
- Category ID deve ser um UUID válido
