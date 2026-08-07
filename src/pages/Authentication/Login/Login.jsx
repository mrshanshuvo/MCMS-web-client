import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const axiosInstance = useAxios();

  const updateLastLogin = async (email) => {
    if (!email) return;
    try {
      await axiosInstance.patch(`/users/${email}`, {
        last_login: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last_login:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await signInUser(data.email, data.password);
      const user = userCredential.user;

      toast.success(`Welcome back, ${user.displayName || 'participant'}!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      await updateLastLogin(user?.email);

      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password. Please try again.'
          : error.code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please try again later.'
            : error.code === 'auth/user-disabled'
              ? 'This account has been disabled. Please contact support.'
              : 'Login failed. Please check your credentials.';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      toast.success(`Welcome, ${user.displayName || 'participant'}!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      const idToken = await user.getIdToken();

      const userInfoDB = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'participant',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      try {
        await axiosInstance.post('/users', userInfoDB, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 409 || status === 400) {
          await updateLastLogin(user?.email);
        } else {
          console.error('Error saving user:', err);
          toast.error('Error saving user info. Please try again.', {
            position: 'top-right',
          });
        }
      }

      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled. Please try again.'
          : error.code === 'auth/popup-blocked'
            ? 'Pop-up was blocked. Please allow pop-ups for this site.'
            : 'Google sign-in failed. Please try again.';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Google sign-in error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-600 mt-2 text-sm">
              Sign in to access your medical camp dashboard
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setValue('email', 'participant@carecamp.com');
                setValue('password', 'Password123!');
                toast.success('Demo Participant credentials filled!');
              }}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
            >
              Demo Participant
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'organizer@carecamp.com');
                setValue('password', 'Password123!');
                toast.success('Demo Organizer credentials filled!');
              }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
            >
              Demo Organizer
            </button>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isGoogleLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">Or sign in with email</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400`}
                placeholder="you@example.com"
                disabled={isLoading || isGoogleLoading}
              />
              {errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`block w-full pl-10 pr-12 py-3 border ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-colors bg-white text-gray-900 placeholder-gray-400`}
                placeholder="Enter your password"
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                disabled={isLoading || isGoogleLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                disabled={isLoading || isGoogleLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              state={{ from }}
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <p className="text-center text-xs text-gray-500 mt-6 px-4">
        By signing in, you agree to our{' '}
        <Link to="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default Login;
