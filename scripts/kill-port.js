/**
 * Script to kill processes using a specific port
 * Use: node kill-port.js [port]
 */
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Default port (3004)
const port = process.argv[2] || 3004;

async function killProcessByPort(port) {
  try {
    console.log(`Attempting to kill process using port ${port}...`);
    
    // First find the process ID using netstat
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (!stdout) {
      console.log(`No process found using port ${port}`);
      return;
    }
    
    // Parse the output to find the PID
    const lines = stdout.split('\n').filter(line => line.trim() !== '');
    const listeningLines = lines.filter(line => line.includes('LISTENING'));
    
    if (listeningLines.length === 0) {
      console.log(`No process found listening on port ${port}`);
      return;
    }
    
    // Extract the PID from the last column of the LISTENING line
    const pidMatch = listeningLines[0].match(/(\d+)$/);
    if (!pidMatch) {
      console.log(`Could not extract PID from netstat output for port ${port}`);
      return;
    }
    
    const pid = pidMatch[1];
    console.log(`Found process with PID ${pid} using port ${port}`);
    
    // Kill the process
    await execAsync(`taskkill /F /PID ${pid}`);
    console.log(`Successfully terminated process with PID ${pid}`);
    
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('No tasks')) {
      console.log(`No process found using port ${port}`);
    } else {
      console.error(`Error killing process on port ${port}:`, error.message);
    }
  }
}

// Execute the function
killProcessByPort(port); 