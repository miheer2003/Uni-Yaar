import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, GraduationCap, Briefcase, Shield } from 'lucide-react';
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
        role: data.role as 'ROLE_STUDENT' | 'ROLE_FACULTY' | 'ROLE_STAFF' | 'ROLE_ADMIN',
      });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'ROLE_STUDENT', label: 'Student', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { value: 'ROLE_FACULTY', label: 'Faculty', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { value: 'ROLE_STAFF', label: 'Staff', icon: Shield, color: 'from-orange-500 to-red-500' },
    { value: 'ROLE_ADMIN', label: 'Admin', icon: Shield, color: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-6">
              <span className="text-slate-950 font-bold text-2xl">U</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 mt-2">Join UniYaar and discover your campus</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-danger-500/10 border border-danger-500/30 rounded-lg text-danger-400 text-sm mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    'w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    errors.fullName && 'border-danger-500 focus:ring-danger-500'
                  )}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-danger-400">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    'w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    errors.email && 'border-danger-500 focus:ring-danger-500'
                  )}
                  placeholder="you@university.edu"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-danger-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    'w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    errors.password && 'border-danger-500 focus:ring-danger-500'
                  )}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-danger-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    'w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    errors.confirmPassword && 'border-danger-500 focus:ring-danger-500'
                  )}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-danger-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Role
              </label>
              <div className="grid grid-cols-4 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('role', option.value, { shouldValidate: true })}
                      className={clsx(
                        'relative p-4 rounded-xl border-2 text-center transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950',
                        currentRole === option.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      )}
                    >
                      <div className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-1.5 text-sm text-danger-400">{errors.role.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={clsx(
                'w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-slate-950 font-semibold rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950',
                'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create account'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary-400 hover:underline">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
