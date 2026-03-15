import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await auth.register(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full apple-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black tracking-tight">Create your ID.</h2>
          <p className="mt-3 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
              Sign in
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Full Name</label>
            <input
              type="text"
              required
              className="apple-input"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Email address</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer border py-3 px-2 rounded-xl text-center transition-all duration-200 ${formData.role === 'customer' ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'bg-[#F2F2F7] border-transparent text-gray-700 hover:bg-[#E5E5EA]'}`}>
                <input type="radio" className="hidden" name="role" value="customer" checked={formData.role === 'customer'} onChange={() => setFormData({...formData, role: 'customer'})} />
                <span className="font-semibold text-sm">Customer</span>
              </label>
              <label className={`cursor-pointer border py-3 px-2 rounded-xl text-center transition-all duration-200 ${formData.role === 'provider' ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'bg-[#F2F2F7] border-transparent text-gray-700 hover:bg-[#E5E5EA]'}`}>
                <input type="radio" className="hidden" name="role" value="provider" checked={formData.role === 'provider'} onChange={() => setFormData({...formData, role: 'provider'})} />
                <span className="font-semibold text-sm">Service Provider</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-btn-primary mt-8 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
