import { makeAlpacaClient } from './factory/alpacaClientFactory.ts';

if (import.meta.main) {
    const client = makeAlpacaClient();
    console.log(client);
}
