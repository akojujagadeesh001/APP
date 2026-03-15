import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { admin } from '../api';
import { Briefcase, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr || JSON.parse(userStr).role !== 'admin') {
      navigate('/');
      return;
    }
    
    admin.getStats()
      .then(res => setStats(res.data))
      .catch(console.error);
  }, [navigate]);

  if (!stats) return <div className="p-8 text-center text-gray-500">Loading admin statistics...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 bg-white min-h-screen">
      <div className="mb-10 pb-6 border-b border-[#F2F2F7]">
        <h1 className="text-4xl font-bold text-black tracking-tight">Admin Overview</h1>
        <p className="text-gray-500 mt-2 font-light">Monitor platform health and revenue streams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="apple-card p-6 flex items-center shadow-none bg-[#F9F9FB] border-transparent">
          <div className="bg-[#E0F0FE] p-4 rounded-xl mr-4">
            <Briefcase className="w-8 h-8 text-[#0071E3]" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalBookings}</div>
          </div>
        </div>
        
        <div className="apple-card p-6 flex items-center shadow-none bg-[#F9F9FB] border-transparent">
          <div className="bg-green-50 p-4 rounded-xl mr-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Completed Jobs</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.completedBookings}</div>
          </div>
        </div>

        <div className="apple-card p-6 flex items-center shadow-none bg-[#F9F9FB] border-transparent">
          <div className="bg-purple-50 p-4 rounded-xl mr-4">
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Gross Revenue</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">${stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="apple-card p-6 flex items-center shadow-none bg-[#F2F2F7] border-transparent">
          <div className="bg-white p-4 rounded-xl mr-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-[#0071E3]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Platform Fees (15%)</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">${stats.platformFees.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">System Status</h2>
        <p className="text-green-600 font-semibold flex items-center justify-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span> All systems operational
        </p>
      </div>
    </div>
  );
}
