# Actual Budget Middleware

REST API middleware that enables integration with Actual Budget through HTTP endpoints. This application serves as a bridge between external services (in any programming language) and Actual Budget, providing a simple and secure interface for creating transactions and listing categories.

## Purpose

This middleware was created to allow applications in **any programming language** (Python, Java, C#, PHP, Go, etc.) to interact with Actual Budget without needing to implement native Actual Budget integration in their respective languages.

## Features

- **Create transactions** in Actual Budget
- **List available categories**
- **Token authentication** for security
- **Robust data validation**
- **Simple and documented REST API**
- **Resilient** - doesn't crash on exceptions

## Prerequisites

- Node.js 16+
- Actual Budget Server running
- Access to Actual Budget server

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd actual-budget-middleware
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp env.example .env
```

4. **Edit the `.env` file:**
```bash
# API authentication token
TOKEN=your_secret_token_here

# Actual Budget configuration
ACTUAL_SERVER_URL=http://localhost:5006
ACTUAL_PASSWORD=your_actual_password
ACTUAL_ACCOUNT_ID=account_id_for_transactions
ACTUAL_BUDGET_ID=4b4bace7-eaf2-42e6-a727-55f4e51575ae
```

## Execution

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will be available at `http://localhost:3000`

## API Endpoints

### Authentication

All endpoints require authentication via token in header or query parameter.

### 1. **GET /api/get-categories**
Lists all available categories in Actual Budget.

**Parameters:**
- `token` (query): Authentication token

**Request example:**
```bash
curl "http://localhost:3000/api/get-categories?token=your_token"
```

**Success response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "c179c3f4-28a6-4fbd-a54d-195cced07a80",
      "name": "Food",
      "group_id": "238d4d38-a512-4e28-9bbe-e96fd5d99251",
      "is_income": false
    }
  ]
}
```

### 2. **POST /api/add-transaction**
Creates a new transaction in Actual Budget.

**Required parameters:**
- `token`: Authentication token
- `date`: Date in YYYY-MM-DD format
- `amount`: Numeric value (in cents, e.g., 1200 = $12.00)
- `payee_name`: Payee name
- `category_id`: Category UUID
- `notes`: Notes (optional)

**Request example:**
```bash
curl -X POST "http://localhost:3000/api/add-transaction" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_token",
    "date": "2024-01-15",
    "amount": 1200,
    "payee_name": "Grocery Store ABC",
    "category_id": "c179c3f4-28a6-4fbd-a54d-195cced07a80",
    "notes": "Monthly groceries"
  }'
```

**Success response:**
```json
{
  "success": true,
  "message": "Transaction added successfully",
  "data": {
    "success": true,
    "added": ["transaction-id-123"],
    "updated": [],
    "errors": [],
    "transaction": {
      "date": "2024-01-15",
      "amount": 1200,
      "payee_name": "Grocery Store ABC",
      "category_id": "c179c3f4-28a6-4fbd-a54d-195cced07a80",
      "notes": "Monthly groceries"
    }
  }
}
```

### 3. **GET /health**
Server health check.

**Response:**
```json
{
  "success": true,
  "message": "Server running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Integration

This middleware provides a standard REST API that can be consumed by any programming language through HTTP requests. Integration is simple and straightforward, using the documented endpoints above.

## Security

- **Token authentication**: All endpoints require valid token
- **Data validation**: Strictly validated input
- **Rate limiting**: Protection against abuse (configurable)
- **Audit logs**: All operations are logged

## Validations

- **Token**: Must match the `TOKEN` environment variable
- **Date**: YYYY-MM-DD format required
- **Amount**: Positive number required
- **Payee Name**: Non-empty string required
- **Category ID**: Valid UUID required

## Error Handling

The API returns standardized errors:

```json
{
  "success": false,
  "error": "Error description"
}
```

**HTTP status codes:**
- `200`: Success
- `400`: Invalid data
- `401`: Invalid token
- `500`: Internal server error

## Monitoring

- **Health Check**: `GET /health`
- **Structured logs**: All operations are logged
- **Metrics**: Request and error counters
- **Alerts**: Notifications on failures

## Usage Examples

### Complete Flow
1. **Get categories** to choose the correct category
2. **Create transaction** with validated data
3. **Verify result** in API response

### Use Cases
- **Payment system integration**
- **Accounting entry automation**
- **Database synchronization**
- **Third-party APIs** that need to create transactions

## Contributing

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is under the MIT license. See the `LICENSE` file for more details.
