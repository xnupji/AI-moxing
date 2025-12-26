
import React, { useState, useEffect, useRef } from 'react';
import { Chain, Token, Alert, AIAnalysis, PredictionResult, View, User } from './types';
import { fetchLatestGems, generateMockAlerts, searchTokens } from './services/dataService';
import { analyzeToken } from './services/geminiService';
import Header from './components/Header';
import AlertTable from './components/AlertTable';
import TokenChart from './components/TokenChart';
import AIPanel from './components/AIPanel';
import WhaleTracker from './components/WhaleTracker';
import MarketDiscovery from './components/MarketDiscovery';
import MainstreamCoins from './components/MainstreamCoins';
import MainstreamDetail from './components/MainstreamDetail';
import AdminPanel from './components/AdminPanel';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import { Activity, LayoutDashboard, Compass, TrendingUp, Star, ShieldCheck, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ai_gem_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeChain, setActiveChain] = useState<Chain>('solana');
  const [currentView, setCurrentView] = useState<View>('terminal');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [watchlist, setWatchlist] = useState<Token[]>(() => {
    const saved = localStorage.getItem('gem_selector_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. 自动加载对应链的数据
  useEffect(() => {
    if (!user) return;
    const loadChainData = async () => {
      // 如果正在执行搜索，则不覆盖当前结果
      if (searchQuery.trim().length >= 2) return;

      setIsSearching(true);
      try {
        const data = await fetchLatestGems(activeChain);
        if (data && data.length > 0) {
          setTokens(data);
          setAlerts(generateMockAlerts(data));
          // 默认选中第一个
          if (!selectedToken || selectedToken.chain !== activeChain) {
             handleSelectToken(data[0]);
          }
        }
      } catch (err) {
        console.error("加载数据流失败:", err);
      } finally {
        setIsSearching(false);
      }
    };

    loadChainData();
    const interval = setInterval(loadChainData, 60000); // 1分钟轮询一次
    return () => clearInterval(interval);
  }, [activeChain, user]);

  // 2. 核心搜索逻辑优化：解决黑屏 Bug
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      if (isSearching) setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchTokens(trimmedQuery);
        if (results && results.length > 0) {
          // 搜索成功后，更新列表并自动切换链属性以适配组件渲染
          setTokens(results);
          setAlerts(generateMockAlerts(results));
          
          const firstMatch = results[0];
          // 关键：如果搜索到的币在不同链，自动同步系统的 activeChain 状态
          if (firstMatch.chain !== activeChain) {
            setActiveChain(firstMatch.chain);
          }
          
          handleSelectToken(firstMatch);
          if (currentView !== 'terminal') setCurrentView('terminal');
        }
      } catch (err) {
        console.error("搜索组件异常:", err);
      } finally {
        setIsSearching(false);
      }
    }, 1200); // 增加抖动时间，确保输入稳定

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectToken = async (token: Token) => {
    if (!token) return;
    setSelectedToken(token);
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    setPrediction(null);
    try {
      const aiResult = await analyzeToken(token);
      setAnalysis(aiResult);
      setPrediction({
        current: token.price,
        predicted: token.price * (1 + (Math.random() * 0.3 - 0.1)),
        changePercent: (Math.random() * 30 - 10),
        confidence: 88,
        timeframe: '72h'
      });
    } catch (err) {
      console.error("AI 模块解析失败:", err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleLogin = (email: string, isAdmin: boolean) => {
    const newUser: User = { 
      email, isRegistered: true, isAdmin, 
      nickname: email.split('@')[0], 
      expiryDate: Date.now() + (365 * 24 * 60 * 60 * 1000) 
    };
    setUser(newUser);
    localStorage.setItem('ai_gem_user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.removeItem('ai_gem_user');
    setUser(null);
    window.location.reload();
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (currentView) {
      case 'terminal':
        return (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide max-w-[1500px] mx-auto w-full animate-in fade-in duration-500">
            {/* 上部：K线 + AI分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                {selectedToken ? (
                  <TokenChart token={selectedToken} />
                ) : (
                  <div className="h-[750px] bg-gray-900/20 border border-gray-800 rounded-[3rem] flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-gray-700 animate-spin" />
                  </div>
                )}
              </div>
              <div className="lg:col-span-4">
                {selectedToken && (
                  <AIPanel 
                    token={selectedToken} 
                    analysis={analysis} 
                    prediction={prediction} 
                    loading={isLoadingAnalysis}
                    isInWatchlist={watchlist.some(t => t.id === selectedToken.id)}
                    onToggleWatchlist={(t) => setWatchlist(prev => prev.some(it => it.id === t.id) ? prev.filter(it => it.id !== t.id) : [...prev, t])}
                  />
                )}
              </div>
            </div>

            {/* 下部：实时信号流列表 */}
            <div className="w-full">
              {isSearching ? (
                <div className="py-24 text-center bg-gray-900/10 border border-gray-800 rounded-[2.5rem] flex flex-col items-center gap-4">
                  <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">正在检索全球节点数据...</p>
                </div>
              ) : (
                <AlertTable 
                  alerts={alerts} 
                  onSelectToken={handleSelectToken} 
                  selectedId={selectedToken?.id} 
                />
              )}
            </div>
          </div>
        );
      case 'whale':
        return <div className="flex-1 overflow-y-auto p-8 h-full w-full max-w-[1500px] mx-auto"><WhaleTracker chain={activeChain} /></div>;
      case 'mainstream':
        return <div className="flex-1 overflow-y-auto p-8 h-full w-full max-w-[1500px] mx-auto"><MainstreamCoins onSelect={(t) => { handleSelectToken(t); setCurrentView('terminal'); }} /></div>;
      case 'admin':
        return <div className="flex-1 overflow-y-auto p-8 h-full w-full max-w-[1500px] mx-auto"><AdminPanel /></div>;
      case 'settings':
        return <div className="flex-1 overflow-y-auto p-8 h-full w-full max-w-[1500px] mx-auto"><SettingsView user={user} /></div>;
      default:
        return <div className="p-20 text-center opacity-20">正在同步模块...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col text-gray-200">
      <Header 
        activeChain={activeChain} 
        setActiveChain={setActiveChain} 
        onSearch={setSearchQuery} 
        onOpenSettings={() => setCurrentView('settings')}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航栏 */}
        <aside className="w-16 md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col py-8 shrink-0 shadow-2xl z-20">
          <nav className="flex-1 px-4 space-y-4">
            <NavItem icon={<LayoutDashboard />} label="Alpha 智能终端" active={currentView === 'terminal'} onClick={() => setCurrentView('terminal')} />
            <NavItem icon={<Activity />} label="毫秒级巨鲸追踪" active={currentView === 'whale'} onClick={() => setCurrentView('whale')} />
            <NavItem icon={<Star />} label="我的精选库" active={currentView === 'watchlist'} onClick={() => setCurrentView('terminal')} />
            <NavItem icon={<TrendingUp />} label="主流行情看板" active={currentView === 'mainstream'} onClick={() => setCurrentView('mainstream')} />
            <NavItem icon={<Compass />} label="市场深度发掘" active={currentView === 'discovery'} onClick={() => setCurrentView('discovery')} />
            
            <div className="pt-8 border-t border-gray-800 space-y-4">
              {user.isAdmin && <NavItem icon={<ShieldCheck className="text-indigo-400" />} label="超级管理后台" active={currentView === 'admin'} onClick={() => setCurrentView('admin')} />}
            </div>
          </nav>
          <div className="px-4 mt-auto">
            <button onClick={logout} className="w-full py-3 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-400 transition-all uppercase tracking-widest">
              退出系统
            </button>
          </div>
        </aside>

        {/* 内容区 */}
        {renderContent()}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}>
    <span className="w-5 h-5 shrink-0">{icon}</span>
    <span className="hidden md:block tracking-widest text-[11px] uppercase">{label}</span>
  </button>
);

const StatItem = ({ label, value, color }: any) => (
  <div className="flex justify-between items-center border-b border-gray-800/40 pb-5 last:border-0 last:pb-0">
    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{label}</span>
    <span className={`font-mono font-black text-lg tracking-tighter ${color}`}>{value}</span>
  </div>
);

export default App;
