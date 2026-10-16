import exp from 'constants';
import { aggregateDataForDisplay } from '../../App'; // The import path is updated to point to App.tsx

type VistRecord = {
    timestamp: string;
    site: string;
    visits: number;
    region: string;
}

const createMockVist = (site: string, visits: number, date: Date): VistRecord => ({
    site,
    visits,
    timestamp: date.toISOString(),
    region: 'US',
})

describe('aggregateDataForDisplay', () => {
    let now : Date;
    let today : Date;
    let yesterday : Date;
    let twoDaysAgo : Date;

    beforeEach(() => {
        now = new Date();
        today = new Date(now);
        yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);

        jest.spyOn(global, 'Date').mockImplementation(() => now.toISOString());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test('should return amd empty array for empty input', () => {
        const{ topSites, allSites } = aggregateDataForDisplay([], 'UTC');
        expect(topSites).toEqual([]);
        expect(allSites).toEqual([]);
    });
    
    test('should correctly sum visits for the same site on the same day', () => {
        const mockData: VistRecord[] = [
            createMockVist('google.com', 100, today),
            createMockVist('linkedin.com', 50, today),
            createMockVist('youtube.com', 200, today),
        ];
        const { topSites } = aggregateDataForDisplay(mockData, 'UTC');
        expect(topSites.find((s: VistRecord) => s.site === 'google.com')?.totalVisits).toBe(150);
        expect(topSites.find((s: VistRecord) => s.site === 'youtube.com')?.totalVisits).toBe(200);
    });

    test('should correctly rank sites by total visits', () => {
        const mockData: VistRecord[] = [
            createMockVist('a.com', 100, today),
            createMockVist('b.com', 150, today),
            createMockVist('c.com', 50, today),
        ];
        const { topSites } = aggregateDataForDisplay(mockData, 'UTC');
        expect(topSites.map((s: VistRecord) => s.site)).toEqual(['a.com', 'b.com', 'c.com']);
        expect(topSites[0].totalVisits).toBe(1);
        expect(topSites[1].totalVisits).toBe(2);
        expect(topSites[2].totalVisits).toBe(3);
    });

    test('should correctly calculate the percentage change in visits compared to the previous day', () => {
        const mockData: VistRecord[] = [
            // Site A: 100% increase
            createMockVist('a.com', 200, today),
            createMockVist('a.com', 100, yesterday),
            // Site B: 50% decrease
            createMockVist('b.com', 50, today),
            createMockVist('b.com', 100, yesterday),
            // Site C: No change
            createMockVist('c.com', 75, today),
            createMockVist('c.com', 75, yesterday),
            // Site D: No visits yesterday, should be treated as Infinity
            createMockVist('d.com', 100, today),
        ];

        const { topSites } = aggregateDataForDisplay(mockData, 'UTC');
        expect(topSites.find((s: VistRecord) => s.site === 'a.com')?.percentageChange).toBeCloseTo(100);
        expect(topSites.find((s: VistRecord) => s.site === 'b.com')?.percentageChange).toBeCloseTo(-50);
        expect(topSites.find((s: VistRecord) => s.site === 'c.com')?.percentageChange).toBeCloseTo(0);
        expect(topSites.find((s: VistRecord) => s.site === 'd.com')?.percentageChange).toBe(Infinity);
    });

    test('should only include data from today and yesterday in calculations', () => {
        const mockData: VistRecord[] = [
            createMockVist('a.com', 100, today),
            createMockVist('a.com', 50, yesterday),
            createMockVist('a.com', 1000, twoDaysAgo), // This should be ignored
        ];

        const { topSites } = aggregateDataForDisplay(mockData, 'UTC');
        expect(topSites.find((s: VistRecord) => s.site === 'a.com')?.totalVisits).toBe(100);
        expect(topSites.find((s: VistRecord) => s.site === 'a.com')?.percentageChange).toBeCloseTo(100);
    });

    test('should respect the provided timezone for "today"', () => {
    // Test a timestamp that is "yesterday" in UTC but "today" in a western timezone
        const timestamp = new Date('2026-10-01T23:00:00Z');
        const mockData: VistRecord[] = [
            createMockVist('a.com', 100, timestamp),
        ];

    // When viewed in UTC, this should be considered "today"
    const { topSites: utcTopSites } = aggregateDataForDisplay(mockData, 'UTC');
    expect(utcTopSites.find((s: VistRecord) => s.site === 'a.com')?.totalVisits).toBe(100);

    // When viewed from NY, this visit is not "today"
    // We need to adjust 'now' for this test to be accurate for NY time
    jest.spyOn(global, 'Date').mockImplementation(() => '2025-10-21T14:00:00Z'); // still the 21st in NY
    const { topSites: topSitesNY } = aggregateDataForDisplay(mockData, 'America/New_York');
    // It should be counted as yesterday's data, so today's visits are 0
    expect(topSitesNY.length).toBe(0);
    });

});
