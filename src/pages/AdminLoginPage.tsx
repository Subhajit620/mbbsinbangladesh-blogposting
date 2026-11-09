import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, KeyRound, User, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setEnteredCaptcha('');
  };

  useEffect(() => {
    // If already authenticated, redirect straight to dashboard
    if (localStorage.getItem('admin_token') === 'aspiring_life_auth_token') {
      navigate('/admin/dashboard');
    } else {
      generateCaptcha();
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredCaptcha.toUpperCase() !== captchaCode.toUpperCase()) {
      toast.error('Invalid Verification Code (Captcha)! Please try again.', {
        style: {
          background: '#ef4444',
          color: '#ffffff',
          fontWeight: 'bold',
        },
      });
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_token', 'aspiring_life_auth_token');
        toast.success('Access Granted! Welcome Admin.', {
          icon: '🔑',
          style: {
            background: '#10b981',
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast.error('Invalid Credentials! Access Denied.', {
          style: {
            background: '#ef4444',
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });
        setIsLoading(false);
        generateCaptcha();
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      <Toaster position="top-right" />
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        {/* Header Block */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2">
            Enter your keys below to access the command cockpit.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-600 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-600 transition-all"
              />
            </div>
          </div>

          {/* Captcha Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verification Code (Captcha)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value)}
                placeholder="Enter Code"
                className="w-1/2 px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-600 transition-all uppercase"
              />
              
              {/* Captcha visual box */}
              <div className="w-1/2 flex items-center justify-between px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl select-none relative overflow-hidden">
                {/* Random lines effect behind text */}
                <div className="absolute inset-0 opacity-15 flex flex-col justify-around pointer-events-none">
                  <div className="h-[1px] bg-emerald-500 rotate-6 transform scale-150" />
                  <div className="h-[1px] bg-orange-500 -rotate-6 transform scale-150" />
                </div>
                <span className="text-emerald-400 font-extrabold tracking-widest text-base italic select-none transform skew-x-12 select-none relative z-10">
                  {captchaCode}
                </span>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-850 hover:bg-slate-800 rounded-lg transition cursor-pointer relative z-10"
                  title="Generate new code"
                >
                  ↻
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
            ) : (
              <>
                Open Session <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Back to Landing Page Button */}
        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            ← Back to Home
          </motion.button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-xs text-slate-500 border-t border-slate-800/60 pt-6">
          Authorized personnel only. Sessions are fully encrypted.
        </div>
      </motion.div>
    </div>
  );
}
