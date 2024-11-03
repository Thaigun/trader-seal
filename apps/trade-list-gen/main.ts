import { AlpacaClient } from '@trader-seal/alpaca-client';
import { ensureDir,  } from "jsr:@std/fs";

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
    const assets = await client.getAssets();
    await ensureDir("./output");
    await Deno.writeTextFile('./output/assets.json', JSON.stringify(assets, null, 2));
}
