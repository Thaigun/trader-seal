export interface MostActiveStocksParams {
    by: 'volume' | 'trades';
    top: number;
}

export type TradingAPIRequestData = MostActiveStocksParams;
