import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../api';
import { Calendar, MapPin, Clock, DollarSign, CheckCircle, Navigation, MessageCircle } from 'lucide-react';
import LiveChat from '../components/LiveChat';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [activeChat, setActiveChat] = useState(null);

  const fetchJobs = () => {
    bookings.getAll().then(res => setJobs(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchJobs();
  }, [navigate]);

  const handleAction = async (id, action) => {
    try {
      await bookings.update(id, { action });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const myJobs = jobs.filter(j => j.status === 'accepted');
  const availableJobs = jobs.filter(j => j.status === 'pending');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  // Provider gets 85% of total (15% platform fee)
  const earnings = completedJobs.reduce((acc, job) => acc + (job.final_price * 0.85), 0);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-[#F2F2F7] gap-6">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight">Provider Hub</h1>
          <p className="text-gray-500 mt-2 font-light">Manage your active jobs and find new opportunities.</p>
        </div>
        
        <div className="apple-card px-6 py-4 flex items-center shadow-none bg-[#F2F2F7] border-transparent">
          <div className="bg-white p-2.5 rounded-xl mr-4 shadow-sm">
            <DollarSign className="w-6 h-6 text-[#0071E3]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Net Earnings</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">${earnings.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Active Jobs Pipeline */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-[#0071E3]" /> My Active Jobs 
            <span className="ml-3 bg-[#E0F0FE] text-[#0071E3] text-xs px-2.5 py-1 rounded-full font-bold">{myJobs.length}</span>
          </h2>
          
          <div className="space-y-4">
            {myJobs.length === 0 ? (
              <p className="text-gray-400 italic text-center py-10 bg-[#F2F2F7] rounded-2xl">No active jobs. Accept a job from the available list.</p>
            ) : myJobs.map(job => (
              <div key={job.id}>
                <div className="apple-card p-6 border-l-4 border-l-[#0071E3]">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 tracking-tight">{job.service_name}</h3>
                    <div className="font-semibold text-gray-900">${job.final_price}</div>
                  </div>
                  <div className="text-sm text-gray-500 space-y-2 mb-6">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-60"/> {job.date} • {job.time}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-60"/> {job.address}</p>
                    <p className="flex items-center pt-3 mt-3 border-t border-[#F2F2F7] text-gray-700">Client: <strong className="ml-1 text-gray-900">{job.customer_name}</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveChat(activeChat === job.id ? null : job.id)}
                      className="flex-1 apple-btn bg-white border border-[#E5E5EA] text-gray-900 hover:bg-[#F2F2F7] flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> Chat
                    </button>
                    <button 
                      onClick={() => handleAction(job.id, 'complete')}
                      className="flex-[2] apple-btn bg-gray-900 text-white hover:bg-black"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
                {activeChat === job.id && (
                  <div className="mt-4 h-80 border-t border-[#F2F2F7] pt-4">
                    <LiveChat bookingId={job.id} currentUser={user.name} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Market */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-gray-900" /> Available Jobs
            <span className="ml-3 bg-[#F2F2F7] text-gray-900 text-xs px-2.5 py-1 rounded-full font-bold">{availableJobs.length}</span>
          </h2>
          
          <div className="space-y-4">
            {availableJobs.length === 0 ? (
              <p className="text-gray-400 italic text-center py-10 bg-[#F2F2F7] rounded-2xl">No new jobs available in your area right now.</p>
            ) : availableJobs.map(job => (
              <div key={job.id} className="apple-card p-6 bg-[#F9F9FB] hover:bg-white transition-colors duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 tracking-tight">{job.service_name}</h3>
                  <div className="font-semibold text-gray-900">${job.final_price}</div>
                </div>
                <div className="text-sm text-gray-500 space-y-2 mb-6">
                  <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-60"/> {job.address}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-60"/> {job.date} • {job.time}</p>
                </div>
                <button 
                  onClick={() => handleAction(job.id, 'accept')}
                  className="w-full apple-btn-primary"
                >
                  Accept Job • Earn ${(job.final_price * 0.85).toFixed(2)}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
