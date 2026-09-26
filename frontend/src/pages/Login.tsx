import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string; rememberMe: boolean }>({ defaultValues: { rememberMe: false } });

  const onSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DFDFE0] text-[#18181B] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-8 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#776BFD] to-[#F86B7E] rounded-2xl mb-6 shadow-md shadow-[#776BFD]/20">
              <span className="text-white font-black text-2xl">U</span>
            </Link>
            <h1 className="text-3xl font-black text-[#18181B] tracking-tight">Welcome back</h1>
            <p className="text-[#636363] mt-2 font-medium">Sign in to your UniYaar account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3.5 bg-[#F86B7E]/10 border border-[#F86B7E]/30 rounded-2xl text-[#EE495F] text-sm mb-6 font-semibold"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#F86B7E]" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636363]" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={clsx(
                    'w-full pl-11 pr-4 py-3 bg-white border border-[#DFDFE0] rounded-2xl text-[#18181B] placeholder-[#636363]/60',
                    'focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD]',
                    'transition-all duration-200 shadow-2xs',
                    errors.email && 'border-[#F86B7E] focus:ring-[#F86B7E]/20'
                  )}
                  placeholder="you@university.edu"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-bold text-[#EE495F]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636363]" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={clsx(
                    'w-full pl-11 pr-12 py-3 bg-white border border-[#DFDFE0] rounded-2xl text-[#18181B] placeholder-[#636363]/60',
                    'focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD]',
                    'transition-all duration-200 shadow-2xs',
                    errors.password && 'border-[#F86B7E] focus:ring-[#F86B7E]/20'
                  )}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#636363] hover:text-[#18181B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-[#776BFD]" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-bold text-[#EE495F]">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs font-semibold text-[#636363] cursor-pointer">
                <input {...register('rememberMe')} type="checkbox" className="w-4 h-4 rounded-md border-[#DFDFE0] text-[#776BFD] focus:ring-[#776BFD]" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#776BFD] hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#776BFD] hover:bg-[#6455F5] text-white font-bold rounded-2xl shadow-md shadow-[#776BFD]/25 transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-[#636363]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#776BFD] hover:underline font-bold">
                Signup
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#636363]">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-[#776BFD] hover:underline font-semibold">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-[#776BFD] hover:underline font-semibold">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
