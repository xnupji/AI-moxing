
import React, { useState } from 'react';
import { Shield, Lock, Share2, Mail, UserCircle, Gift, Copy, CheckCircle, Clock } from 'lucide-react';

interface SettingsViewProps {
  user: any;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [nickname, setNickname] = useState(user.nickname || '首席投研员');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(user.email)}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralBonus = (user.referralCount || 0) * 10;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <UserCircle className="w-64 h-64" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-500/30 text-white font-black rotate-3">
            {nickname[0]}
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">{nickname}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-400 text-sm">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                <Mail className="w-4 h-4 text-indigo-400" />
                {user.email}
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.isAdmin ? 'bg-indigo-600 text-white' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'}`}>
                {user.isAdmin ? '顶级管理员' : 'PRO 会员'}
              </span>
            </div>
            {user.expiryDate && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold text-xs mt-2">
                <Clock className="w-4 h-4" />
                授权到期时间: {new Date(user.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white">
            <Lock className="w-5 h-5 text-indigo-400" />
            安全凭证管理
          </h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">当前密码验证</label>
              <input type="password" placeholder="••••••••" className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">设定新密码</label>
              <input type="password" placeholder="请输入新密码" className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white" />
            </div>
            <button className="w-full py-4 bg-gray-800 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95">
              立即更新密码
            </button>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white">
            <Share2 className="w-5 h-5 text-emerald-400" />
            全民邀约奖励机制
          </h3>
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-5">
            <div className="space-y-2">
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                每成功邀约一位好友购买授权并激活，您的账号将<span className="text-emerald-400 font-bold italic">自动延长 10 天</span>有效期。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-[10px] text-indigo-400 font-mono truncate">
                {window.location.origin}?ref={user.email}
              </div>
              <button onClick={handleCopy} className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-90">
                {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">累计成功邀约</span>
                <span className="text-2xl font-black text-emerald-400">{user.referralCount || 0} 人</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">已获赠时长</span>
                <span className="text-2xl font-black text-indigo-400">{referralBonus} 天</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-10">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-8">
          <Shield className="w-6 h-6 text-amber-400" />
          系统邀约细则
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
           <Step icon="1" title="获取专属链接" desc="复制上方您的个人专属邀约链接并发送给好友或社区。" />
           <Step icon="2" title="好友成功激活" desc="好友通过链接注册并使用任意授权码（除测试码外）完成激活。" />
           <Step icon="3" title="自动到账奖励" desc="系统核对无误后将立即在您的到期时间上顺延 10 天，不设上限。" />
        </div>
      </div>
    </div>
  );
};

const Step = ({ icon, title, desc }: any) => (
  <div className="space-y-4 p-8 bg-gray-950 border border-gray-800 rounded-3xl hover:border-indigo-500/30 transition-all group">
    <div className="w-10 h-10 rounded-2xl bg-gray-800 group-hover:bg-indigo-600 flex items-center justify-center text-sm font-black text-gray-400 group-hover:text-white border border-gray-700 group-hover:border-indigo-500 transition-all rotate-3 group-hover:rotate-0">{icon}</div>
    <h4 className="text-md font-bold text-gray-200">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default SettingsView;
