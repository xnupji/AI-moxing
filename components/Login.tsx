
import React, { useState } from 'react';
import { Cpu, Mail, Key, ShieldCheck, AlertTriangle } from 'lucide-react';
import { InviteCode } from '../types';

interface LoginProps {
  onLogin: (email: string, isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // Admin email check
    const isAdmin = email === 'snup93@outlook.com';
    const MASTER_ADMIN_CODE = "ADMIN_MASTER_2025";

    if (isAdmin && inviteCode === MASTER_ADMIN_CODE) {
      onLogin(email, true);
      return;
    }

    // Normal User Check
    const savedCodes = localStorage.getItem('ai_gem_invite_codes');
    const codes: InviteCode[] = savedCodes ? JSON.parse(savedCodes) : [
      { 
        code: 'AI_GEM_2025', 
        isUsed: false, 
        createdAt: Date.now(),
        duration: 'LIFETIME',
        expiresAt: null
      }
    ];

    const foundCode = codes.find(c => c.code === inviteCode);

    if (!foundCode) {
      setError('邀请码无效。请通过官方渠道购买或获取邀请码。');
      return;
    }

    // Check expiration before use
    if (foundCode.expiresAt && Date.now() > foundCode.expiresAt) {
      setError('该邀请码已过期，无法继续使用。请联系管理员续费。');
      return;
    }

    if (foundCode.isUsed && foundCode.usedBy !== email && !isAdmin) {
      setError('该邀请码已被其他用户使用。每个邀请码仅限单一账号。');
      return;
    }

    // Mark code as used if it's the first time
    if (!isAdmin && !foundCode.isUsed) {
      const updatedCodes = codes.map(c => 
        c.code === inviteCode ? { ...c, isUsed: true, usedBy: email } : c
      );
      localStorage.setItem('ai_gem_invite_codes', JSON.stringify(updatedCodes));
    }

    onLogin(email, isAdmin);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 p-4 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 text-center uppercase tracking-tighter">AI 选币专家 PRO</h1>
          <p className="text-gray-400 text-sm text-center px-4">全球顶级 AI 驱动的多链选币与巨鲸动态捕捉系统</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">注册邮箱</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">专属邀请码 (一年/两年/终身)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                placeholder="输入您的专属激活码"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] p-4 rounded-xl text-center animate-pulse font-medium flex items-center gap-2 justify-center">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            立即解锁系统权限
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">端到端加密 & 实时链上监控</span>
          </div>
          <p className="text-[9px] text-gray-600 mt-2 text-center leading-relaxed">
            如果您没有邀请码，请联系官方管理员购买授权。<br/>
            支持授权时长：1年 / 2年 / 终身永久授权。<br/>
            管理员邮箱: snup93@outlook.com
          </p>
        </div>
      </div>
      
      <div className="fixed bottom-6 flex flex-col items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">
        <div>管理员测试登录: snup93@outlook.com / ADMIN_MASTER_2025</div>
        <div>普通测试码 (终身): AI_GEM_2025</div>
      </div>
    </div>
  );
};

export default Login;
