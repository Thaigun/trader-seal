import { DataProvider } from './dataProvider.ts';

export class DailyOhlcvDataProvider extends DataProvider {
    start() {
        console.log('Starting daily OHLCV data provider');
    }
}
