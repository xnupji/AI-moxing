
import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types';
import { fetchGlobalNews } from '../services/dataService';
import { Globe, TrendingUp, MessageSquare, Newspaper, Zap, Activity, BarChart3, Target } from 'lucide-react';

const MarketDiscovery: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchGlobalNews().then(setNews);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* TradingView Inspired Screener Topbar */}
      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-30"></div>
        <ScreenerStat icon={<Globe />} label="恐惧贪婪指数" value="74" sub="贪婪" color="text-emerald-400" progress={74} />
        <ScreenerStat icon={<MessageSquare />} label="社交爆发热度" value="High" sub="X/TG Trending" color="text-indigo-400" progress={92} />
        <ScreenerStat icon={<Activity />} label="全网持仓波动" value="+$240M" sub="24h Change" color="text-indigo-400" progress={65} />
        <ScreenerStat icon={<Target />} label="AI 选币命中率" value="82%" sub="Past 30 Days" color="text-emerald-400" progress={82} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Section: Advanced Screener News */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-gray-950/40 border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="px-10 py-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <div className="flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-white text-lg tracking-tight uppercase">全球深度研报聚合</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-black tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">REAL-TIME</span>
            </div>
            <div className="divide-y divide-gray-800/50">
              {news.map((item) => (
                <div key={item.id} className="p-8 hover:bg-indigo-500/5 transition-all group cursor-pointer border-l-4 border-transparent hover:border-indigo-500">
                  <div className="flex justify-between items-start gap-8">
                    <div className="flex-1 space-y-4">
                      <h4 className="text-lg font-black text-gray-100 leading-tight group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] px-3 py-1 bg-gray-800/80 rounded-xl text-gray-300 uppercase font-black tracking-widest border border-gray-700">{item.source}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(item.time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      item.sentiment === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      item.sentiment === 'BEARISH' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {item.sentiment === 'BULLISH' ? 'Bullish' : item.sentiment === 'BEARISH' ? 'Bearish' : 'Neutral'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Pro Insights & Indicators */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] shadow-2xl space-y-8">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-400" />
              阿尔法发现引擎
            </h4>
            <div className="space-y-6">
              <InsightRow label="Layer 2 活跃度" value="超高" sub="Base 网络爆发" trend="up" />
              <InsightRow label="MEME 投机情绪" value="极度狂热" sub="Solana 链上活跃" trend="up" />
              <InsightRow label="机构大单倾向" value="中性偏多" sub="BTC 现货流入" trend="neutral" />
            </div>
            <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 uppercase tracking-[0.2em] text-xs">
              生成全网深度研报
            </button>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[3rem] space-y-6 shadow-xl">
             <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">量化多空比 (Global)</h4>
             </div>
             <div className="flex items-end h-32 gap-3">
                {[45, 67, 34, 89, 56, 78, 92].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-xl group relative cursor-help">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500/60 group-hover:bg-indigo-500 rounded-t-xl transition-all"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest pt-2">
                <span>Mon</span>
                <span>Sun</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenerStat = ({ icon, label, value, sub, color, progress }: any) => (
  <div className="space-y-4 group">
    <div className="flex items-center gap-3 text-gray-500">
      <div className="p-2 bg-gray-900 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div>
      <div className={`text-3xl font-black font-mono tracking-tighter ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">{sub}</div>
    </div>
    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const InsightRow = ({ label, value, sub, trend }: any) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
    <div className="space-y-1">
      <div className="text-xs font-black text-gray-200 uppercase tracking-widest">{label}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase">{sub}</div>
    </div>
    <div className="text-right">
      <div className={`text-sm font-black uppercase ${trend === 'up' ? 'text-emerald-400' : 'text-gray-400'}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{trend === 'up' ? '↑ Strong' : '→ Neutral'}</div>
    </div>
  </div>
);

export default MarketDiscovery;
