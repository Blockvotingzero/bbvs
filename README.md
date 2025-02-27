# BlockVote - Nigerian Election Blockchain Platform

A blockchain-powered interactive voting platform simulating the Nigerian presidential election process with comprehensive authentication and verification mechanisms.

## Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:
- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

1. Clone or download this repository to your local machine

2. Open a command prompt or PowerShell in the project directory

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

## Troubleshooting

If you encounter port conflicts:
1. Check if port 5000 is already in use
2. You can modify the port in `client/vite.config.ts` if needed
3. Make sure no other services are using port 5000

## Project Structure
- `/client/src` - Frontend React application
- `/shared` - Shared types and utilities
- `/server` - Backend services (if applicable)
