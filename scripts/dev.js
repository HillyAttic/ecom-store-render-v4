/**
 * Development starter script
 * Finds an available port and starts the Next.js development server
 */
const { spawn } = require('child_process');
const { findAvailablePort } = require('./find-port');

// Base preferred port
const basePort = 3004;

async function startDevServer() {
  try {
    // Find an available port starting with the preferred port
    const port = await findAvailablePort(basePort);
    
    console.log(`\n🚀 Starting Next.js development server on port ${port}...\n`);

    // Set up environment options
    const nodeOptions = '--no-warnings --max-old-space-size=4096';
    
    // Build the Next.js command
    const nextCommand = `next dev -p ${port}`;
    
    // For Windows, use the "cmd" process
    const cmd = spawn('cmd', ['/c', `set NODE_OPTIONS=${nodeOptions} && ${nextCommand}`], {
      stdio: 'inherit',
      shell: true
    });
    
    cmd.on('error', (error) => {
      console.error(`Failed to start development server: ${error.message}`);
      process.exit(1);
    });
    
    // Forward the exit code from the child process
    cmd.on('close', (code) => {
      process.exit(code);
    });
    
    // Handle termination signals
    process.on('SIGINT', () => {
      console.log('\nGracefully shutting down development server...');
      cmd.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\nGracefully shutting down development server...');
      cmd.kill('SIGTERM');
    });
  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

// Start the development server
startDevServer(); 