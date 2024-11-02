import type { TradingAPIRequestData } from './tradingApiTypes.ts';

interface AlpacaClientOptions {
    key: string;
    secret: string;
    mode: 'live' | 'paper';
}

export class AlpacaClient {
    constructor(private opts: AlpacaClientOptions) {}

    async getExchangeCodes() {
        return await this.marketDataApiRequest('v2/stocks/meta/exchanges');
    }

    private get baseUrl() {
        return this.opts.mode === 'live' ? 'https://api.alpaca.markets' : 'https://paper-api.alpaca.markets';
    }

    private get baseDataUrl() {
        return 'https://data.alpaca.markets';
    }

    private async tradingApiRequest(path: string, method: string, data?: TradingAPIRequestData) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                'APCA-API-KEY-ID': this.opts.key,
                'APCA-API-SECRET-KEY': this.opts.secret,
                'Content-Type': 'application/json',
            },
            body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
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
