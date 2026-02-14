# Perfil Aluval - API

Backend API for the Perfil Aluval application, built with Node.js, Express, and MSSQL.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or compatible MSSQL database)

## Installation

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the `api` directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials:
   ```ini
   PORT=4000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_database_name
   DB_SERVER=localhost
   DB_ENCRYPT=false
   ```

## Running the Server

To start the server in production mode:

```bash
npm start
```

To start the server in development mode (if `nodemon` is installed):

```bash
npm run dev
```

*Note: The current `package.json` does not have a specific `dev` script defined, so you may need to use `node index.js` directly or add a script.*

## API Endpoints

The API runs on `http://localhost:4000` by default.

Key endpoints:
- `GET /api/health` - Check API and DB status
- `/api/clientes` - Manage clients
- `/api/fornecedores` - Manage suppliers
- `/api/paises` - List countries
- `/api/distritos` - List districts
- `/api/concelhos` - List municipalities
