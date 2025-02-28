# BlockVote - Nigerian Election Blockchain Platform

A blockchain-powered interactive voting platform simulating the Nigerian presidential election process with comprehensive authentication and verification mechanisms.

## Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:
- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

1. Clone or download this repository to your local machine

2. Create a `.env` file in the root directory:
```bash
# Copy the example environment file
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Build the project:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:
```
VITE_APP_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
VITE_BLOCKCHAIN_NODE=http://localhost:8545
NODE_ENV=development
```

For production deployment, set these variables in your hosting platform (e.g., Vercel).

## Features
- React frontend with TypeScript
- Blockchain vote tracking and hash generation
- Multi-factor authentication (OTP, Liveness Check)
- Secure vote confirmation with unique hash generation
- Responsive geospatial visualization with external map integration
- Mobile-friendly design with enhanced input validation
- Interactive map component with real-time data

## Development

For development, you can use:
```bash
npm run dev
```

This will start the development server with hot reload enabled.

## Production Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed:
```bash
npm install
```

2. Clear build cache and node modules:
```bash
npm run clean
npm install
```

3. Verify environment variables are set correctly in `.env`

4. Check if port 5000 is available (used by default)

## Project Structure
- `/client/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/lib` - Utilities and configuration
  - `/types` - TypeScript type definitions
- `/shared` - Shared types and utilities