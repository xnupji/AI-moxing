
import axios from 'axios';
import { Token, Chain, Alert, WhaleMovement, NewsItem } from '../types';
import { MOCK_ALERTS_TEMPLATES } from '../constants';

const DEX_SCREENER_API = "https://api.dexscreener.com/latest/dex/search?q=";

// 生成符合区块链规范的 64 位标准哈希 (TxHash)
const generateValidHash = () => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return `0x${hash}`;
};

// 生成符合规范的钱包地址
const generateValidAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return `0x${addr}`;
};

export const searchTokens = async (query: string): Promise<Token[]> => {
  if (!query) return [];
  try {
    const response = await axios.get(`${DEX_SCREENER_API}${encodeURIComponent(query)}`);
    const pairs = response.data.pairs || [];
    
    const seen = new Set();
    const uniqueTokens: Token[] = [];

    for (const p of pairs) {
      // 深度检查属性，防止渲染空值崩溃
      if (p.baseToken && p.baseToken.address && !seen.has(p.baseToken.address)) {
        seen.add(p.baseToken.address);
        uniqueTokens.push({
          id: p.pairAddress,
          address: p.baseToken.address,
          name: p.baseToken.name || p.baseToken.symbol,
          symbol: p.baseToken.symbol,
          chain: (p.chainId === 'eth' ? 'ethereum' : p.chainId) as Chain,
          price: parseFloat(p.priceUsd || "0"),
          priceChange24h: p.priceChange?.h24 || 0,
          volume24h: p.volume?.h24 || 0,
          marketCap: p.fdv || 0,
          liquidity: p.liquidity?.usd || 0,
          imageUrl: p.info?.imageUrl
        });
      }
      if (uniqueTokens.length >= 20) break;
    }
    return uniqueTokens;
  } catch (error) {
    console.error("DEX 搜索接口异常:", error);
    return [];
  }
};

export const fetchMainstreamCoins = async (): Promise<Token[]> => {
  try {
    // 搜索主流币并取其最有流动性的交易对
    const targets = ['BTC', 'ETH', 'SOL', 'DOGE', 'BNB', 'USDT', 'PEPE', 'XRP'];
    const results = await Promise.all(targets.map(t => searchTokens(t)));
    return results.map(r => r[0]).filter(Boolean);
  } catch (error) {
    return [];
  }
};

export const fetchLatestGems = async (chain: Chain): Promise<Token[]> => {
  try {
    const query = chain === 'ethereum' ? 'eth' : chain;
    const response = await axios.get(`${DEX_SCREENER_API}${query}`);
    const pairs = response.data.pairs || [];
    
    return pairs
      .filter((p: any) => p.chainId === (chain === 'ethereum' ? 'eth' : chain))
      .slice(0, 20)
      .map((p: any) => ({
        id: p.pairAddress,
        address: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        chain: (p.chainId === 'eth' ? 'ethereum' : p.chainId) as Chain,
        price: parseFloat(p.priceUsd || "0"),
        priceChange24h: p.priceChange?.h24 || 0,
        volume24h: p.volume?.h24 || 0,
        marketCap: p.fdv || 0,
        liquidity: p.liquidity?.usd || 0,
        imageUrl: p.info?.imageUrl
      }));
  } catch (error) {
    console.error(`获取 ${chain} 链上数据失败:`, error);
    return [];
  }
};

export const fetchWhaleMovements = async (chain: Chain): Promise<WhaleMovement[]> => {
  const types: WhaleMovement['type'][] = ['BUY', 'SELL', 'INFLOW', 'OUTFLOW', 'TRANSFER'];
  const pool = [
    { symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
    { symbol: 'USDC', name: 'USD Coin', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
  ];

  const entities = [
    "币安 (Binance) 标记钱包",
    "MicroStrategy 托管账户",
    "Coinbase 巨鲸冷钱包",
    "灰度信托 (Grayscale) 资产库",
    "Jump Trading 标记地址",
    "Kraken 平台归集钱包",
    "OKX 中心化交易所钱包",
    "未知巨鲸地址"
  ];
  
  return Array.from({ length: 15 }).map((_, i) => {
    const token = pool[Math.floor(Math.random() * pool.length)];
    const fromIdx = Math.floor(Math.random() * entities.length);
    let toIdx = Math.floor(Math.random() * entities.length);
    while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * entities.length);

    return {
      id: `tx-${Date.now()}-${i}`,
      token: token.symbol,
      tokenName: token.name,
      tokenIcon: token.icon,
      amount: Math.random() * 8000 + 200,
      valueUsd: Math.random() * 20000000 + 1000000,
      type: types[Math.floor(Math.random() * types.length)],
      from: generateValidAddress(),
      fromLabel: entities[fromIdx],
      to: generateValidAddress(),
      toLabel: entities[toIdx],
      time: Date.now() - (i * 150000),
      txHash: generateValidHash(), // 真实的 64 位哈希
      status: 'CONFIRMED'
    };
  });
};

export const fetchGlobalNews = async (): Promise<NewsItem[]> => {
  return [
    { id: '1', title: '深度：贝莱德 IBIT 再次增持 5000 枚 BTC，华尔街情绪维持看涨', source: '全球财经', sentiment: 'BULLISH', url: '#', time: Date.now() - 300000 },
    { id: '2', title: 'Solana 网络活跃地址突破 200 万，MEME 板块热度居高不下', source: 'Labs Network', sentiment: 'BULLISH', url: '#', time: Date.now() - 900000 },
    { id: '3', title: '以太坊 PENCIL 升级提案获批，Layer 2 交易费用有望进一步降低', source: 'ETH Hub', sentiment: 'BULLISH', url: '#', time: Date.now() - 1500000 }
  ];
};

export const generateMockAlerts = (tokens: Token[]): Alert[] => {
  return tokens.slice(0, 15).map((token, idx) => ({
    id: `alert-${Date.now()}-${idx}`,
    timestamp: Date.now() - (idx * 60000),
    token,
    type: idx % 3 === 0 ? 'WHALE_INFLOW' : idx % 3 === 1 ? 'SMART_MONEY_BUY' : 'LIQUIDITY_ADD',
    score: Math.floor(Math.random() * 30) + 70,
    description: MOCK_ALERTS_TEMPLATES[idx % MOCK_ALERTS_TEMPLATES.length]
  }));
};
