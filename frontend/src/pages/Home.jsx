import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../api';
import { ShieldCheck, Star, Clock, Home as HomeIcon, Zap, Droplet, Wrench } from 'lucide-react';

const iconMap = {
  'Cleaning': <HomeIcon className="h-10 w-10 text-primary-500" />,
  'Electrical': <Zap className="h-10 w-10 text-primary-500" />,
  'Plumbing': <Droplet className="h-10 w-10 text-primary-500" />,
  'Handyman': <Wrench className="h-10 w-10 text-primary-500" />,
};

export default function Home() {
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    services.getAll()
      .then(res => setServiceList(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-full">
      {/* Hero Section */}
      <div className="bg-[#F2F2F7] text-gray-900 py-24 px-4 mt-[-4rem] pt-36">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
            Home Services. <br/> <span className="text-primary-600">Simplified.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-light">
            Book trusted local professionals for cleaning, plumbing, electrical, and handyman tasks instantly.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white">
        <div className="p-6">
          <ShieldCheck className="h-10 w-10 text-gray-900 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2">Verified Pros</h3>
          <p className="text-gray-500 text-sm">All our service professionals are rigorously vetted and background checked.</p>
        </div>
        <div className="p-6">
          <Clock className="h-10 w-10 text-gray-900 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2">Instant Booking</h3>
          <p className="text-gray-500 text-sm">Pick a time that works for you and get instant confirmation.</p>
        </div>
        <div className="p-6">
          <Star className="h-10 w-10 text-gray-900 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
          <p className="text-gray-500 text-sm">Your satisfaction is guaranteed with our trusted rating system.</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 mb-20 w-full" id="services">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 tracking-tight">What do you need help with?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map(service => (
            <Link 
              to={`/book/${service.id}`} 
              key={service.id}
              className="group apple-card p-6 flex flex-col items-center text-center hover:scale-[1.02] transform transition-transform"
            >
              <div className="mb-6 mt-4">
                {iconMap[service.category] || <Wrench className="h-10 w-10 text-primary-600" strokeWidth={1.5} />}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{service.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">{service.description}</p>
              <div className="mt-auto px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-full text-sm w-full">
                From ${service.price_estimate}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
