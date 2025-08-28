# Wallet Mini System

A Node.js wallet system that allows cash-in from company account and user-to-user transfers with configurable fees.

## Features

- Cash In into user accounts
- User-to-user transfers
- Transaction reports
- User balance reports
- Atomic transactions with concurrency handling
- Comprehensive logging with date
- Rate limiting for API protection and fair usage

## Logic and API Documentation
- [Postman API Collection](./docs/mini-wallet-system.postman_collection.json)
- [Fee Logic](./docs/fee-logic.md)
- [Transfer Logic](./docs/transfer-logic.md)
- [Cash In Logic](./docs/cash-in-logic.md)
- [Atomicity Concurrency Logic](./docs/atomicity.md)
- [Idempotency Implementation](./docs/idempotency.md)
- [Error Handling](./docs/error-handler.md)
- [Logging](./docs/logging.md)
## Tech
- Node JS
- TypeScript
- Express JS
- MongoDB
- Mongoose
- Rate Limiter

## 📁 Project Structure

```
aya-wallet-system/
├── src/
│   ├── index.ts            # Application entry point
│   ├── config/             # Configuration files
│   │   ├── database.ts        # MongoDB connection
│   │   └── logger.ts          # Winston logging setup
│   ├── controllers/           # Request handlers
│   │   ├── report-controller.ts
│   │   └── transaction-controller.ts
│   ├── middlewares/       # Express middlewares
│   │   ├── error-handler.ts   # Global error handling
│   │   ├── rate-limiter.ts    # Rate limiting logic
│   │   ├── validation         # Request validation
│   │   │   ├── validate-idempotency-key.ts       # Idempotency Key validate from header
│   │   │   ├── validate-query.ts          # Validate query
│   │   │   └── validate-request.ts        # validate the request
│   ├── models/                # Database models
│   │   ├── company.ts         # Company account model
│   │   ├── fee.ts             # Fee configuration model
│   │   ├── service.ts         # Service definition model
│   │   ├── transaction.ts     # Transaction record model
│   │   └── user.ts            # User account model
│   ├── routes/          # API route definitions
│   │   ├── index.ts     # Route aggregation
│   │   ├── report.ts     # Report endpoints
│   │   └── transaction.ts   # Transaction endpoints
│   ├── schema/              # Business logic
│   │   ├── cash-in-schema.ts      # JOI cash in schema
│   │   ├── transaction-report-schema.ts   # JOI transaction report schema
│   │   ├── transfer-schema.ts   # JOI transfer schema
│   │   └── user-report-scheam.ts # JOI user report schema
│   ├── services/              # Business logic
│   │   ├── fee-service.ts      # Fee calculation logic
│   │   ├── report-service.ts   # Report generation
│   │   └── transaction-service.ts # Transaction processing
│   ├── types/                 # TypeScript type definitions
│   │   ├── company.ts
│   │   ├── fee.ts
│   │   ├── service.ts
│   │   ├── transaction.ts
│   │   ├── paginate.ts
│   │   └── user.ts
│   └── utils/                 # Utility functions
│   │   └── log-utils.ts.  # log helper functions
├── seeds/                   # Seeding
│   └── seed.ts               # Database seeding
├── docs/                     # Documentation
└── logs/                     # Application logs
```

## Project Setup

1. Clone the repository
   ```bash
   git clone https://github.com/MinHeinKoKo/aya-code-test.git
   cd aya-code-test
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy environment example file
   ```bash
   cp .env.example .env
   ```
4. Replace with your credential in .env file
   ```bash
   MONGODB_URI=<YOUR_MONGODB_URI>
   ```
5. Run seeder
   ```bash
   npm run seed
   ```
6. Start the server
   ```bash
   npm run start:dev
   ```
7. Build Application
   ```bash
   npm run build
   ```
7. Run applicaiton
   ```bash
   npm run start
   ```
8. Once the server is running, open your browser and visit the API endpoint for application health check:  
   [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
