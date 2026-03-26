import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Shared/Loader";
import {
  User,
  Mail,
  Briefcase,
  Edit,
  Save,
  X,
  Phone,
  MapPin,
  Camera,
  ShieldCheck,
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
      const res = await api.get(`/users/${authUser.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2",
        },
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
        customClass: {
          popup: "rounded-2xl",
        },
      });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading || isSubmitting) {
    return <Loader fullHeight message="Loading your profile..." />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-[#ff1e00]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load profile</h3>
          <p className="text-gray-600 mb-6">{error.message || "Unknown error occurred"}</p>
          <button
            onClick={() => queryClient.invalidateQueries(["organizerProfile"])}
            className="w-full bg-[#ff1e00] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ff1e00]/90 transition-all cursor-pointer shadow-lg shadow-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organizer Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-8">
            <div className="h-24 bg-gradient-to-r from-[#ff1e00] to-[#ff5e00]"></div>
            <div className="px-6 pb-8 -mt-12 text-center">
              <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white mx-auto">
                  <img
                    src={profile.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"}
                    alt={profile.name || "Organizer"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg")}
                  />
                </div>
                {editing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{profile.name || "N/A"}</h3>
              <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider border border-green-100">
                <ShieldCheck size={14} />
                Verified Organizer
              </div>
            </div>

            <div className="px-6 py-6 border-t border-gray-50 space-y-4">
              <ProfileFieldCompact icon={<Mail size={16} />} label="Email" value={profile.email} />
              <ProfileFieldCompact icon={<Phone size={16} />} label="Phone" value={profile.phone || "Not set"} />
            </div>
          </div>
        </div>

        {/* Right Column: Information/Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="text-[#ff1e00]" size={20} />
                Profile Details
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-[#ff1e00] border border-transparent hover:border-gray-100 cursor-pointer"
                >
                  <Edit size={20} />
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8">
              {!editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ProfileField label="Full Name" value={profile.name} icon={<User size={18} />} />
                  <ProfileField label="Phone Number" value={profile.phone || "Not provided"} icon={<Phone size={18} />} />
                  <ProfileField label="Organization Role" value={profile.role || "Organizer"} icon={<Briefcase size={18} />} />
                  <ProfileField label="Location / Address" value={profile.address || "Not provided"} icon={<MapPin size={18} />} className="sm:col-span-2" />
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      label="Full Name"
                      name="name"
                      register={register}
                      errors={errors}
                      required
                      icon={<User size={18} />}
                    />
                    <InputField
                      label="Phone Number"
                      name="phone"
                      register={register}
                      errors={errors}
                      type="tel"
                      placeholder="+1234567890"
                      icon={<Phone size={18} />}
                    />
                    <InputField
                      label="Profile Image URL"
                      name="photoURL"
                      register={register}
                      errors={errors}
                      placeholder="https://example.com/profile.jpg"
                      icon={<Camera size={18} />}
                      className="sm:col-span-2"
                    />
                    <InputField
                      label="Address"
                      name="address"
                      register={register}
                      errors={errors}
                      placeholder="Your professional address"
                      icon={<MapPin size={18} />}
                      className="sm:col-span-2"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-50">
                    <button
                      type="submit"
                      disabled={isSubmitting || updateMutation.isLoading}
                      className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-red-100"
                    >
                      {isSubmitting || updateMutation.isLoading ? (
                        <Loader inline size="xs" variant="spinner" />
                      ) : (
                        <Save size={18} />
                      )}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset(profile);
                        setEditing(false);
                      }}
                      className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
    </div>
  );
};

// Reusable components
const ProfileField = ({ label, value, icon, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
      {label}
    </p>
    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
      <div className="text-[#ff1e00] opacity-70">{icon}</div>
      <p className="font-semibold text-gray-800 break-words">{value || "N/A"}</p>
    </div>
  </div>
);

const ProfileFieldCompact = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 group">
    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#ff1e00]/10 transition-colors text-gray-400 group-hover:text-[#ff1e00]">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">{label}</p>
      <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

const InputField = ({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
  placeholder,
  icon,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
      {label} {required && <span className="text-[#ff1e00]">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff1e00] transition-colors">
        {icon}
      </div>
      <input
        {...register(name, required ? { required: `${label} is required` } : {})}
        type={type}
        className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff1e00]/5 transition-all bg-gray-50/50 ${
          errors[name] ? "border-[#ff1e00] bg-[#ff1e00]/5" : "border-gray-200 focus:border-[#ff1e00]"
        }`}
        placeholder={placeholder}
      />
    </div>
    {errors[name] && (
      <p className="mt-1.5 text-xs font-semibold text-[#ff1e00] ml-1 flex items-center gap-1">
        <X size={12} /> {errors[name].message}
      </p>
    )}
  </div>
);

export default OrganizerProfile;