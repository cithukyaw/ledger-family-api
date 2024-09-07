import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const envFile = join(__dirname, '.env');
const exampleFile = join(__dirname, '.env.example');

// Check if .env file exists
if (!existsSync(envFile)) {
  // Copy .env.example to .env
  copyFileSync(exampleFile, envFile);
  console.log('.env file created from .env.example');
} else {
  console.log('.env file already exists');
}
