
import React, { useEffect, useState } from 'react';
import { Chain, WhaleMovement } from '../types';
import { fetchWhaleMovements } from '../services/dataService';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Filter, 
  ExternalLink, 
  Globe, 
  Target, 
  Search, 
  X, 
  Layers, 
  Database, 
  Cpu, 
  ShieldCheck,
  ArrowRightLeft,
  Copy,
  CheckCircle2
} from 'lucide-react';

interface WhaleTrackerProps {
  chain: Chain;
}

const WhaleTracker: React.FC<WhaleTrackerProps> = ({ chain }) => {
  const [movements, setMovements] = useState<WhaleMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovement, setSelectedMovement] = useState<WhaleMovement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchWhaleMovements(chain);
      setMovements(data);
      setLoading(false);
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, [chain]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = (move: WhaleMovement) => {
    // 根据币种所在的链跳转到对应的浏览器
    const tx = move.txHash;
    if (move.token === 'BTC') return `https://www.blockchain.com/explorer/transactions/btc/${tx}`;
    if (chain === 'solana' || move.token === 'SOL') return `https://solscan.io/tx/${tx}`;
    if (chain === 'ethereum' || move.token === 'ETH') return `https://etherscan.io/tx/${tx}`;
    if (chain === 'base') return `https://basescan.org/tx/${tx}`;
    if (chain === 'polygon') return `https://polygonscan.com/tx/${tx}`;
    return `https://etherscan.io/tx/${tx}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-in fade-in duration-500">
      {/* 列表部分 */}
      <div className={`flex-1 flex flex-col bg-gray-950/40 border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all ${selectedMovement ? 'hidden lg:flex' : 'flex'}`}>
        <div className="px-10 py-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/60">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600/20 rounded-2xl">
              <RefreshCw className={`w-6 h-6 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-black text-white text-xl uppercase tracking-tighter">巨鲸全网监测</h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">毫秒级捕捉主流币异动</p>
            </div>
          </div>
          <button className="p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {movements.map((move) => (
            <div 
              key={move.id} 
              onClick={() => setSelectedMovement(move)}
              className={`bg-gray-950/40 border p-8 rounded-[2.5rem] transition-all flex flex-col md:flex-row justify-between items-start md:items-center group cursor-pointer ${selectedMovement?.id === move.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-800 hover:border-indigo-500/50'}`}
            >
              <div className="flex items-center gap-8">
                <div className={`p-5 rounded-[2rem] relative ${move.type === 'BUY' || move.type === 'INFLOW' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                  <img src={move.tokenIcon} className="w-8 h-8 object-contain" alt="" />
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-2xl text-white tracking-tighter">${move.valueUsd.toLocaleString()}</span>
                    <span className="text-[10px] font-black px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-indigo-400 uppercase tracking-widest">
                      {move.tokenName} ({move.token})
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-2 font-bold uppercase tracking-widest">
                    <Globe className="w-3.5 h-3.5" /> {move.fromLabel} <ArrowRightLeft className="w-3 h-3 mx-2" /> <Target className="w-3.5 h-3.5" /> {move.toLabel}
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-3 mt-6 md:mt-0">
                <div className="text-[10px] text-gray-600 font-mono tracking-tighter bg-gray-900 px-3 py-1 rounded-lg">{move.txHash.slice(0, 18)}...</div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black text-gray-500 uppercase">{new Date(move.time).toLocaleTimeString()}</span>
                   <button className="text-[10px] bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20">
                     详情报告 <Search className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详情报告部分 */}
      <div className={`w-full lg:w-[500px] bg-gray-950/80 border border-gray-800 rounded-[3rem] p-10 flex flex-col shadow-2xl backdrop-blur-2xl ${selectedMovement ? 'flex' : 'hidden'}`}>
        {selectedMovement ? (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500 h-full overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white tracking-tighter">链上异动深度报告</h3>
              <button onClick={() => setSelectedMovement(null)} className="p-3 bg-gray-900 rounded-full text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 交易币种核心展示 */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-gray-950 border border-gray-800 rounded-3xl p-3 flex items-center justify-center">
                    <img src={selectedMovement.tokenIcon} className="w-full h-full object-contain" alt={selectedMovement.tokenName} />
                 </div>
                 <div>
                    <h4 className="text-3xl font-black text-white tracking-tighter">${selectedMovement.valueUsd.toLocaleString()}</h4>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-1">捕捉币种：{selectedMovement.tokenName} ({selectedMovement.token})</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-950/60 p-5 rounded-2xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">转账净值</div>
                    <div className="text-sm font-black text-white">{selectedMovement.amount.toLocaleString()} {selectedMovement.token}</div>
                 </div>
                 <div className="bg-gray-950/60 p-5 rounded-2xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">链上状态</div>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 最终确认</div>
                 </div>
              </div>
            </div>

            {/* 资金流向链路 */}
            <div className="space-y-6">
               <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500" /> 资金流向链路分析</h5>
               <div className="space-y-4 relative">
                  <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-950 rounded-full flex items-center justify-center text-rose-400"><ArrowDownRight className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                       <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">发送方 SOURCE</div>
                       <div className="text-sm font-black text-white truncate">{selectedMovement.fromLabel}</div>
                       <div className="text-[10px] font-mono text-gray-600 truncate">{selectedMovement.from}</div>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-indigo-500/30 mx-auto"></div>
                  <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-950 rounded-full flex items-center justify-center text-emerald-400"><ArrowUpRight className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                       <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">接收方 DESTINATION</div>
                       <div className="text-sm font-black text-white truncate">{selectedMovement.toLabel}</div>
                       <div className="text-[10px] font-mono text-gray-600 truncate">{selectedMovement.to}</div>
                    </div>
                  </div>
               </div>
            </div>

            {/* 交易哈希 (TXID) */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-inner">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">交易哈希 (64-BIT TXID)</span>
                  <button 
                    onClick={() => handleCopy(selectedMovement.txHash)} 
                    className="flex items-center gap-2 text-[10px] text-indigo-400 hover:text-white transition-colors uppercase font-bold"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '已复制' : '复制哈希'}
                  </button>
               </div>
               <div className="p-5 bg-gray-950 rounded-xl text-[11px] font-mono text-indigo-400 break-all leading-relaxed border border-indigo-500/10">
                  {selectedMovement.txHash}
               </div>
               <div className="p-5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[11px] text-gray-400 leading-relaxed font-bold italic uppercase tracking-wider">
                  "系统研报：本笔异动涉及{selectedMovement.fromLabel}，被标记为核心监控事件。此类转账通常预示主力建仓布局。建议监控 15min 级别的盘口买卖比变化。"
               </div>
               <button 
                onClick={() => window.open(getExplorerUrl(selectedMovement), '_blank')}
                className="w-full py-4 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"
               >
                 在区块链浏览器中查看日志 <ExternalLink className="w-4 h-4" />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 gap-6">
            <Cpu className="w-32 h-32 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-center">请从左侧选择记录<br/>查看深度链上报告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhaleTracker;
