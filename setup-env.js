const fs = require('fs');
const path = require('path');

const backendEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=todo_app

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
`;

const frontendEnv = `REACT_APP_API_URL=http://localhost:3001
`;

// Create backend .env
fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
console.log('Created backend/.env');

// Create frontend .env
fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
console.log('Created frontend/.env');

// Create example files
fs.writeFileSync(path.join(__dirname, 'backend', '.env.example'), backendEnv);
console.log('Created backend/.env.example');

fs.writeFileSync(path.join(__dirname, 'frontend', '.env.example'), frontendEnv);
console.log('Created frontend/.env.example'); 