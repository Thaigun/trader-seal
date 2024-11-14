import { ensureDir } from 'jsr:@std/fs';
import { getHistoricalData } from '@trader-seal/yahoo-client';

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
        const fileName = `asst_${symbol}`;
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

function waitForSeconds(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
