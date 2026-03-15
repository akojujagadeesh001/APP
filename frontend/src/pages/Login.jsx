import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await auth.login(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full apple-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black tracking-tight">Welcome back.</h2>
          <p className="mt-3 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
              Sign up today
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50/50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Apple ID or Email</label>
            <input
              type="email"
              required
              className="apple-input"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Password</label>
            <input
              type="password"
              required
              className="apple-input"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-btn-primary mt-8 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        {/* Mock Accounts Helper */}
        <div className="mt-8 pt-6 border-t border-[#F2F2F7]">
          <p className="text-[10px] text-center font-semibold text-gray-400 mb-3 tracking-widest uppercase">Test Accounts</p>
          <div className="space-y-1 text-xs text-gray-500 flex flex-col items-center">
             <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mb-1">cassie@servenow.com | customer123</div>
             <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mb-1">pete@servenow.com | provider123</div>
             <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">admin@servenow.com | admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
