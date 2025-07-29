import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { User, Mail, Briefcase, Edit, Save, X, Loader2 } from "lucide-react";

const OrganizerProfile = () => {
  const { user: authUser, token } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch profile with React Query using GET API
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizerProfile", authUser?.email],
    enabled: !!authUser?.email,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/users/${authUser.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: (data) => reset(data),
  });

  // Mutation to update profile using PUT API
  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      axios.put(
        `http://localhost:5000/users/${authUser.email}`,
        {
          name: updatedData.name,
          photoURL: updatedData.photoURL,
          role: profile?.role || "organizer",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        background: "#fff",
        confirmButtonColor: "#0f766e",
      });
      queryClient.invalidateQueries(["organizerProfile", authUser.email]);
      setEditing(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
        background: "#fff",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Failed to load profile
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No profile data found
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Organizer Dashboard
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Organizer Profile
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            {editing
              ? "Update your profile details"
              : "View your organizer profile"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
              <img
                src={
                  profile.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"
                }
                alt={profile.name || "Organizer"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg";
                }}
              />
              {editing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Edit className="text-white" size={24} />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold">
              {profile.name || "Organizer"}
            </h3>
            <p className="text-blue-200">{profile.email}</p>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {!editing ? (
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="text-blue-600 mr-2" size={20} />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{profile.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium capitalize">
                        {profile.role || "organizer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Update Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Editable Fields */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Edit className="text-blue-600 mr-2" size={20} />
                    Edit Profile
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image URL
                      </label>
                      <input
                        {...register("photoURL")}
                        type="url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || updateMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting || updateMutation.isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset(profile);
                      setEditing(false);
                    }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;
