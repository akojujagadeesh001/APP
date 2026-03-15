import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services, bookings } from '../api';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';

export default function BookingFlow() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', address: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'customer') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    services.getAll().then(res => {
      const found = res.data.find(s => s.id === parseInt(serviceId));
      if (found) setService(found);
      else navigate('/');
    }).catch(() => navigate('/'));
  }, [serviceId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await bookings.create({ service_id: serviceId, ...formData });
      navigate(`/payment/${resp.data.id || resp.data.bookingId || resp.data.booking?.id}`); // Adjust this based on backend return
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
      setLoading(false);
    }
  };

  if (!service) return <div className="p-8 text-center text-gray-500">Loading service details...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 bg-white min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-black tracking-tight mb-3">Book {service.name}</h1>
        <p className="text-gray-500 text-lg font-light max-w-xl mx-auto">
          {service.description}
        </p>
      </div>

      <div className="apple-card p-8">
        <div className="mb-8 flex justify-between items-center pb-6 border-b border-[#F2F2F7]">
          <h2 className="text-2xl font-semibold tracking-tight">Job Details</h2>
          <div className="bg-[#E0F0FE] text-[#0071E3] px-4 py-1.5 rounded-full font-bold">
            ${service.price_estimate} Est.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50/50 text-red-600 p-4 rounded-xl mb-8 text-sm text-center border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" /> Preferred Date
              </label>
              <input type="date" required min={new Date().toISOString().split('T')[0]}
                className="apple-input"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> Preferred Time
              </label>
              <select required className="apple-input bg-[#F2F2F7]" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                <option value="">Select a time slot</option>
                <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> Service Address
            </label>
            <textarea required rows="2" placeholder="123 Main St, Apt 4B, City, State ZIP"
              className="apple-input resize-none"
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 pl-1 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-gray-400" /> Job Details (Optional)
            </label>
            <textarea rows="3" placeholder="Describe the issue or any special instructions for the professional..."
              className="apple-input resize-none"
              value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-6 mt-6 border-t border-[#F2F2F7]">
            <button type="submit" disabled={loading} className="w-full apple-btn-primary py-4 text-lg disabled:opacity-50">
              {loading ? 'Processing...' : `Confirm Booking • $${service.price_estimate}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 px-8">
              By confirming, you agree to ServeNow's terms of service. You will not be charged until the job is completed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
