const express = require('express');
const http = require('http');
const WebsSocket = require('ws');
const cors = require('cors');
const { time, timeStamp } = require('console');

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebsSocket.Server({ server });

const PORT = 8080;

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

const REGIONS = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP'];

const siteBaseTraffic = SITES.reduce((acc, site) =>{
    acc[site] = Math.random() * 50000 + 10000; // Base traffic between 10k and 60k
    return acc;
},{});

// --- Data Generation ---

const generateVisitRecord = () => {
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    const base = siteBaseTraffic[site];

    // FLUCTUATION BASED ON TIME OF DAY(UTC)
    const hour = new Date().getUTCHours();
    const multiplier = Math.sin(hour / 24 * 2 * Math.PI) * 0.5 + 0.7; // Varies between 0.5 and 0.7
    const visits = Math.floor(base * multiplier * (0.8 + Math.random() * 0.4)); // +/-20% random variation
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

    return {
        timeStamp: new Date().toISOString(),
        site,
        visits,
        region
    };
};

const generateHistoricData = (since, until) => {
    const records = [];
    let currentTime = new Date(since).getTime();
    const endTime = new Date(until).getTime();

    while(currentTime <= endTime){
        records.push(generateVisitRecord());
        currentTime += Math.random() * 20000 + 10000; // Every 10-30 seconds
    }
    return records;
};

// --- WEBSOCKET SERVER LOGIC ---
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    const intervalId = setInterval(() => {
        if(ws.readyState === WebsSocket.OPEN){
            const records = generateVisitRecord();
            ws.send(JSON.stringify(records))
        }
    }, 2000);

    ws.on('close', () =>{
        console.log('Client disconnected from WebSocket');
        clearInterval(intervalId);
    })
});

// --- REST API ENDPOINTS ---
