import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const axiosInstance = useAxios();

  const updateLastLogin = async (email) => {
    if (!email) return;
    try {
      await axiosInstance.patch(`/users/${email}`, {
        last_login: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating last_login:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInUser(data.email, data.password);
      const user = userCredential.user;

      toast.success(`Welcome to MCMS, ${user.displayName || "participant"}!`);
      await updateLastLogin(user?.email);

      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed: " + error.message);
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      toast.success(`Welcome to MCMS, ${user.displayName || "participant"}!`);

      const idToken = await user.getIdToken();

      const userInfoDB = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: "participant",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      try {
        // ✅ create if new
        await axiosInstance.post("/users", userInfoDB, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        // ✅ if already exists, just update last_login
        const status = err?.response?.status;
        if (status === 409 || status === 400) {
          await updateLastLogin(user?.email);
        } else {
          console.error("Error saving user:", err);
          toast.error("Error saving user info: " + (err.message || "Unknown"));
        }
      }

      // ✅ consistent redirect behavior
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Google sign-in failed: " + error.message);
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-[#495E57]/10 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#45474B]">Welcome Back</h1>
        <p className="text-[#45474B]/70 mt-2">
          Login to access your medical camp dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#45474B]"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-[#495E57]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-[#495E57] bg-white"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#45474B]"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-[#495E57]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-[#495E57] bg-white"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#495E57] focus:ring-[#495E57] border-[#495E57]/30 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[#45474B]"
            >
              Remember me
            </label>
          </div>

          {/* optional: make it a route later */}
          <a
            href="#"
            className="text-sm font-medium text-[#495E57] hover:text-[#45474B] transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#495E57] transition-all duration-200"
        >
          Sign in
        </button>
      </form>

      <div className="text-center text-sm text-[#45474B]">
        New to MCMS?{" "}
        <Link
          state={{ from }}
          to="/register"
          className="font-medium text-[#495E57] hover:text-[#45474B] transition-colors"
        >
          Create an account
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#495E57]/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#45474B]">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-[#495E57]/20 rounded-lg shadow-sm text-sm font-medium text-[#45474B] bg-white hover:bg-[#495E57]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#495E57] transition-all duration-200"
      >
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
