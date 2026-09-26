import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, GraduationCap, Briefcase, Shield, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>({
    defaultValues: { role: 'ROLE_STUDENT' },
  });

  const password = watch('password');
  const currentRole = watch('role');

  const onSubmit = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    setIsLoading(true);
    setError('');
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role as 'ROLE_STUDENT' | 'ROLE_FACULTY' | 'ROLE_FOOD_STAFF' | 'ROLE_ADMIN',
      });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'ROLE_STUDENT', label: 'Student', icon: GraduationCap, color: 'bg-[#776BFD]' },
    { value: 'ROLE_FACULTY', label: 'Faculty', icon: Briefcase, color: 'bg-[#807493]' },
    { value: 'ROLE_FOOD_STAFF', label: 'Food Staff', icon: UtensilsCrossed, color: 'bg-[#F86B7E]' },
    { value: 'ROLE_ADMIN', label: 'Admin', icon: Shield, color: 'bg-[#18181B]' },
  ];

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
            <h1 className="text-3xl font-black text-[#18181B] tracking-tight">Create your account</h1>
            <p className="text-[#636363] mt-2 font-medium">Join UniYaar and discover your campus</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636363]" />
                <input
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Name must not exceed 255 characters',
                    },
                  })}
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  className={clsx(
                    'w-full pl-11 pr-4 py-3 bg-white border border-[#DFDFE0] rounded-2xl text-[#18181B] placeholder-[#636363]/60',
                    'focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD]',
                    'transition-all duration-200 shadow-2xs',
                    errors.fullName && 'border-[#F86B7E] focus:ring-[#F86B7E]/20'
                  )}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs font-bold text-[#EE495F]">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1.5">
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
              <label htmlFor="password" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1.5">
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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636363]" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value: string) => value === password || 'Passwords do not match',
                  })}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={clsx(
                    'w-full pl-11 pr-4 py-3 bg-white border border-[#DFDFE0] rounded-2xl text-[#18181B] placeholder-[#636363]/60',
                    'focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD]',
                    'transition-all duration-200 shadow-2xs',
                    errors.confirmPassword && 'border-[#F86B7E] focus:ring-[#F86B7E]/20'
                  )}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-bold text-[#EE495F]">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-2">
                Select Campus Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('role', option.value, { shouldValidate: true })}
                      className={clsx(
                        'relative p-3 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer',
                        currentRole === option.value
                          ? 'border-[#776BFD] bg-[#776BFD]/10 shadow-sm'
                          : 'border-[#DFDFE0] bg-white hover:border-[#B6ADC3]'
                      )}
                    >
                      <div className={`w-8 h-8 mx-auto mb-1.5 ${option.color} rounded-xl flex items-center justify-center text-white shadow-2xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#18181B]">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs font-bold text-[#EE495F]">{errors.role.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#776BFD] hover:bg-[#6455F5] text-white font-bold rounded-2xl shadow-md shadow-[#776BFD]/25 transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-[#636363]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#776BFD] hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#636363]">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-[#776BFD] hover:underline font-semibold">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-[#776BFD] hover:underline font-semibold">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
