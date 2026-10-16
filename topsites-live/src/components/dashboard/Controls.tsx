
import React from 'react';

interface ControlsProps {
  timeRange: string;
  setTimeRange: (val: string) => void;
  timeZone: string;
  setTimeZone: (val: string) => void;
  region: string;
  setRegion: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  timezones: string[];
  exportTableToCsv: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  timeRange,
  setTimeRange,
  timeZone,
  setTimeZone,
  region,
  setRegion,
  searchTerm,
  setSearchTerm,
  timezones,
  exportTableToCsv,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        aria-label="Time range"
      >
        <option value="today">Today</option>
        <option value="24h">Last 24h</option>
        <option value="7d">Last 7 Days</option>
      </select>

      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        aria-label="Timezone"
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>

      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        aria-label="Region"
      >
        <option value="all">All Regions</option>
        <option value="usa">USA</option>
        <option value="canada">Canada</option>
        <option value="europe">Europe</option>
        <option value="asia">Asia</option>
      </select>

      <input
        type="text"
        placeholder="Search sites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-md p-2 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        aria-label="Search sites"
      />

      <button
        type="button"
        onClick={exportTableToCsv}
        className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-md p-2"
      >
        Export CSV
      </button>
    </div>
  );
};
