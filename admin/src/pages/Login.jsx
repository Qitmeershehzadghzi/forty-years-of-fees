import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState('qetmeer.dev@gmail.com');
  const [password, setPassword] = useState('Admin123!40Years');
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
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101C2C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6AD60_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 border border-[#E5E0D6] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#101C2C] text-[#D6AD60] flex items-center justify-center font-serif font-black text-2xl mx-auto shadow-md">
            40
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            FORTY YEARS OF FEES
          </h2>
          <p className="text-xs text-[#788391] font-mono uppercase tracking-wider">
            Greenwich University · Administration Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#C75A5A]/10 border border-[#C75A5A]/30 rounded-lg text-xs font-mono text-[#C75A5A]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#788391] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greenwich.edu.pk"
                className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#788391] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#F5F1E8] rounded-lg border border-[#E5E0D6] text-[11px] font-mono text-[#788391] space-y-0.5">
            <span className="font-semibold text-[#101C2C]">Default Super Admin Credentials:</span>
            <div>Email: <span className="text-[#101C2C]">qetmeer.dev@gmail.com</span></div>
            <div>Password: <span className="text-[#101C2C]">Admin123!40Years</span></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#D6AD60]" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E0D6] text-center text-[11px] text-[#788391] font-mono">
          <span>Role-Based Access Control · Journey 40 Security Architecture</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
