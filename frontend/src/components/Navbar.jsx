import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, Wrench } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b flex border-[#F2F2F7] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary-600" />
            <span className="font-semibold text-xl text-gray-900 tracking-tight">ServeNow</span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link to="/map" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3">
              Explore Pros
            </Link>
            {token ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="apple-btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="apple-btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
