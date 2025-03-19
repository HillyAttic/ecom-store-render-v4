// Netlify serverless function to handle Next.js API routes
const { builder } = require('@netlify/functions');
const path = require('path');

// Use the Netlify Functions builder to handle Next.js API routes
const handler = async (event, context) => {
  try {
    // This function will redirect to the appropriate Next.js API route
    // The actual routing is handled by the @netlify/plugin-nextjs plugin
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "This serverless function is a proxy to Next.js API routes. Actual routing is handled by @netlify/plugin-nextjs." 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }
};

// Export the handler wrapped with the Netlify Functions builder
exports.handler = builder(handler); 