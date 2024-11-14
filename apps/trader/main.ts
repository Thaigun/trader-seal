import { DailyOhlcvDataProvider } from './dataProvider/dailyOhlcvData.ts';

if (!import.meta.main) {
    throw new Error('This module should be used as a script');
}

const dailyOhlcvDataProvider = new DailyOhlcvDataProvider();
await dailyOhlcvDataProvider.start();
