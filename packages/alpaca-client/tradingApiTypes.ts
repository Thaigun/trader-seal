export type ExchangeCodes = Record<string, string>;

export interface Asset {
    id: string;
    class: string;
    exchange: 'AMEX' | 'ARCA' | 'BATS' | 'NYSE' | 'NASDAQ' | 'NYSEARCA' | 'OTC';
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