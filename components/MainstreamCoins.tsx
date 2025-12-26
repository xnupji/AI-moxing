
import React, { useEffect, useState } from 'react';
import { Token } from '../types';
import { fetchMainstreamCoins } from '../services/dataService';
import TokenChart from './TokenChart';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

interface MainstreamCoinsProps {
  onSelect: (token: Token) => void;
}

const MainstreamCoins: React.FC<MainstreamCoinsProps> = ({ onSelect }) => {
  const [coins, setCoins] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMainstreamCoins().then(res => {
      setCoins(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 mt-4 uppercase font-bold tracking-widest">同步全球主流交易所数据...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coins.map(coin => (
          <div 
            key={coin.id}
            onClick={() => onSelect(coin)}
            className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
               <Activity className="w-12 h-12 text-indigo-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <img src={coin.imageUrl || `https://ui-avatars.com/api/?name=${coin.symbol}&background=111827&color=6366f1`} className="w-10 h-10 rounded-full border border-gray-700" alt="" />
               <div>
                  <div className="font-bold text-gray-200">{coin.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{coin.symbol} / USDT</div>
               </div>
            </div>
            <div className="text-xl font-mono font-bold text-white mb-1">
               ${coin.price.toLocaleString()}
            </div>
            <div className={`text-xs font-bold flex items-center gap-1 ${coin.priceChange24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
               <TrendingUp className={`w-3 h-3 ${coin.priceChange24h < 0 ? 'rotate-180' : ''}`} />
               {coin.priceChange24h.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
         <div className="flex items-center gap-2 mb-6 text-gray-400">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-bold uppercase tracking-widest">主流资产 K 线走势监测</span>
         </div>
         {coins.length > 0 && <TokenChart token={coins[0]} />}
      </div>
    </div>
  );
};

export default MainstreamCoins;
