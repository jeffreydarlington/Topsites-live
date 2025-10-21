# 🌐 TopSitesLive - Real-Time Analytics Dashboard

**TopSitesLive** is a **React + TypeScript** application that provides a real-time dashboard for monitoring website visit statistics.  
It features a live-updating table of top sites, a trends chart for historical comparison, and various data filtering and export capabilities.

The application connects to a backend service via **WebSockets** for live data streaming and includes a **polling fallback mechanism** over a standard REST API.

---

## 🚀 Features

- **Real-Time Updates:**  
  Live data streaming using WebSockets with an automatic polling fallback every 60 seconds if the connection fails.

- **Dashboard UI:**  
  Displays a top-10 ranking of sites with columns for:
  - Rank  
  - Site  
  - Total Visits Today  
  - % Change vs. Previous Day  
  - Inline hourly sparkline chart

- **Trends UI:**  
  Multi-line chart for comparing the visit trends of selected sites over a chosen period.

- **Interactive Controls:**
  - Time range selection: _Today_, _Last 24h_, _Last 7 days_  
  - Timezone selection for accurate “today” calculations  
  - Region filtering  
  - Search functionality for sites  
  - Export table data to **CSV**  
  - Export trends chart to **PNG**

- **Efficient Rendering:**  
  Coalesces rapid updates to prevent UI “thrashing” from fast data streams.

- **Mock Backend:**  
  A mock server simulates realistic site traffic for local development and testing.

---

## 🧰 Technical Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React, TypeScript, TailwindCSS |
| **Charting** | Recharts |
| **Backend (Mock)** | Node.js, Express, ws (WebSocket library) |
| **Testing** | Jest, ts-jest |

---

## 📡 API Specification

### REST API (Polling Fallback)

**Endpoint:**  
```
GET /api/visits
```

**Query Parameters:**
- `since`: ISO 8601 timestamp (start of the time range)  
- `until`: ISO 8601 timestamp (end of the time range)

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
```

---

### WebSocket API (Real-Time)

**Endpoint:**  
```
wss://<your-server>/visits
```

**Behavior:**  
Upon connection, the server streams visit records as JSON objects in real time.  
Each message contains a single visit record object with the same structure as the REST API response.

---

## 🧑‍💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) and npm (or yarn)
- A modern web browser

---

### 1️⃣ Run the Mock Server

The mock server simulates the API and provides live data.

```bash
# Navigate to the project directory
node mock-server.js
```

The server will start at:  
👉 [http://localhost:8080](http://localhost:8080)

---

### 2️⃣ Run the React Application

This project can be set up like any standard **Create React App** project.  
You would place `topsites-live-app.tsx` inside the `src/` directory.

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

The project includes unit tests for the core data aggregation logic.

To run tests:
```bash
npm test
```

---

## 📜 License
This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 💡 Author
**Jeffrey Darlington**  
Built with ❤️ using React + TypeScript  
GitHub: [@jeffreydarlington](https://github.com/jeffreydarlington)
