# Express TypeScript Template

A template for creating Express applications with TypeScript.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory and add your environment variables:

```bash
PORT=3000
NODE_ENV=development
```

## Available Scripts

-   `npm run dev`: Start the development server with hot-reload
-   `npm run build`: Build the TypeScript code
-   `npm start`: Start the production server
-   `npm test`: Run tests

## Project Structure

```
├── src/                # Source files
├── dist/              # Compiled JavaScript files
├── .env               # Environment variables
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Development

The development server will automatically restart when you make changes to your code.
