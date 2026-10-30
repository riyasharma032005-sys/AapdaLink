import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      // Route based on role
      switch (user.role) {
        case 'citizen':
          navigate('/citizen/dashboard');
          break;
        case 'volunteer':
          navigate('/volunteer/dashboard');
          break;
        case 'ngo':
          navigate('/ngo/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-red-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to AapdaLink</h2>
          <p className="text-xs text-slate-500">Access emergency response dispatch & coordination</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Test Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('aarav@gmail.com')}
              className="p-2 text-left bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition"
            >
              <div className="font-bold text-slate-800">👤 Citizen</div>
              <div className="text-[10px] text-slate-500 truncate">aarav@gmail.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('rohan@volunteer.org')}
              className="p-2 text-left bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition"
            >
              <div className="font-bold text-slate-800">🦺 Volunteer</div>
              <div className="text-[10px] text-slate-500 truncate">rohan@volunteer.org</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('contact@sevarelief.org')}
              className="p-2 text-left bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition"
            >
              <div className="font-bold text-slate-800">🏢 NGO Aid</div>
              <div className="text-[10px] text-slate-500 truncate">contact@sevarelief.org</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@aapdalink.org')}
              className="p-2 text-left bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition"
            >
              <div className="font-bold text-slate-800">🛠️ Admin</div>
              <div className="text-[10px] text-slate-500 truncate">admin@aapdalink.org</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-red-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
