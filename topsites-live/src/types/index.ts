export type visitRecord = {
    timeStamp: string;
    site: string;
    visits: number;
    region: string;
};

export type AggregatedSiteData = {
    rank: number;
    site: string;
    totalVisits: number;
    percentChange: number;
    hourlyData: { [hour: string]: number };
};

export type CharData = {
    name: string;
    [key: string]: number | string;
}