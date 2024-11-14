import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
    assets: AssetTable;
    daily_prices: DailyPriceTable;
    events: EventTable;
}

export interface AssetTable {
    symbol: string;
    class: string;
    exchange: string;
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
export type Asset = Selectable<AssetTable>;
export type NewAsset = Insertable<AssetTable>;
export type AssetUpdate = Updateable<AssetTable>;

export interface DailyPriceTable {
    id: Generated<number>;
    symbol: string;
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjusted_close: number;
}
export type DailyPrice = Selectable<DailyPriceTable>;
export type NewDailyPrice = Insertable<DailyPriceTable>;
export type DailyPriceUpdate = Updateable<DailyPriceTable>;

export interface EventTable {
    id: Generated<number>;
    symbol: string;
    event_type: string;
    timestamp: number;
    value: number;
}
export type Event = Selectable<EventTable>;
export type NewEvent = Insertable<EventTable>;
export type EventUpdate = Updateable<EventTable>;
