import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
      const res = await axios.get(
        `https://mcms-server-red.vercel.app/users/${authUser.email}`,
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
      axios.put(
        `https://mcms-server-red.vercel.app/users/${authUser.email}`,
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
        confirmButtonColor: "#0f766e",
      });
      queryClient.invalidateQueries(["organizerProfile", authUser.email]);
      setEditing(false);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading || isSubmitting)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
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
    );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Organizer <span className="text-blue-600">Profile</span>
          </h2>
          <p className="text-lg text-gray-600">
            {editing ? "Edit your profile" : "View your profile"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-700 to-teal-600 p-6 text-white text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
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
            <h3 className="text-2xl font-bold">{profile.name || "N/A"}</h3>
            <p className="text-blue-200">{profile.email}</p>
          </div>

          <div className="p-6 sm:p-8">
            {!editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <ProfileField
                    label="Full Name"
                    value={profile.name}
                    icon={<User />}
                  />
                  <ProfileField
                    label="Email"
                    value={profile.email}
                    icon={<Mail />}
                  />
                  <ProfileField
                    label="Phone"
                    value={profile.phone || "N/A"}
                    icon={<Phone />}
                  />
                  <ProfileField
                    label="Address"
                    value={profile.address || "N/A"}
                    icon={<MapPin />}
                  />
                  <ProfileField
                    label="Role"
                    value={profile.role || "N/A"}
                    icon={<Briefcase />}
                  />
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Update Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  />
                  <InputField
                    label="Address"
                    name="address"
                    register={register}
                    errors={errors}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || updateMutation.isLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting || updateMutation.isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset(profile);
                      setEditing(false);
                    }}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
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
  <div>
    <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
      {icon} {label}
    </p>
    <p className="font-medium">{value || "N/A"}</p>
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
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <input
      {...register(name, required ? { required: `${label} is required` } : {})}
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      placeholder={placeholder}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
);

export default OrganizerProfile;
