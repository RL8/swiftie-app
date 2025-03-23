/**
 * Script to run database tests using pgTAP
 * 
 * This script connects to the database and runs the pgTAP tests
 * Usage: node scripts/run-db-tests.js
 */

const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Default database connection details
const DEFAULT_DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
};

// Get database connection details from environment variables
const DB_CONFIG = {
  host: process.env.PGHOST || DEFAULT_DB_CONFIG.host,
  port: process.env.PGPORT || DEFAULT_DB_CONFIG.port,
  database: process.env.PGDATABASE || DEFAULT_DB_CONFIG.database,
  user: process.env.PGUSER || DEFAULT_DB_CONFIG.user,
  password: process.env.PGPASSWORD,
};

// Path to the pgTAP test files
const PGTAP_TESTS_DIR = path.join(__dirname, '..', 'tests', 'pgtap');
const RUN_ALL_TESTS_FILE = path.join(PGTAP_TESTS_DIR, 'run_all_tests.sql');

// Check if the test file exists
if (!fs.existsSync(RUN_ALL_TESTS_FILE)) {
  console.error(`Error: Test file not found: ${RUN_ALL_TESTS_FILE}`);
  process.exit(1);
}

// Build the psql command
const psqlArgs = [
  '-h', DB_CONFIG.host,
  '-p', DB_CONFIG.port,
  '-d', DB_CONFIG.database,
  '-U', DB_CONFIG.user,
  '-f', RUN_ALL_TESTS_FILE,
];

console.log('Running pgTAP tests...');
console.log(`Database: ${DB_CONFIG.database}`);
console.log(`Test file: ${RUN_ALL_TESTS_FILE}`);

// Spawn psql process
const psql = spawn('psql', psqlArgs, {
  env: {
    ...process.env,
    PGPASSWORD: DB_CONFIG.password,
  },
});

// Handle process output
psql.stdout.on('data', (data) => {
  console.log(data.toString());
});

psql.stderr.on('data', (data) => {
  console.error(`Error: ${data.toString()}`);
});

psql.on('close', (code) => {
  if (code === 0) {
    console.log('pgTAP tests completed successfully.');
  } else {
    console.error(`pgTAP tests failed with exit code ${code}.`);
    process.exit(code);
  }
});
