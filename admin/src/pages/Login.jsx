import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101C2C] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#D6AD60] selection:text-[#101C2C]">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6AD60_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-[#E5E0D6] space-y-6 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#101C2C] text-[#D6AD60] flex items-center justify-center font-serif font-black text-2xl mx-auto shadow-lg border border-[#D6AD60]/30">
            40
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#D6AD60] uppercase block">
              Greenwich University · Archival Portal
            </span>
            <h1 className="text-2xl font-serif font-black text-[#101C2C] tracking-tight mt-1">
              FORTY YEARS OF FEES
            </h1>
            <p className="text-xs text-[#788391] font-sans mt-1">
              Journey 40 Institutional Administration & Econometric Governance
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-[#C75A5A]/10 border border-[#C75A5A]/30 rounded-xl text-xs font-mono text-[#C75A5A] space-y-1">
            <span className="font-bold block">Authentication Failed</span>
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#788391] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greenwich.edu.pk"
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-10 pr-3.5 py-3 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#788391] uppercase font-mono">
                Operator Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#788391] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-10 pr-3.5 py-3 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] focus:ring-1 focus:ring-[#D6AD60] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer mt-2"
          >
            <span>{loading ? 'Authenticating Operator...' : 'Authenticate to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#D6AD60]" />
          </button>
        </form>

        {/* Security Disclosures */}
        <div className="pt-4 border-t border-[#E5E0D6] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#788391]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#23865B]" />
            <span>256-Bit Encrypted Archival Session</span>
          </div>
          <p className="text-[10px] text-[#788391] font-sans">
            Authorized Greenwich University administrative and research personnel only. All access attempts are recorded in the security audit ledger.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
