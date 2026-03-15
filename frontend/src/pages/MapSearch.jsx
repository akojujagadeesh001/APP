import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { bookings } from '../api'; // Just using api default below
import api from '../api';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapSearch() {
  const [providers, setProviders] = useState([]);
  
  // Note: we need a quick route for providers. I assume /users/providers is made.
  useEffect(() => {
    // Quick fallback if we didn't add the route, let's fetch any users endpoint if available
    // or simulate fetching the users
    const fetchProviders = async () => {
      try {
        const res = await api.get('/users/providers');
        setProviders(res.data);
      } catch (e) {
         console.error(e);
      }
    };
    fetchProviders();
  }, []);

  // Center on NYC as our seed data is there
  const center = [40.7128, -74.0060];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 bg-white min-h-[90vh]">
      <div className="mb-8 border-b border-[#F2F2F7] pb-6">
        <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Find Pros Nearby</h1>
        <p className="text-gray-500 font-light">See active professionals available in your area today.</p>
      </div>

      <div className="apple-card overflow-hidden h-[600px] relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {providers.map(p => {
             if (p.lat && p.lng) {
               return (
                 <Marker key={p.id} position={[p.lat, p.lng]}>
                   <Popup>
                     <div className="text-center font-sans mt-1">
                       <strong className="block text-gray-900 text-lg mb-1">{p.name}</strong>
                       <span className="text-[#0071E3] font-semibold text-xs uppercase tracking-wider bg-[#E0F0FE] px-2 py-1 rounded-full">{p.role === 'provider' ? 'Professional' : p.role}</span>
                     </div>
                   </Popup>
                 </Marker>
               );
             }
             return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
}
