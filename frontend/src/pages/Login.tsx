import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data.token, response.data.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex animate-fade-in">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 mb-24">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold tracking-tighter">E</div>
            <span className="font-bold text-xl tracking-tight">Ethara</span>
          </div>

          <h2 className="text-5xl font-normal leading-[1.0] tracking-[-0.03em] mb-3">Welcome Back.</h2>
          <p className="text-[#767d88] text-lg mb-10 tracking-tight">Sign in to orchestrate your creative projects.</p>

          {error && (
            <div className="bg-[#1a1a1a] border border-[#27272a] text-[#767d88] px-4 py-3 rounded-md mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4"
            >
              {loading ? 'Authenticating...' : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} /> Enter Workspace
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#27272a] text-sm text-[#767d88]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline decoration-[#27272a] underline-offset-4 transition-colors">
              Request access
            </Link>
          </div>
        </div>
      </div>

      {/* Right Cinematic Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <img 
          src="/kanban-illustration.png" 
          alt="Cinematic Kanban Board Illustration" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 hover:scale-105 transition-all duration-1000 ease-in-out"
        />
        <div className="absolute bottom-12 right-12 z-20 max-w-sm">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Creative Direction</p>
          <h3 className="text-2xl leading-[1.0] tracking-tight">We are building AI to simulate the world through imagination.</h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
