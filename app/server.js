// server.js

const app = require('./src/app'); // Import app setup
const { API_BASE_URL, API_PORT } = require('./src/config'); // Import constants

// Graceful shutdown handling (optional)
process.on('SIGINT', function() {
    console.log('Server shutting down...');
    process.exit(0); // Exit with success code
});

// Start the Express server
app.listen(API_PORT, () => {
    console.log(`Server running at ${API_BASE_URL}:${API_PORT}`);
});
