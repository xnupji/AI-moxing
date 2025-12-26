
import React, { useState } from 'react';
import { Search, Bell, Cpu, Settings, X } from 'lucide-react';
import { Chain } from '../types';
import { CHAIN_CONFIG } from '../constants';

interface HeaderProps {
  activeChain: Chain;
  setActiveChain: (chain: Chain) => void;
  onSearch: (q: string) => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeChain, setActiveChain, onSearch, onOpenSettings }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    // 实时触发搜索逻辑在 App.tsx 中有 debounce
    onSearch(val);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        {/* Logo 部分 */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => window.location.reload()}>
          <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 p-2.5 rounded-2xl transition-all group-hover:rotate-12 shadow-xl shadow-indigo-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter">
              AI 选币专家 PRO
            </h1>
            <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              秒级实时监测激活
            </div>
          </div>
        </div>

        {/* 搜索框：支持合约地址、项目名等 */}
        <div className="flex-1 max-w-2xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={searchValue}
            placeholder="搜索全网：合约地址、项目名称、代币代码或主流币..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white shadow-inner font-medium"
            onChange={handleSearchChange}
          />
          {searchValue && (
            <button 
              type="button" 
              onClick={clearSearch} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 链切换与操作区 */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden lg:flex bg-gray-950 border border-gray-800 rounded-2xl p-1.5 shadow-inner">
            {(Object.keys(CHAIN_CONFIG) as Chain[]).map((chain) => (
              <button
                key={chain}
                onClick={() => {
                  setActiveChain(chain);
                  // 切换链时清空搜索，展示该链的 Gems
                  if (searchValue) clearSearch();
                }}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest ${
                  activeChain === chain 
                    ? 'bg-indigo-600 text-white shadow-2xl' 
                    : 'text-gray-500 hover:text-white hover:bg-gray-900'
                }`}
              >
                {CHAIN_CONFIG[chain].icon}
                {CHAIN_CONFIG[chain].name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3.5 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all shadow-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-gray-950"></span>
            </button>
            
            <button 
              onClick={onOpenSettings} 
              className="p-3.5 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-indigo-500 transition-all shadow-xl group"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
