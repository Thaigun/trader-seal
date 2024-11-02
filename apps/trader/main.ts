import { AlpacaClient } from '@trader-seal/alpaca-client';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    const keyId = Deno.env.get('APCA_KEY_ID');
    const keySecret = Deno.env.get('APCA_KEY_SECRET');
    if (!keyId || !keySecret) {
        throw new Error('Missing APCA_KEY_ID or APCA_KEY_SECRET environment variables');
    }
    const client = new AlpacaClient({
        key: keyId,
        secret: keySecret,
        mode: 'paper',
    });

    const codes = await client.getExchangeCodes();
    console.log(codes);
}
