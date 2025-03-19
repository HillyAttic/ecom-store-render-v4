const { builder } = require('@netlify/functions');

// Create an API handler for Next.js API routes
const handler = async (event, context) => {
  // This is a stub function - Next.js will handle API routes through the .next output
  // Netlify automatically routes this properly with the redirects in netlify.toml
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Next.js API Function' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('API Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};

// Export the handler for use by Netlify Functions
exports.handler = builder(handler); 