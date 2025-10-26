// Fix: Added type definitions used throughout the application.
export type Currency = 'SOL' | 'ETH' | 'USDC';

export type TriggerType = 'priceDip' | 'volumeSpike' | 'newLiquidity';

export enum StrategyStatus {
    Active = 'Active',
    Executing = 'Executing',
    Completed = 'Completed',
}

export interface Strategy {
    id: number;
    status: StrategyStatus;
    targetCoin: string;
    condition: string;
    amount: string;
}

export interface Asset {
    icon: string;
    name: string;
    ticker: string;
    balance: number;
    price: number;
    value: number;
    change24h: number;
}

export interface Activity {
    id: number;
    type: 'Buy' | 'Sell';
    tokenTicker: string;
    tokenName: string;
    amount: string;
    value: string;
    time: string;
}

export type GasSpeed = 'fast' | 'turbo' | 'custom';

export interface SettingsType {
    gasSpeed: GasSpeed;
    customGasFee: number;
    mevProtectBuys: boolean;
    mevProtectSells: boolean;
    autoBuy: boolean;
    autoSell: boolean;
    confirmTrades: boolean;
    defaultBuySlippage: number;
    defaultSellSlippage: number;
    telegramConfig?: TelegramConfig;
}

export type Page =
    | 'dashboard'
    | 'positions'
    | 'limit-orders'
    | 'dca-orders'
    | 'copy-trade'
    | 'lp-sniper'
    | 'auto-buy'
    | 'bridge'
    | 'withdraw'
    | 'telegram-scraper'
    | 'settings'
    | 'help';

export type OrderType = 'Buy' | 'Sell';

export interface Position {
    id: number;
    pair: string;
    size: string;
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
}

export type OrderStatus = 'Active' | 'Filled' | 'Cancelled';

export interface LimitOrder {
    id: number;
    pair: string;
    type: OrderType;
    price: number;
    amount: string;
    status: OrderStatus;
}

export interface NewPair {
    id: number;
    pair: string;
    age: string;
    liquidity: number;
}

export interface TelegramConfig {
    apiId: string;
    apiHash: string;
    phone: string;
    groups: string[];
    keywords: string[];
    isActive: boolean;
}

export interface TelegramMessage {
    id: number;
    group: string;
    message: string;
    timestamp: string;
    processed: boolean;
}
