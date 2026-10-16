import { clear, timeStamp } from "console";
import path from "path";

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/visits' });

const SITES = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com',
    'instagram.com', 'wikipedia.org', 'amazon.com', 'reddit.com',
    'netflix.com', 'linkedin.com', 'microsoft.com', 'apple.com',
    'twitch.tv', 'github.com'
];
const REGIONS = ['US', 'CA', 'EU', 'AS'];

const generateMockRecord = () => {
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    return {
        timestamp: new Date().toISOString(),
        site,
        visits: Math.floor(Math.random() * 5000 + 100),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    };
};

const generateHistoricalData = (sinceDate, untilDate) => {
    const records = [];
    const span = untilDate.getTime() - sinceDate.getTime();
    const count = 500;
    for (let i = 0; i < count; i++) {
        const randomTime = new Date(sinceDate.getTime() + Math.random() * span);
        const site = SITES[Math.floor(Math.random() * SITES.length)];
        records.push({
            timestamp: randomTime.toISOString(),
            site,
            visits: Math.floor(Math.random() * 10000 + 500),
            region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
        });
    }
    return records;
};

app.get('/api/visits', (req, res) => {
    const { since, until } = req.query;
    if (!since || !until) {
        return res.status(400).send('Missing "since" or "until" query parameters.');
    }
    const sinceDate = new Date(since);
    const untilDate = new Date(until);
    if (isNaN(sinceDate.getTime()) || isNaN(untilDate.getTime())) {
        return res.status(400).send('Invalid date format for "since" or "until".');
    }
    try {
        const data = generateHistoricalData(sinceDate, untilDate);
        res.json(data);
    } catch (e) {
        res.status(500).send('Error generating historical data.');
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket.');
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(generateMockRecord()));
        }
    }, 2000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected from WebSocket.');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Mock server is running on port ${PORT}`);
});