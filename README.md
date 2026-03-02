# MegaStore Global - Data Modernization System

This project is a high-performance backend solution designed to migrate legacy data from unmanageable flat files (Excel/CSV) into a modern, scalable, and hybrid architecture using **Node.js, Express, PostgreSQL, and MongoDB**.

## Architecture & Model Justification

The system implements a **Polyglot Persistence** strategy to balance data integrity and flexibility:

### 1. Relational Model (PostgreSQL/MySQL)
*   **Purpose:** Handles core business entities (Customers, Suppliers, Products, Orders).
*   **Normalization:** The data was normalized to the **Third Normal Form (3FN)**. 
    *   Redundancies in client addresses and supplier contact info were moved to dedicated tables.
    *   Ensures ACID compliance for financial transactions and inventory management.
*   **Integrity:** Strict use of Primary Keys (PK), Foreign Keys (FK), and Unique constraints (e.g., Customer Email, Product SKU).

### 2. NoSQL Model (MongoDB)
*   **Purpose:** Transactional Auditing and System Logs.
*   **Design Choice (Embedding vs. Referencing):** 
    *   **Embedding:** Used for the `AuditLogs` collection. When a record is deleted in the SQL database, a complete snapshot of the object is embedded into the MongoDB document. This ensures that even if the original data structure changes in the future, the audit trail remains intact and readable without complex joins.
    *   **Scalability:** MongoDB handles high-write volumes for logging without impacting the performance of the main relational database.

---

##  Getting Started

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL or MySQL
*   MongoDB
*   NPM or Yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd megastore-exam

2. **Install dependencies:**
    ```bash
    npm install

3. **Environment Setup:**   
    ```Create a .env file in the root directory:
    .env
    PORT=3000
    SQL_DB_URL=postgres://user:pass@localhost:5432/db_megastore_exam
    MONGODB_URI=mongodb://localhost:27017/db_megastore_exam

4. **Database Initialization:**
The system will automatically sync models on the first run, or you can run:
    ```bash
    npm run migrate

###  Data Migration Logic (Idempotency)
The migration engine is located in src/services/migration.service.js. It ensures Idempotency through the following process:
Parsing: Reads the CSV line by line using csv-parser.
Validation: Checks if the Master Entities (Customers/Suppliers) already exist using unique identifiers (Email/SKU).
Conflict Handling: Uses UPSERT logic (Find or Create). If a customer "John Doe" appears in 100 rows, the system creates 1 record and links all 100 transactions to that single ID.
To trigger migration:
Endpoint: POST /api/v1/migrate
Body: { "file": "path/to/data.csv" }

#  API Endpoints
Products (CRUD + Audit)
GET /api/products - List all products.
POST /api/products - Create a new product.
DELETE /api/products/:id - Deletes product and generates an Audit Log in MongoDB.
Business Intelligence (Gerente de Operaciones)
GET /api/bi/supplier-analysis - Total inventory value and items per supplier.
GET /api/bi/customer-history/:id - Detailed purchase history for a specific client.
GET /api/bi/top-products?category=xyz - Best selling products by income.

#  Tech Stack
Backend: Node.js, Express.js
SQL ORM: Sequelize / TypeORM
NoSQL ODM: Mongoose
Data Parsing: csv-parser


# **Commands for running and installing the server:**
    ```bash
    npm install
    npm -y init
    npm install server
    npm install --save-dev nodemon
    npm run dev
    npm install dotenv
---