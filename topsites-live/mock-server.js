// ========================================
// IMPORT REQUIRED LIBRARIES (Getting our toys from the toy box!)
// ========================================
const express = require('express'); // Creates a web server to handle requests
const http = require('http'); // Provides HTTP server functionality
const WebsSocket = require('ws'); // Enables real-time two-way communication (walkie-talkie!)
const cors = require('cors'); // Allows requests from different websites/domains
const { time, timeStamp } = require('console'); // Console utilities (not actually used in this code)

// ========================================
// SETUP THE SERVER (Building our lemonade stand!)
// ========================================
const app = express(); // Create our Express application
app.use(cors()); // Enable CORS so anyone can connect to our server
const server = http.createServer(app); // Create HTTP server using Express app
const wss = new WebsSocket.Server({ server }); // Create WebSocket server on top of HTTP server

const PORT = 8080; // The "address" where our server lives

// ========================================
// DEFINE WEBSITE LIST (Our clipboard of websites to track)
// ========================================
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

// ========================================
// DEFINE REGIONS (Countries where visitors come from)
// ========================================
const REGIONS = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP'];

// ========================================
// ASSIGN BASE TRAFFIC TO EACH SITE (Deciding how popular each website is)
// ========================================
// Each website gets a random "baseline" popularity between 10,000 and 60,000 visitors
const siteBaseTraffic = SITES.reduce((acc, site) => {
    acc[site] = Math.random() * 50000 + 10000; // Random number between 10k and 60k
    return acc;
}, {});

// ========================================
// GENERATE A SINGLE VISIT RECORD (Our story-making machine!)
// ========================================
const generateVisitRecord = () => {
    // Pick a random website from our list
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    
    // Get the baseline popularity for this website
    const base = siteBaseTraffic[site];

    // CALCULATE TIME-OF-DAY FLUCTUATION (More visitors during the day!)
    const hour = new Date().getUTCHours(); // Get current hour (0-23)
    // Use sine wave to simulate daily traffic pattern (peaks in middle of day)
    const multiplier = Math.sin(hour / 24 * 2 * Math.PI) * 0.5 + 0.7; // Varies between 0.2 and 1.2
    
    // Calculate final visit count with time-based fluctuation and random variation
    const visits = Math.floor(base * multiplier * (0.8 + Math.random() * 0.4)); // +/-20% random variation
    
    // Pick a random region/country
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

    // Return the complete visit record
    return {
        timeStamp: new Date().toISOString(), // Current time in ISO format
        site, // Website name
        visits, // Number of visits
        region // Country/region code
    };
};

// ========================================
// GENERATE HISTORICAL DATA (Making up many stories at once!)
// ========================================
// Creates a series of visit records between two dates
const generateHistoricData = (since, until) => {
    const records = []; // Array to store all our generated records
    let currentTime = new Date(since).getTime(); // Start time in milliseconds
    const endTime = new Date(until).getTime(); // End time in milliseconds

    // Keep generating records until we reach the end time
    while (currentTime <= endTime) {
        records.push(generateVisitRecord()); // Add a new visit record
        // Move forward in time by 10-30 seconds (random)
        currentTime += Math.random() * 20000 + 10000;
    }
    
    return records; // Return all generated records
};

// ========================================
// WEBSOCKET SERVER LOGIC (The walkie-talkie station!)
// ========================================
// When a client connects via WebSocket
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket'); // Log the connection

    // Send new data every 2 seconds (2000 milliseconds)
    const intervalId = setInterval(() => {
        // Check if connection is still open
        if (ws.readyState === WebsSocket.OPEN) {
            const records = generateVisitRecord(); // Generate a new visit record
            ws.send(JSON.stringify(records)); // Send it to the client as JSON string
        }
    }, 2000);

    // When client disconnects
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket'); // Log the disconnection
        clearInterval(intervalId); // Stop sending data
    });
});

// ========================================
// REST API ENDPOINT (The question counter at our stand!)
// ========================================
// Handle GET requests to /api/visits
app.get('/api/visits', (req, res) => {
    // Extract 'since' and 'until' parameters from the URL query string
    const { since, until } = req.query;
    
    // Check if both required parameters are provided
    if (!since || !until) {
        return res.status(400).json({ error: 'Missing since or until query parameters' });
    }
    
    try {
        // Try to parse the date strings into Date objects
        const sinceDate = new Date(since);
        const untilDate = new Date(until);
        
        // Check if dates are valid (not NaN = Not a Number)
        if (isNaN(sinceDate.getTime()) || isNaN(untilDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format for "since" or "Until".' });
        }
        
        // Generate historical data for the requested time range
        const data = generateHistoricData(sinceDate, untilDate);
        
        // Send the data back as JSON
        res.json(data);
    } catch (error) {
        // If anything goes wrong, send an error response
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========================================
// START THE SERVER (Opening our stand for business!)
// ========================================
server.listen(PORT, () => {
    // Log helpful information when server starts
    console.log(`Mock server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}/vists`);
    console.log(`REST API running on http://localhost:${PORT}/api/visits`);
    console.log('Press Ctrl+C to stop the server.');
});