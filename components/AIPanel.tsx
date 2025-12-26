
import React from 'react';
import { AIAnalysis, Token, PredictionResult } from '../types';
import { Zap, BarChart3, ExternalLink, Bookmark, MessageCircle, Newspaper, Globe } from 'lucide-react';

interface AIPanelProps {
  token: Token;
  analysis: AIAnalysis | null;
  prediction: PredictionResult | null;
  loading: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (token: Token) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ token, analysis, prediction, loading, isInWatchlist, onToggleWatchlist }) => {
  if (loading) {
    return (
      <div className="bg-gray-950/40 border border-gray-800 rounded-[2.5rem] p-10 h-full flex flex-col items-center justify-center gap-6 min-h-[400px] backdrop-blur-xl">
        <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-lg"></div>
        <div className="flex flex-col items-center text-center">
          <p className="text-white font-black uppercase tracking-[0.2em]">神经网络深度扫描中...</p>
          <p className="text-gray-500 text-[10px] mt-2 font-mono uppercase tracking-widest">正在分析 Twitter, 新闻与链上实验室数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 核心 AI 摘要与风险 */}
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black flex items-center gap-3 text-indigo-400 uppercase text-xs tracking-[0.2em]">
            <Zap className="w-5 h-5" />
            Gemini AI 实时投研报告
          </h3>
          <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
            analysis?.riskLevel === '极低' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            analysis?.riskLevel === '中等' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            风险等级: {analysis?.riskLevel || '同步中'}
          </span>
        </div>
        <div className="bg-gray-950/60 p-6 rounded-[1.5rem] border border-white/5 relative">
          <div className="absolute top-4 left-4 text-indigo-500/20"><Zap className="w-8 h-8" /></div>
          <p className="text-sm lg:text-base leading-relaxed text-gray-200 italic font-medium relative z-10">
            "{analysis?.summary || '正在综合评估全球社交热度与链上大额异动，为您生成精准投资研报...'}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 社交情绪 */}
        <div className="bg-gray-950/40 border border-gray-800 rounded-[2rem] p-6 shadow-xl">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-4 flex items-center gap-3 tracking-[0.2em]">
            <MessageCircle className="w-4 h-4" />
            全球社交媒体情绪 (X/Twitter/TG)
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            {analysis?.socialSentiment || "正在捕获全球推文互动与社区讨论热度..."}
          </p>
        </div>
        {/* 新闻分析 */}
        <div className="bg-gray-950/40 border border-gray-800 rounded-[2rem] p-6 shadow-xl">
          <h4 className="text-[10px] font-black text-amber-400 uppercase mb-4 flex items-center gap-3 tracking-[0.2em]">
            <Newspaper className="w-4 h-4" />
            全球财经研报分析
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            {analysis?.newsAnalysis || "正在扫描 CoinTelegraph, Bloomberg 等各大加密媒体最新动态..."}
          </p>
        </div>
      </div>

      {/* 神经网络预测 */}
      <div className="bg-gray-950/40 border border-gray-800 rounded-[2rem] p-8 shadow-xl">
        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <BarChart3 className="w-4 h-4" />
          神经网络价格预测模型 (72H)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 bg-gray-900/60 rounded-[1.5rem] border border-gray-800 flex flex-col gap-1">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">目标预测位</div>
            <div className="text-2xl font-mono font-black text-emerald-400">
              ${prediction?.predicted.toLocaleString(undefined, { maximumSignificantDigits: 6 })}
            </div>
          </div>
          <div className="p-5 bg-gray-900/60 rounded-[1.5rem] border border-gray-800 flex flex-col gap-1">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">预计价格偏移</div>
            <div className={`text-2xl font-mono font-black ${prediction && prediction.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {prediction ? (prediction.changePercent >= 0 ? '+' : '') : ''}{prediction?.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* 投资决策建议 */}
      <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] p-8 mt-auto flex flex-col gap-6">
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI 专家最终投资决策</h4>
          <div className="p-6 bg-gray-950/80 rounded-[1.5rem] border-l-4 border-l-indigo-500 shadow-inner">
            <p className="text-sm text-indigo-100 leading-relaxed font-bold">
              {analysis?.recommendation || '正在结合全球宏观资产与局部链上指标进行最终风险评定...'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href={`https://dexscreener.com/${token.chain}/${token.address}`} 
            target="_blank" 
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 uppercase tracking-widest"
          >
            去建仓交易 <ExternalLink className="w-4 h-4" />
          </a>
          <button 
            onClick={() => onToggleWatchlist(token)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] border-2 transition-all text-xs font-black uppercase tracking-widest ${
              isInWatchlist ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'border-gray-800 hover:bg-gray-900 text-gray-400'
            } active:scale-95`}
          >
            <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            {isInWatchlist ? '移除自选' : '加入自选库'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
