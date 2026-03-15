import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingFlow from './pages/BookingFlow';
import PaymentPage from './pages/PaymentPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MapSearch from './pages/MapSearch';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Toaster position="top-center" toastOptions={{ className: 'apple-card text-sm font-semibold' }} />
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book/:serviceId" element={<BookingFlow />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/map" element={<MapSearch />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
