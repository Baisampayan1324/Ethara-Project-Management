import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedIllustration } from '../components/AnimatedIllustration';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      login(response.data.data.token, response.data.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const inputFocusVariants = {
    unfocused: { scale: 1 },
    focused: { scale: 1.02 },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-black to-slate-900 text-white flex overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Left Form Section */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
          {/* Logo / Brand */}
          <motion.div className="flex items-center gap-2 mb-24" variants={itemVariants}>
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-white to-slate-200 text-black flex items-center justify-center font-bold tracking-tighter rounded-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              E
            </motion.div>
            <span className="font-bold text-xl tracking-tight">Ethara</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl font-normal leading-[1.1] tracking-[-0.03em] mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Request Access.
            </h2>
          </motion.div>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-slate-400 text-lg mb-10 tracking-tight">
            Create your account to start orchestrating projects.
          </motion.p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/40 border border-red-800/60 backdrop-blur-sm text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Full Name
              </label>
              <motion.div
                variants={inputFocusVariants}
                animate={focusedField === 'name' ? 'focused' : 'unfocused'}
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 will-change-transform"
                />
              </motion.div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Email Address
              </label>
              <motion.div
                variants={inputFocusVariants}
                animate={focusedField === 'email' ? 'focused' : 'unfocused'}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 will-change-transform"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Password
              </label>
              <motion.div
                variants={inputFocusVariants}
                animate={focusedField === 'password' ? 'focused' : 'unfocused'}
              >
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 will-change-transform"
                />
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-white to-slate-200 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-white/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Workspace</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-white/10 text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-slate-200 transition-colors duration-200"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Illustration Section */}
      <motion.div
        className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />

        {/* Animated Illustration with Parallax */}
        <motion.div
          style={{
            perspective: 1000,
          }}
          animate={{
            rotateX: focusedField ? mousePosition.y * 5 : mousePosition.y * 8,
            rotateY: focusedField ? mousePosition.x * 5 : mousePosition.x * 8,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
          className="relative w-full h-full max-w-lg"
        >
          <AnimatedIllustration animationIntensity={focusedField ? 'low' : 'high'} />
        </motion.div>

        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default Signup;
