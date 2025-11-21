# TopSitesLive - Real-Time Analytics Dashboard

TopSitesLive is a **React + TypeScript** application that provides a real-time dashboard for monitoring website visit statistics. It features a live-updating table of top sites, a trends chart for historical comparison, and various data filtering and export capabilities.

The application connects to a backend service via **WebSockets** for live data streaming and includes a **polling fallback** mechanism over a REST API.

---

## Features

### Real-Time Updates
- Live data streaming using WebSockets  
- Automatic polling fallback every 60 seconds if the WebSocket connection fails

### Dashboard UI
- Top-10 ranking of sites  
- Columns include:
  - Rank  
  - Site  
  - Total Visits Today  
  - % Change vs. Previous Day  
  - Inline hourly sparkline  

### Trends UI
- Multi-line chart for comparing visit trends of selected sites over custom time periods

### Interactive Controls
- Time range selection: **Today, Last 24h, Last 7 days**
- Timezone selection
- Region filtering
- Search functionality for the sites table
- Export table data to **CSV**
- Export trends chart to **PNG**

### Efficient Rendering
- Coalesces updates to prevent UI thrashing during rapid data streams

### Mock Backend
- Built-in mock server to simulate realistic site traffic for local development and testing

---

## Technical Stack

- **Frontend:** React, TypeScript, TailwindCSS  
- **Charting:** Recharts  
- **Backend (Mock):** Node.js, Express, ws  
- **Testing:** Jest, ts-jest  

---

## API Specification

### REST API (Polling Fallback)

**Endpoint:**  
`GET /api/visits`

**Query Parameters:**
- `since`: ISO 8601 timestamp (start of range)
- `until`: ISO 8601 timestamp (end of range)

**Response Example:**
```json
[
  {
    "timestamp": "2025-10-21T14:02:00Z",
    "site": "youtube.com",
    "visits": 45231,
    "region": "CA"
  }
]

# Navigate to the project directory
node mock-server.js

# Install dependencies
npm install

# Start development server
npm start

# Test the application
npm test
