
import React from 'react';
import { Alert, Token } from '../types';
import { CHAIN_CONFIG } from '../constants';
import { TrendingUp, TrendingDown, Target, Info, Search } from 'lucide-react';

interface AlertTableProps {
  alerts: Alert[];
  onSelectToken: (token: Token) => void;
  selectedId?: string;
}

const AlertTable: React.FC<AlertTableProps> = ({ alerts, onSelectToken, selectedId }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
        <h3 className="font-semibold flex items-center gap-2 text-white">
          <Target className="w-4 h-4 text-emerald-400" />
          实时信号流
        </h3>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Info className="w-3 h-3" />
          每 30 秒自动更新
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-500 uppercase bg-gray-950/50">
            <tr>
              <th className="px-6 py-3 font-medium">代币</th>
              <th className="px-6 py-3 font-medium">信号类型</th>
              <th className="px-6 py-3 font-medium">价格/涨跌</th>
              <th className="px-6 py-3 font-medium">AI 评分</th>
              <th className="px-6 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  暂无信号，正在扫描链上数据...
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr 
                  key={alert.id}
                  className={`hover:bg-gray-800/40 transition-colors cursor-pointer group ${selectedId === alert.token.id ? 'bg-indigo-500/10' : ''}`}
                  onClick={() => onSelectToken(alert.token)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border border-gray-700 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                        {alert.token.imageUrl ? (
                          <img src={alert.token.imageUrl} alt={alert.token.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{alert.token.symbol.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2 text-gray-200">
                          {alert.token.name}
                          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white ${CHAIN_CONFIG[alert.token.chain].color}`}>
                            {alert.token.symbol}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[120px] font-mono mt-0.5">
                          {alert.token.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit ${
                        alert.type === 'WHALE_INFLOW' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        alert.type === 'SMART_MONEY_BUY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                      }`}>
                        {alert.type === 'WHALE_INFLOW' ? '巨鲸流入' : alert.type === 'SMART_MONEY_BUY' ? '聪明钱买入' : '新增流动性'}
                      </span>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{alert.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    <div className="font-medium text-gray-200">${alert.token.price.toLocaleString(undefined, { maximumSignificantDigits: 6 })}</div>
                    <div className={`flex items-center gap-1 text-[11px] ${alert.token.priceChange24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {alert.token.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {alert.token.priceChange24h.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${alert.score > 80 ? 'bg-emerald-500' : alert.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${alert.score}%` }}
                        ></div>
                      </div>
                      <span className="font-bold font-mono text-[11px] text-gray-300">{alert.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium border border-gray-700 hover:border-indigo-500 transition-all flex items-center gap-2 ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectToken(alert.token);
                      }}
                    >
                      <Search className="w-3 h-3" />
                      深度分析
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertTable;
