
export type Chain = 'solana' | 'ethereum' | 'base' | 'polygon';
export type View = 'terminal' | 'whale' | 'discovery' | 'mainstream' | 'academy' | 'watchlist' | 'admin' | 'settings' | 'mainstream_detail';
export type InviteDurationType = 'CUSTOM' | 'LIFETIME';

export interface User {
  email: string;
  isRegistered: boolean;
  isAdmin: boolean;
  expiryDate?: number; // Timestamp
  nickname?: string;
  avatar?: string;
  referralCount?: number;
  bonusDays?: number;
  invitedBy?: string;
}

export interface InviteCode {
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: number;
  durationDays: number | null; // null for lifetime
  expiresAt: number | null;
  manualBound?: boolean;
}

export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  chain: Chain;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  imageUrl?: string;
}

export interface Alert {
  id: string;
  timestamp: number;
  token: Token;
  type: 'WHALE_INFLOW' | 'LIQUIDITY_ADD' | 'SMART_MONEY_BUY';
  score: number;
  description: string;
}

export interface WhaleMovement {
  id: string;
  token: string;
  tokenName: string;
  tokenIcon?: string;
  amount: number;
  valueUsd: number;
  type: 'BUY' | 'SELL' | 'TRANSFER' | 'OUTFLOW' | 'INFLOW';
  from: string;
  fromLabel: string;
  to: string;
  toLabel: string;
  time: number;
  txHash: string;
  status: 'CONFIRMED' | 'PENDING';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  url: string;
  time: number;
}

export interface PredictionResult {
  predicted: number;
  current: number;
  changePercent: number;
  confidence: number;
  timeframe: string;
}

export interface AIAnalysis {
  summary: string;
  bullishFactors: string[];
  bearishFactors: string[];
  riskLevel: '极低' | '中等' | '高' | '极端';
  recommendation: string;
  socialSentiment: string;
  newsAnalysis: string;
  groundingUrls?: { title: string, uri: string }[];
}
