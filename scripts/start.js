/**
 * Production start script
 * Finds an available port and starts the Next.js production server
 */
const { spawn } = require('child_process');
const { findAvailablePort } = require('./find-port');

// Base preferred port
const basePort = 3004;

async function startProdServer() {
  try {
    // Find an available port starting with the preferred port
    const port = await findAvailablePort(basePort);
    
    console.log(`\n🚀 Starting Next.js production server on port ${port}...\n`);
    
    // Build the Next.js command
    const nextCommand = `next start -p ${port}`;
    
    // For Windows, use the "cmd" process
    const cmd = spawn('cmd', ['/c', nextCommand], {
      stdio: 'inherit',
      shell: true
    });
    
    cmd.on('error', (error) => {
      console.error(`Failed to start production server: ${error.message}`);
      process.exit(1);
    });
    
    // Forward the exit code from the child process
    cmd.on('close', (code) => {
      process.exit(code);
    });
    
    // Handle termination signals
    process.on('SIGINT', () => {
      console.log('\nGracefully shutting down production server...');
      cmd.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\nGracefully shutting down production server...');
      cmd.kill('SIGTERM');
    });
  } catch (error) {
    console.error('Failed to start production server:', error);
    process.exit(1);
  }
}

// Start the production server
startProdServer(); 