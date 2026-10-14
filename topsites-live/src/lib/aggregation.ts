import exp from 'constants';
import { aggregateDataForDisplay } from '../App'; // The import path is updated to point to App.tsx

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
            createMockVist('linkedin.com', 150, today),
            createMockVist('youtube.com', 50, today),
        ];
        const { topSites } = aggregateDataForDisplay(mockData, 'UTC');
        expect(topSites.find((s: VistRecord) => s.site === 'google.com')?.totalVisits).toBe(150);
        expect(topSites.find((s: VistRecord) => s.site === 'youtub.com')?.totalVisits).toBe(200);
    });
});

