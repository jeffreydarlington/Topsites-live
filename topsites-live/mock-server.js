// ============================================
// IMPORT REQUIRED LIBRARIES
// ============================================
// Express: Web framework for creating HTTP server and REST APIs
const express = require('express');
// HTTP: Node.js built-in module for creating HTTP servers
const http = require('http');
// WebSocket: Library for real-time bidirectional communication
const WebSocket = require('ws');
// CORS: Middleware to enable Cross-Origin Resource Sharing (allows requests from different domains)
const cors = require('cors');

// ============================================
// SERVER SETUP
// ============================================
// Create Express application instance
const app = express();
// Enable CORS for all routes (allows any domain to access this API)
app.use(cors());
// Create HTTP server using Express app
const server = http.createServer(app);
// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Define the port number the server will listen on
const PORT = 8080;

// ============================================
// CONFIGURATION DATA
// ============================================
// Array of popular website domains to simulate traffic for
const SITES = [
    'google.com',
    'facebook.com',
    'twitter.com',
    'github.com',
    'stackoverflow.com',
    'reddit.com',
    'linkedin.com',
    'youtube.com',
    'instagram.com',
    'wikipedia.org',
    'amazon.com',
    'netflix.com',
    'bing.com',
    'yahoo.com',
    'pinterest.com',
    'twitch.tv',
    'quora.com',
    'medium.com',
    'tumblr.com',
    'flickr.com'
];

// Array of region codes representing different geographical areas
const REGIONS = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP'];

// Generate base traffic numbers for each site
// This creates an object where each site has a random baseline visit count between 10,000-60,000
const siteBaseTraffic = SITES.reduce((acc, site) => {
    acc[site] = Math.random() * 50000 + 10000; // Base visits per tick
    return acc;
}, {});

// ============================================
// DATA GENERATION FUNCTIONS
// ============================================

/**
 * Generates a single visit record with realistic traffic patterns
 * Traffic varies based on time of day using a sine wave pattern
 */
const generateVisitRecord = () => {
    // Randomly select a site from the SITES array
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    
    // Get the baseline traffic for this site
    const base = siteBaseTraffic[site];
    
    // Calculate traffic multiplier based on current UTC hour (0-23)
    const hour = new Date().getUTCHours();
    // Use sine function to create wave pattern: higher during peak hours, lower during off-hours
    // Multiplier ranges from ~0.2 to ~1.2
    const multiplier = Math.sin((hour / 24) * Math.PI) * 0.5 + 0.7;
    
    // Return a complete visit record object
    return {
        timestamp: new Date().toISOString(), // Current time in ISO format
        site, // The website domain
        // Calculate visits: base traffic ± 20% random variation, multiplied by time-of-day factor
        visits: Math.floor((base + (Math.random() - 0.5) * base * 0.2) * multiplier),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)] // Random region
    };
};

/**
 * Generates historical data between two timestamps
 * Creates multiple visit records at random intervals
 * @param {Date} since - Start date/time
 * @param {Date} until - End date/time
 * @returns {Array} Array of visit records
 */
const generateHistoricalData = (since, until) => {
    const records = []; // Array to store all generated records
    let currentTime = new Date(since).getTime(); // Convert start date to milliseconds
    const untilTime = new Date(until).getTime(); // Convert end date to milliseconds

    // Keep generating records until we reach the end time
    while (currentTime < untilTime) {
        records.push(generateVisitRecord()); // Generate and add a new record
        // Advance time by a random interval between 10-30 seconds (10000-30000 milliseconds)
        currentTime += Math.random() * 20000 + 10000;
    }
    return records;
};

// ============================================
// WEBSOCKET SERVER LOGIC
// ============================================

/**
 * Handle new WebSocket connections
 * Sends real-time visit data to connected clients every 2 seconds
 */
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Set up interval to send data periodically
    const intervalId = setInterval(() => {
        // Only send if connection is still open
        if (ws.readyState === WebSocket.OPEN) {
            // Generate a new visit record
            const record = generateVisitRecord();
            // Send it to the client as JSON string
            ws.send(JSON.stringify(record));
        }
    }, 2000); // Send new data every 2 seconds

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        // Stop sending data when client disconnects
        clearInterval(intervalId);
    });
    
    // Handle WebSocket errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        // Stop sending data if error occurs
        clearInterval(intervalId);
    });
});

// ============================================
// REST API ENDPOINTS
// ============================================

/**
 * GET /api/visits
 * Returns historical visit data between two timestamps
 * Query parameters:
 *   - since: Start date/time (ISO format or any valid date string)
 *   - until: End date/time (ISO format or any valid date string)
 */
app.get('/api/visits', (req, res) => {
    // Extract query parameters from URL
    const { since, until } = req.query;
    
    // Validate that both parameters are provided
    if (!since || !until) {
        return res.status(400).send('Missing "since" or "until" query parameters.');
    }
    
    try {
        // Convert string parameters to Date objects
        const sinceDate = new Date(since);
        const untilDate = new Date(until);
        
        // Check if dates are valid (isNaN returns true for invalid dates)
        if (isNaN(sinceDate) || isNaN(untilDate)) {
             return res.status(400).send('Invalid date format for "since" or "until".');
        }
        
        // Generate historical data for the requested time range
        const data = generateHistoricalData(sinceDate, untilDate);
        
        // Send the data as JSON response
        res.json(data);
    } catch (e) {
        // Handle any unexpected errors
        res.status(500).send('Error generating historical data.');
    }
});

// ============================================
// START THE SERVER
// ============================================

/**
 * Start listening for connections on the specified port
 * Once started, log useful information about available endpoints
 */
server.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
    console.log(`WebSocket server is at ws://localhost:${PORT}/visits`);
    console.log(`REST API is at http://localhost:${PORT}/api/visits`);
    console.log('Press Ctrl+C to stop the server.');
});