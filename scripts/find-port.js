/**
 * Script to find an available port
 * Starts with the preferred port and incrementally tries until it finds an open one
 */
const net = require('net');

// Default preferred port
const preferredPort = parseInt(process.env.PORT || process.argv[2] || 3004, 10);

// Function to check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      // If the error is EADDRINUSE, the port is in use
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      // If we get here, the port is available
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

// Function to find an available port starting from preferredPort
async function findAvailablePort(startPort) {
  let port = startPort;
  let maxAttempts = 20; // Try up to 20 ports
  
  while (maxAttempts > 0) {
    // Check if the port is in use
    const inUse = await isPortInUse(port);
    
    if (!inUse) {
      console.log(`✓ Port ${port} is available`);
      return port;
    }
    
    console.log(`✗ Port ${port} is in use, trying next port...`);
    port++;
    maxAttempts--;
  }
  
  console.error('Could not find an available port after multiple attempts');
  return startPort; // Return the original port as a fallback
}

// Main function to find port and export it
async function main() {
  try {
    const port = await findAvailablePort(preferredPort);
    
    // If this script is running directly (not imported)
    if (require.main === module) {
      console.log(port);
    }
    
    // Make the port available for import
    module.exports = port;
    
    // Set an environment variable with the port (useful for child processes)
    process.env.NEXT_PORT = port.toString();
    
    return port;
  } catch (error) {
    console.error('Error finding available port:', error);
    return preferredPort;
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { findAvailablePort, main }; 