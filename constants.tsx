
import React from 'react';
import { Chain } from './types';
import { Layers, Zap, Database, Share2 } from 'lucide-react';

export const CHAIN_CONFIG: Record<Chain, { name: string, color: string, icon: React.ReactNode }> = {
  solana: { 
    name: 'Solana', 
    color: 'bg-purple-600', 
    icon: <Zap className="w-4 h-4" /> 
  },
  ethereum: { 
    name: '以太坊', 
    color: 'bg-blue-600', 
    icon: <Layers className="w-4 h-4" /> 
  },
  base: { 
    name: 'Base', 
    color: 'bg-indigo-600', 
    icon: <Database className="w-4 h-4" /> 
  },
  polygon: { 
    name: 'Polygon', 
    color: 'bg-violet-600', 
    icon: <Share2 className="w-4 h-4" /> 
  }
};

export const MOCK_ALERTS_TEMPLATES = [
  "在支撑位检测到显著的大户吸筹。",
  "前10名持有人在过去一小时内增持了15%的仓位。",
  "此前曾获利的聪明钱钱包正在入场。",
  "流动性已锁定1年，伴随巨大的买盘压力。",
  "观察到来自主要流动性提供者的多个中心化交易所流入模式。"
];
