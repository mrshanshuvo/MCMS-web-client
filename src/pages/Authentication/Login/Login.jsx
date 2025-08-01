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

  const onSubmit = (data) => {
    signInUser(data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        toast.success(`Welcome to MCMS, ${user.displayName || "participant"}!`);

        try {
          await axiosInstance.patch(`/users/${user.email}`, {
            last_login: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating last_login:", error);
        }

        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error("Login failed: " + error.message);
        console.error("Login error:", error);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;
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
          await axiosInstance.post("/users", userInfoDB, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
        } catch (error) {
          toast.error("Error saving user info: " + error.message);
          console.error("Error saving user:", error);
        }

        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error("Google sign-in failed: " + error.message);
        console.error("Google sign-in error:", error);
      });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 p-3 rounded-full">
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
        <h1 className="text-2xl font-bold text-blue-800">Welcome Back</h1>
        <p className="text-blue-600 mt-2">
          Login to access your medical camp dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-800"
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
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-800"
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
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-blue-700"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </form>

      <div className="text-center text-sm text-blue-700">
        New to MCMS?{" "}
        <Link
          state={{ from }}
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Create an account
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-blue-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-blue-200 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="w-5 h-5" />
        Google
      </button>
    </div>
  );
};

export default Login;
