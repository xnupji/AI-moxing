
import React, { useEffect, useRef } from 'react';
import { Token } from '../types';

interface TokenChartProps {
  token: Token;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TokenChart: React.FC<TokenChartProps> = ({ token }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `tv_chart_${token.id}`;

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (containerRef.current && window.TradingView) {
        // 动态计算交易对 symbol，由于 mock 数据主要使用 symbol，默认展示币安 symbol
        const symbol = `BINANCE:${token.symbol}USDT`;
        
        new window.TradingView.widget({
          "autosize": true,
          "symbol": symbol,
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "zh_CN",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": true,
          "container_id": containerRef.current.id,
          "studies": [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "StochasticRSI@tv-basicstudies",
            "MASimple@tv-basicstudies",
            "MAExp@tv-basicstudies"
          ],
          "overrides": {
            "mainSeriesProperties.candleStyle.upColor": "#10b981",
            "mainSeriesProperties.candleStyle.downColor": "#f43f5e",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#111827",
            "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderDownColor": "#f43f5e",
            "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.wickDownColor": "#f43f5e",
          }
        });
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      // 脚本已存在，直接初始化，或在脚本加载后初始化
      if (window.TradingView) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initWidget);
      }
    };
  }, [token]);

  return (
    <div className="bg-gray-950/40 border border-gray-800 rounded-[3rem] p-6 lg:p-10 h-[750px] flex flex-col shadow-2xl relative overflow-hidden group backdrop-blur-xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 px-4">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center border-2 border-gray-800 shadow-xl p-1 shrink-0">
             <img 
               src={token.imageUrl || `https://ui-avatars.com/api/?name=${token.symbol}&background=111827&color=6366f1`} 
               className="w-full h-full rounded-full object-cover" 
               alt={token.symbol} 
             />
          </div>
          <div>
            <h3 className="text-2xl lg:text-3xl font-black flex items-center gap-4 text-white tracking-tighter">
              {token.symbol} <span className="text-gray-500">/ USDT</span>
              <span className="text-[10px] font-black bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-indigo-500/20">{token.chain} 网络</span>
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl lg:text-4xl font-mono font-black text-white tracking-tighter">
                ${token.price.toLocaleString(undefined, { maximumSignificantDigits: 8 })}
              </span>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-black shadow-lg ${token.priceChange24h >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">实时链上流动性</div>
          <div className="font-mono font-black text-gray-200 text-2xl tracking-tighter">${token.liquidity.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex-1 w-full rounded-[2rem] overflow-hidden border-2 border-gray-800 shadow-2xl bg-black relative">
        <div id={widgetId} ref={containerRef} className="w-full h-full" />
        <div className="absolute bottom-4 right-4 z-10 opacity-20 pointer-events-none">
           <span className="text-[10px] text-white font-black bg-black/50 px-2 py-1 rounded">TRADINGVIEW 高级终端</span>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none">
        <div className="text-[200px] font-black uppercase tracking-tighter text-white -rotate-12 whitespace-nowrap">AI 选币专家</div>
      </div>
    </div>
  );
};

export default TokenChart;
