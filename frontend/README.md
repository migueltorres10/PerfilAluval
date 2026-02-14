# Perfil Aluval - Frontend

Frontend application for Perfil Aluval, built with React, Vite, and React Router.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

## Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the `frontend` directory (or use `.env.local`):
   ```bash
   VITE_API_URL=http://localhost:4000
   ```
   *Note: If `VITE_API_URL` is not set, the application defaults to an empty string, which assumes a proxy is set up or the API is on the same origin.*

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (by default).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

- `src/app` - App configuration (router, etc.)
- `src/assets` - Static assets
- `src/components` - Reusable UI components
- `src/layouts` - Page layouts
- `src/pages` - Application pages
- `src/services` - API integration services
- `src/styles` - Global styles
- `src/utils` - Utility functions
