const path = require('path');
const { builder } = require('@netlify/functions');

// Create a handler for Server-Side Rendering
const handler = async (event, context) => {
  // This is a stub function - Next.js will handle this through the .next output
  // Netlify automatically routes this properly with the redirects in netlify.toml
  try {
    return {
      statusCode: 200,
      body: 'Next.js Server Function'
    };
  } catch (error) {
    console.error('Server Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

// Export the handler for use by Netlify Functions
exports.handler = builder(handler); 