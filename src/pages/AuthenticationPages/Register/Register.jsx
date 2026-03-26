import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { User, Mail, Lock, Camera, ArrowRight, UserPlus } from "lucide-react";
import useImageOptimizer from "../../../hooks/useImageOptimizer";
import Loader from "../../../components/Shared/Loader";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const { compressImage } = useImageOptimizer();
  const location = useLocation();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    setLoading(true);
    createUser(data.email, data.password)
      .then(async (result) => {
        const firebaseUser = result.user;
        const idToken = await firebaseUser.getIdToken();

        const userInfoDB = {
          email: data.email,
          name: data.name,
          photoURL: profilePic,
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
          toast.error("Failed to save user to CareCamp DB.");
          console.error("Error saving user:", error);
        }

        updateUserProfile({
          displayName: data.name,
          photoURL: profilePic,
        })
          .then(() => {
            toast.success("Profile updated successfully.");
          })
          .catch((error) => {
            toast.error("Failed to update Firebase profile.");
            console.error("Update profile error:", error);
          });

        toast.success(`Welcome to CareCamp, ${data.name}!`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error("Registration failed: " + error.message);
        console.error("Registration error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Optimize image before upload
      const optimizedFile = await compressImage(file, {
        maxSizeMB: 0.8, // Target size under 800KB
        maxWidthOrHeight: 1280, // High quality but reasonable resolution
      });

      const formData = new FormData();
      formData.append("image", optimizedFile);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
      );

      if (res.data && res.data.success) {
        setProfilePic(res.data.data.url);
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
        console.error("Upload response:", res.data);
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
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
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 409 || status === 400) {
          await axiosInstance.patch(`/users/${user.email}`, {
            last_login: new Date().toISOString(),
          });
        } else {
          throw err;
        }
      }

      toast.success(
        `Welcome to CareCamp, ${user.displayName || "participant"}!`,
      );
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Google sign-in failed: " + error.message);
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        className="mt-14"
      />

      <div>
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#495E57] to-[#2C3E38] rounded-xl mb-2">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E38] mb-1">Create an Account</h1>
          <p className="text-[#5C6E64]">Join CareCamp and start your journey</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3E38] mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-8">
                <div className="flex-shrink-0">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#495E57]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#495E57] to-[#2C3E38] flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-[#495E57] rounded-lg text-sm font-medium text-[#495E57] bg-white hover:bg-[#495E57] hover:text-white transition-all duration-200"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Choose Photo"}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-xs text-[#5C6E64] mt-1">
                    JPG, PNG, WEBP (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3E38] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#9BA8A2]" />
                </div>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-[#E0E5E2]'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent transition-all duration-200`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3E38] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#9BA8A2]" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-[#E0E5E2]'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent transition-all duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3E38] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#9BA8A2]" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-500' : 'border-[#E0E5E2]'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent transition-all duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#495E57] to-[#2C3E38] hover:from-[#2C3E38] hover:to-[#1F2E29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#495E57] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader inline size="xs" variant="spinner" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already Have Account */}
          <div className="text-center text-sm text-[#5C6E64] mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#495E57] hover:text-[#2C3E38] transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E5E2]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#9BA8A2]">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#E0E5E2] rounded-xl shadow-sm text-sm font-semibold text-[#2C3E38] bg-white hover:bg-[#F5F7FA] hover:border-[#495E57] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#495E57] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-5 h-5" />
            Register with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#5C6E64]">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-[#495E57] hover:text-green-600 font-medium">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/pPolicy" className="text-[#495E57] hover:text-green-600 font-medium">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;