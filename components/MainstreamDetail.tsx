
import React, { useEffect, useState } from 'react';
import { Token, AIAnalysis } from '../types';
import { analyzeToken } from '../services/geminiService';
import TokenChart from './TokenChart';
import { Sparkles, TrendingUp, Info, Newspaper, ChevronLeft, Globe } from 'lucide-react';

interface MainstreamDetailProps {
  token: Token;
  onBack: () => void;
}

const MainstreamDetail: React.FC<MainstreamDetailProps> = ({ token, onBack }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyzeToken(token).then(res => {
      setAnalysis(res);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white uppercase transition-colors">
        <ChevronLeft className="w-4 h-4" /> 返回主流列表
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <img src={token.imageUrl || `https://ui-avatars.com/api/?name=${token.symbol}&background=111827&color=6366f1`} className="w-12 h-12 rounded-full" alt="" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{token.name}</h2>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{token.symbol} 全网实时走势</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-3xl font-mono font-bold text-white">${token.price.toLocaleString()}</div>
                   <div className={`text-sm font-bold flex items-center justify-end gap-1 ${token.priceChange24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                     <TrendingUp className={`w-4 h-4 ${token.priceChange24h < 0 ? 'rotate-180' : ''}`} />
                     {token.priceChange24h.toFixed(2)}%
                   </div>
                </div>
             </div>
             <TokenChart token={token} />
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8">
             <div className="flex items-center gap-3 mb-6">
                <Newspaper className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">全网利好/动态情报 (Market Intelligence)</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-l-2 border-emerald-500 pl-3">看涨利好信息</h4>
                   <div className="space-y-3">
                      {loading ? [1, 2].map(i => <div key={i} className="h-12 bg-gray-800/50 rounded-xl animate-pulse"></div>) : 
                        analysis?.bullishFactors.map((f, i) => (
                          <div key={i} className="p-4 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 leading-relaxed italic">
                             {f}
                          </div>
                        ))
                      }
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border-l-2 border-amber-500 pl-3">宏观/风险提示</h4>
                   <div className="space-y-3">
                      {loading ? [1, 2].map(i => <div key={i} className="h-12 bg-gray-800/50 rounded-xl animate-pulse"></div>) : 
                        analysis?.bearishFactors.map((f, i) => (
                          <div key={i} className="p-4 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-400 leading-relaxed italic">
                             {f}
                          </div>
                        ))
                      }
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-4">
           <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-8 space-y-6 shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                 <Sparkles className="w-6 h-6 text-indigo-400" />
                 <h3 className="text-lg font-bold text-white">AI 智能分析报告</h3>
              </div>
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-20 opacity-30">
                  <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold tracking-widest uppercase">研报生成中...</span>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="p-5 bg-gray-950/80 border border-indigo-500/10 rounded-2xl italic text-sm text-gray-300 leading-relaxed">
                     "{analysis?.summary}"
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                         <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">风险等级</div>
                         <div className={`text-lg font-bold ${analysis?.riskLevel === '极低' ? 'text-emerald-400' : 'text-amber-400'}`}>{analysis?.riskLevel}</div>
                      </div>
                      <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                         <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">社交热度</div>
                         <div className="text-lg font-bold text-indigo-400">飙升</div>
                      </div>
                   </div>
                   <div className="pt-4 space-y-3">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                         <Info className="w-3 h-3" /> 投研建议
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed bg-gray-900 p-4 rounded-xl border border-gray-800">
                        {analysis?.recommendation}
                      </p>
                   </div>
                   {/* Fix: Must list URLs when using googleSearch grounding */}
                   {analysis?.groundingUrls && analysis.groundingUrls.length > 0 && (
                      <div className="pt-4 space-y-3">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                          <Globe className="w-3 h-3" /> 参考来源
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.groundingUrls.slice(0, 4).map((url, i) => (
                            <a 
                              key={i} 
                              href={url.uri} 
                              target="_blank" 
                              className="text-[10px] px-2 py-1 bg-gray-900 hover:bg-gray-800 rounded border border-gray-800 text-gray-400 truncate max-w-[120px]"
                            >
                              {url.title}
                            </a>
                          ))}
                        </div>
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MainstreamDetail;
