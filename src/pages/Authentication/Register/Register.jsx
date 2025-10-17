import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const axiosInstance = useAxios();
  const location = useLocation();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
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
          toast.error("Failed to save user to MCMS DB.");
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

        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error("Registration failed: " + error.message);
        console.error("Registration error:", error);
      });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );

      if (res.data && res.data.success) {
        setProfilePic(res.data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
        console.error("Upload response:", res.data);
      }
    } catch (error) {
      toast.error("Image upload failed.");
      console.error("Image upload error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;

        const userInfoDB = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: "participant",
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        try {
          await axiosInstance.post("http://localhost:5000/users", userInfoDB);
        } catch (error) {
          toast.error("Failed to store user info to MCMS DB.");
          console.error("DB store error:", error);
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
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-800">Create an Account</h1>
        <p className="text-blue-600 mt-2">Register for MCMS</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-blue-800"
          >
            Upload Profile Picture
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-blue-800"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-800"
          >
            Email
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
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>

      {/* Already Have Account */}
      <div className="text-center text-sm text-blue-700">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Login
        </Link>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-blue-500">Or</span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-blue-200 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="w-5 h-5" />
        Register with Google
      </button>
    </div>
  );
};

export default Register;
