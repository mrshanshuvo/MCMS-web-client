import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import {
  User,
  Mail,
  Briefcase,
  Edit,
  Save,
  X,
  Loader2,
  Phone,
  MapPin,
  Activity,
} from "lucide-react";

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

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizerProfile", authUser?.email],
    enabled: !!authUser?.email,
    queryFn: async () => {
      const res = await api.get(
        `/users/${authUser.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: (data) => reset(data),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      api.put(
        `/users/${authUser.email}`,
        {
          name: updatedData.name,
          photoURL: updatedData.photoURL,
          phone: updatedData.phone,
          address: updatedData.address,
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
        confirmButtonColor: "#ff1e00",
      });
      queryClient.invalidateQueries(["organizerProfile", authUser.email]);
      setEditing(false);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#ff1e00",
      });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading || isSubmitting)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#e8f9fd]">
        <Loader2 className="animate-spin h-8 w-8 text-[#ff1e00]" />
        <p className="text-gray-500 mt-3">Loading profile...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e8f9fd]">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md mx-4 border border-gray-100">
          <h3 className="text-xl font-semibold text-[#ff1e00] mb-2">
            Failed to load profile
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#e8f9fd] text-[#ff1e00] px-4 py-2 rounded-lg font-medium hover:bg-[#e8f9fd]/80 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#ff1e00] p-8 text-white text-center">
            <div className="relative mx-auto w-28 h-28 rounded-full border-4 border-white/30 mb-4 overflow-hidden bg-white">
              <img
                src={
                  profile.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"
                }
                alt={profile.name || "Organizer"}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg")
                }
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{profile.name || "N/A"}</h3>
            <p className="text-white/80">{profile.email}</p>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            {!editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <ProfileField
                    label="Full Name"
                    value={profile.name}
                    icon={<User size={16} />}
                  />
                  <ProfileField
                    label="Email"
                    value={profile.email}
                    icon={<Mail size={16} />}
                  />
                  <ProfileField
                    label="Phone"
                    value={profile.phone || "Not provided"}
                    icon={<Phone size={16} />}
                  />
                  <ProfileField
                    label="Address"
                    value={profile.address || "Not provided"}
                    icon={<MapPin size={16} />}
                  />
                  <ProfileField
                    label="Role"
                    value={profile.role || "Organizer"}
                    icon={<Briefcase size={16} />}
                  />
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit size={18} />
                  Update Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    name="name"
                    register={register}
                    errors={errors}
                    required
                  />
                  <InputField
                    label="Profile Image URL"
                    name="photoURL"
                    register={register}
                    errors={errors}
                    placeholder="https://example.com/profile.jpg"
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    register={register}
                    errors={errors}
                    type="tel"
                    placeholder="+1234567890"
                  />
                  <InputField
                    label="Address"
                    name="address"
                    register={register}
                    errors={errors}
                    placeholder="Your address"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || updateMutation.isLoading}
                    className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-[#e8f9fd] transition-colors flex items-center justify-center gap-2 cursor-pointer"
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

// Reusable field display
const ProfileField = ({ label, value, icon }) => (
  <div className="bg-[#e8f9fd] rounded-xl p-4">
    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
      {icon}
      <span className="text-gray-500">{label}</span>
    </p>
    <p className="font-medium text-gray-900">{value || "N/A"}</p>
  </div>
);

// Reusable input field
const InputField = ({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-[#ff1e00]">*</span>}
    </label>
    <input
      {...register(name, required ? { required: `${label} is required` } : {})}
      type={type}
      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors[name]
        ? "border-[#ff1e00]"
        : "border-gray-200"
        }`}
      placeholder={placeholder}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-[#ff1e00]">{errors[name].message}</p>
    )}
  </div>
);

export default OrganizerProfile;