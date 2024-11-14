export async function getHistoricalData(symbol: string, opts: {
    since: number;
    until: number;
    interval: '1d';
    includePrePost: boolean;
}): Promise<unknown> {
    const { since, until, interval, includePrePost } = opts;
    const url = new URL('https://query1.finance.yahoo.com/v8/finance/chart/' + symbol);
    url.searchParams.append('period1', since.toString());
    url.searchParams.append('period2', Math.floor(until).toString());
    url.searchParams.append('interval', interval);
    url.searchParams.append('includePrePost', includePrePost.toString());
    url.searchParams.append('events', 'div|split|earn');
    url.searchParams.append('lang', 'en-US');
    const response = await fetch(url.toString());
    if (response.ok) {
        return await response.json();
    }
    throw new Error(response.statusText, { cause: response.status });
}
