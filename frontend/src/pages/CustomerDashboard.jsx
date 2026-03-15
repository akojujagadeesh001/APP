import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../api';
import { Calendar, MapPin, Clock, CheckCircle2, Star, MessageCircle } from 'lucide-react';
import LiveChat from '../components/LiveChat';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [bookingList, setBookingList] = useState([]);
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [activeChat, setActiveChat] = useState(null);

  const fetchBookings = () => {
    bookings.getAll().then(res => setBookingList(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const handleRate = async (id, rating) => {
    try {
      await bookings.update(id, { action: 'rate', rating });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="bg-[#F2F2F7] text-gray-700 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">Finding Pro</span>
      case 'accepted': return <span className="bg-[#E0F0FE] text-[#0071E3] px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">In Progress</span>
      case 'completed': return <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">Completed</span>
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 bg-white">
      <h1 className="text-4xl font-bold mb-10 text-black tracking-tight border-b border-[#F2F2F7] pb-6">My Bookings</h1>
      
      {bookingList.length === 0 ? (
        <div className="text-center py-20 apple-card">
          <p className="text-gray-500 mb-6 text-lg">You haven't booked any services yet.</p>
          <button onClick={() => navigate('/#services')} className="apple-btn-primary inline-flex">
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookingList.map(b => (
            <div key={b.id}>
              <div className="apple-card p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{b.service_name}</h3>
                    {getStatusBadge(b.status)}
                  </div>
                  
                  <div className="text-gray-600 text-sm space-y-2">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" /> {b.date}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400" /> {b.time}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> {b.address}</p>
                    {b.provider_name && <p className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#0071E3]" /> Professional: <strong className="ml-1 text-gray-900">{b.provider_name}</strong></p>}
                  </div>
                  
                  {b.details && (
                    <div className="bg-[#F2F2F7] p-4 rounded-xl text-sm text-gray-700 mt-4">
                      <span className="font-semibold block mb-1">Details:</span> {b.details}
                    </div>
                  )}
                </div>
                
                <div className="md:w-56 flex flex-col justify-between border-t border-[#F2F2F7] md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                  <div className="text-left md:text-right w-full">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Cost</div>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">${b.final_price}</div>
                  </div>
                  
                  {b.status === 'completed' && !b.rating && (
                    <div className="w-full mt-6 md:mt-auto">
                      <p className="text-xs font-semibold text-gray-500 mb-2 md:text-right uppercase tracking-wider">Rate Provider</p>
                      <div className="flex gap-1 md:justify-end">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => handleRate(b.id, star)} className="text-[#D1D1D6] hover:text-[#0071E3] transition-colors focus:outline-none">
                            <Star className="w-7 h-7 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {b.rating && (
                    <div className="w-full mt-6 md:mt-auto flex md:justify-end">
                      <div className="inline-flex items-center bg-[#F2F2F7] px-4 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-[#0071E3] fill-current mr-1.5" />
                        <span className="font-bold text-gray-900 text-sm">{b.rating} / 5</span>
                      </div>
                    </div>
                  )}
                  
                  {b.status === 'accepted' && (
                    <div className="w-full mt-6 flex md:justify-end">
                       <button onClick={() => setActiveChat(activeChat === b.id ? null : b.id)} className="apple-btn-secondary w-full md:w-auto shadow-sm flex items-center justify-center">
                         <MessageCircle className="w-4 h-4 mr-2" /> {activeChat === b.id ? 'Close Chat' : 'Message Pro'}
                       </button>
                    </div>
                  )}
                </div>
              </div>
              {activeChat === b.id && (
                <div className="apple-card p-0 mt-4 h-96 w-full max-w-lg mx-auto md:ml-auto md:mr-0 border border-[#0071E3]/20 shadow-md">
                  <LiveChat bookingId={b.id} currentUser={user.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
