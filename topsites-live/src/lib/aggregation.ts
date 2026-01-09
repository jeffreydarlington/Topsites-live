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
});