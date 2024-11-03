import type { Asset, ExchangeCodes } from './tradingApiTypes.ts';

interface AlpacaClientOptions {
    key: string;
    secret: string;
    mode: 'live' | 'paper';
}

export class AlpacaClient {
    constructor(private opts: AlpacaClientOptions) {}

    async getAssets(opts?: {
        status?: string;
        asset_class?: string;
        exchange?: 'AMEX' | 'ARCA' | 'BATS' | 'NYSE' | 'NASDAQ' | 'NYSEARCA' | 'OTC';
        attributes?:
            ('ptp_no_exception' | 'ptp_with_exception' | 'ipo' | 'has_options' | 'options_late_close')[];
    }): Promise<Asset[]> {
        const params = opts && { ...opts, attributes: opts.attributes?.join(',') };
        return await this.tradingApiRequest('GET', 'v2/assets', params);
    }

    async getExchangeCodes(): Promise<ExchangeCodes> {
        return await this.marketDataApiRequest('v2/stocks/meta/exchanges');
    }

    private get baseUrl() {
        return this.opts.mode === 'live' ? 'https://api.alpaca.markets' : 'https://paper-api.alpaca.markets';
    }

    private get baseDataUrl() {
        return 'https://data.alpaca.markets';
    }

    private async tradingApiRequest(
        method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT',
        path: string,
        data?: Record<string, string | number | undefined>,
    ) {
        const url = new URL(path, this.baseUrl);
        if (['GET', 'DELETE'].includes(method) && data) {
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined) {
                    url.searchParams.append(key, value.toString());
                }
            }
        }
        const response = await fetch(url.toString(), {
            method,
            headers: {
                'APCA-API-KEY-ID': this.opts.key,
                'APCA-API-SECRET-KEY': this.opts.secret,
                'Content-Type': 'application/json',
            },
            body: ['POST', 'PUT', 'PATCH'].includes(method) && data ? JSON.stringify(data) : undefined,
        });
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Failed to ${method} ${path}: ${response.statusText}`, {
            cause: response.status,
        });
    }

    private async marketDataApiRequest(path: string, parameters?: Record<string, string>) {
        const url = new URL(path, this.baseDataUrl);
        const searchParams = new URLSearchParams(parameters);
        const response = await fetch(`${url.toString()}?${searchParams.toString()}`, {
            headers: {
                'APCA-API-KEY-ID': this.opts.key,
                'APCA-API-SECRET-KEY': this.opts.secret,
            },
        });
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Failed to GET ${path}: ${response.statusText}`, {
            cause: response.status,
        });
    }
}
