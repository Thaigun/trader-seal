import { ensureDir } from 'jsr:@std/fs';

interface Asset {
    id: string;
    class: string;
    exchange: string;
    symbol: string;
    name: string;
    status: string;
    tradable: boolean;
    marginable: boolean;
    maintenance_margin_requirement: number;
    margin_requirement_long: string;
    margin_requirement_short: string;
    shortable: boolean;
    easy_to_borrow: boolean;
    fractionable: boolean;
    attributes: ('ptp_no_exception' | 'ptp_with_exception' | 'ipo' | 'has_options' | 'options_late_close')[];
}

const windowsInvalidFileNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
];

if (import.meta.main) {
    await fetchData();
}

async function fetchData() {
    await ensureDir('./output');
    const data = await Deno.readTextFile('input/assets.json');
    const assets = JSON.parse(data) as Asset[];
    let cumulativeSize = 0;
    let lastWarning = 0;
    for (const asset of assets) {
        if (asset.class !== 'us_equity') {
            continue;
        }
        const symbol = asset.symbol;
        let fileName = symbol;
        // https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file
        if (Deno.build.os === 'windows' && windowsInvalidFileNames.includes(symbol.toUpperCase())) {
            fileName = `_${symbol}`;
        }
        if (cumulativeSize > 5e9 && cumulativeSize - lastWarning > 1e9) {
            console.warn(`Cumulative size of historical data is over ${cumulativeSize / 1e9} GB`);
            lastWarning = cumulativeSize;
        }
        try {
            const stat = await Deno.stat(`./output/${fileName}.json`);
            cumulativeSize += stat.size;
            continue;
        } catch (error) {
            if (!(error instanceof Deno.errors.NotFound)) {
                throw error;
            }
        }
        try {
            const historicalData = await getHistoricalData(symbol, {
                since: 0,
                until: Date.now() / 1000,
                interval: '1d',
                includePrePost: false,
            });
            await Deno.writeTextFile(`./output/${fileName}.json`, JSON.stringify(historicalData, null, 4));
            const stat = await Deno.stat(`./output/${fileName}.json`);
            cumulativeSize += stat.size;
        } catch (error) {
            if (error instanceof Error) {
                if (error.cause === 429) {
                    console.warn('Rate limit exceeded');
                    await waitForSeconds(60 * 15);
                } else if (error.cause === 404) {
                    await Deno.writeTextFile(
                        `./output/${fileName}.json`,
                        JSON.stringify({ error: 'Not found' }),
                    );
                } else {
                    console.error(error);
                }
            } else {
                console.error(error);
            }
        }
    }
}

async function getHistoricalData(symbol: string, opts: {
    since: number;
    until: number;
    interval: '1d';
    includePrePost: boolean;
}) {
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

function waitForSeconds(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
