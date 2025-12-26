
import React, { useState, useEffect } from 'react';
import { InviteCode } from '../types';
import { Plus, Copy, Trash2, ShieldCheck, Clock, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [isLifetime, setIsLifetime] = useState(false);
  const [customDays, setCustomDays] = useState<number>(30);
  const [bindingCode, setBindingCode] = useState<string | null>(null);
  const [bindEmail, setBindEmail] = useState('');
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai_gem_invite_codes');
    if (saved) {
      setCodes(JSON.parse(saved));
    }
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveCodes = (updated: InviteCode[]) => {
    setCodes(updated);
    localStorage.setItem('ai_gem_invite_codes', JSON.stringify(updated));
  };

  const generateCode = () => {
    const newCode = 'GEM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = Date.now();
    let expiresAt: number | null = null;

    if (!isLifetime) {
      expiresAt = now + (customDays * 24 * 60 * 60 * 1000);
    }

    const updated: InviteCode[] = [
      ...codes, 
      { 
        code: newCode, 
        isUsed: false, 
        createdAt: now, 
        durationDays: isLifetime ? null : customDays,
        expiresAt 
      }
    ];
    saveCodes(updated);
    showToast("新授权码已成功生成");
  };

  const deleteCode = (codeToDelete: string) => {
    if (confirm(`确定要删除授权码 ${codeToDelete} 吗？此操作无法恢复。`)) {
      const updated = codes.filter(c => c.code !== codeToDelete);
      saveCodes(updated);
      showToast("授权码已成功删除");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("已成功复制到剪贴板");
    }).catch(() => {
      showToast("复制失败", "error");
    });
  };

  const handleManualBind = () => {
    if (!bindEmail.includes('@')) {
      showToast('请输入有效的邮箱地址', 'error');
      return;
    }
    const updated = codes.map(c => {
      if (c.code === bindingCode) {
        return { ...c, isUsed: true, usedBy: bindEmail, manualBound: true };
      }
      return c;
    });
    saveCodes(updated);
    setBindingCode(null);
    setBindEmail('');
    showToast("账户手动绑定成功");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-24">
      {toast && (
        <div className={`fixed top-28 left-1/2 -translate-x-1/2 z-[500] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-6 border backdrop-blur-xl ${
          toast.type === 'success' ? 'bg-emerald-600/90 border-emerald-500 text-white' : 'bg-rose-600/90 border-rose-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold tracking-tight">{toast.msg}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-indigo-600/5 border border-indigo-500/20 p-10 rounded-[3rem] gap-8 shadow-2xl backdrop-blur-md">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
            系统管理与授权中心
          </h2>
          <p className="text-gray-400 text-sm font-medium">生成灵活时长的授权码。点击代码一键复制，点击删除图标一键移除，点击“指定用户”手动激活账号。</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
          <div className="flex items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-3xl px-6 py-3 shadow-inner">
            <div className="flex items-center gap-3">
               <input 
                 type="checkbox" 
                 id="lifetime" 
                 checked={isLifetime} 
                 onChange={(e) => setIsLifetime(e.target.checked)}
                 className="accent-indigo-500 w-5 h-5 cursor-pointer"
               />
               <label htmlFor="lifetime" className="text-xs font-bold text-gray-400 uppercase cursor-pointer tracking-widest">终身授权</label>
            </div>
            <div className="w-px h-6 bg-gray-800"></div>
            {!isLifetime && (
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                  className="bg-transparent text-indigo-400 font-mono font-black w-16 focus:outline-none text-center text-lg"
                />
                <span className="text-xs text-gray-500 uppercase font-black">天数</span>
              </div>
            )}
          </div>
          <button 
            onClick={generateCode}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-6 h-6" />
            生成新授权码
          </button>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] text-gray-500 uppercase tracking-[0.25em] bg-gray-950/60 border-b border-gray-800">
              <tr>
                <th className="px-10 py-7 font-black">授权代码 (点击复制)</th>
                <th className="px-10 py-7 font-black text-center">时长配置</th>
                <th className="px-10 py-7 font-black">到期时间</th>
                <th className="px-10 py-7 font-black">使用状态</th>
                <th className="px-10 py-7 font-black">绑定用户</th>
                <th className="px-10 py-7 text-right font-black">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {codes.length === 0 ? (
                <tr><td colSpan={6} className="px-10 py-32 text-center text-gray-600 font-black uppercase tracking-[0.4em] italic opacity-20">暂无授权码记录</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.code} className="hover:bg-indigo-500/5 transition-all group">
                    <td className="px-10 py-7">
                      <button 
                        onClick={() => copyToClipboard(c.code)}
                        className="font-mono font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/code"
                        title="点击复制"
                      >
                        {c.code}
                        <Copy className="w-3.5 h-3.5 opacity-0 group-hover/code:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-300 font-black text-[11px] bg-gray-950/50 py-1.5 rounded-full border border-gray-800 px-4 w-fit mx-auto uppercase">
                        <Clock className="w-3.5 h-3.5 text-indigo-500/50" />
                        {c.durationDays ? `${c.durationDays} 天` : '终身'}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-gray-400 font-medium">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : <span className="text-emerald-500 font-black text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">永久有效</span>}
                    </td>
                    <td className="px-10 py-7">
                      <div className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.isUsed ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                        {c.isUsed ? '已绑定' : '可激活'}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-gray-400">
                      {c.usedBy ? (
                        <div className="flex items-center gap-2 font-mono text-[11px] truncate max-w-[180px]">
                          {c.usedBy}
                        </div>
                      ) : (
                        <button 
                          onClick={() => setBindingCode(c.code)}
                          className="text-[10px] text-indigo-400 hover:text-white hover:bg-indigo-600 font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-indigo-500/30 transition-all flex items-center gap-2"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> 指定用户
                        </button>
                      )}
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button 
                        onClick={() => deleteCode(c.code)} 
                        className="p-4 bg-gray-800/50 hover:bg-rose-900/50 text-gray-500 hover:text-rose-500 rounded-2xl transition-all active:scale-90"
                        title="点击删除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {bindingCode && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-gray-900 border border-gray-800 p-12 rounded-[4rem] w-full max-w-lg shadow-[0_0_100px_rgba(79,70,229,0.2)] animate-in fade-in zoom-in">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-3xl font-black text-white flex items-center gap-5 tracking-tighter">
                 <UserPlus className="w-10 h-10 text-indigo-400" />
                 手动绑定激活账号
               </h3>
               <button onClick={() => setBindingCode(null)} className="p-4 hover:bg-gray-800 rounded-full transition-colors"><X className="w-8 h-8 text-gray-500" /></button>
            </div>
            <div className="space-y-8">
               <div className="p-6 bg-gray-950 rounded-[2rem] border border-gray-800 shadow-inner">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">授权码</label>
                  <div className="mt-3 text-2xl font-mono font-black text-indigo-400">{bindingCode}</div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">用户邮箱地址</label>
                  <input 
                    type="email" 
                    placeholder="请输入用户邮箱"
                    value={bindEmail}
                    onChange={(e) => setBindEmail(e.target.value)}
                    className="w-full bg-gray-950 border-2 border-gray-800 rounded-[1.5rem] px-8 py-5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                  />
               </div>
               <button 
                 onClick={handleManualBind}
                 className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all"
               >
                 立即完成绑定激活
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
