import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  User,
  Calendar,
  Loader2,
  Edit,
  X,
  Check as CheckIcon,
  Phone,
  MapPin,
  Mail,
  Camera,
  History,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const ParticipantProfile = () => {
  const { user: authUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = authUser?.email;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
    phone: "",
    address: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Validation function
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\+?\d{7,15}$/.test(formData.phone.trim()))
      errors.phone = "Invalid phone number";
    return errors;
  };

  // Filter out empty/unchanged fields
  const getCleanUpdates = (currentData, originalData) => {
    const updates = {};
    Object.keys(currentData).forEach((key) => {
      const currentValue = currentData[key]?.trim() || "";
      const originalValue = originalData[key]?.trim() || "";
      if (currentValue !== originalValue && currentValue !== "") {
        updates[key] = currentValue;
      } else if (key === "address" && currentValue === "" && originalValue !== "") {
        updates[key] = "";
      }
    });
    return updates;
  };

  // Fetch user data with React Query
  const {
    data: user,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
    enabled: !!email,
    onSuccess: (data) => {
      const initialData = {
        name: data.name || "",
        photoURL: data.photoURL || "",
        phone: data.phone || "",
        address: data.address || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setFormErrors({});
    },
  });

  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: async ({ email, updates }) => {
      const cleanUpdates = getCleanUpdates(updates, originalData);
      if (Object.keys(cleanUpdates).length === 0) {
        throw new Error("No changes detected");
      }
      const res = await axiosSecure.put(`/users/${email}`, cleanUpdates);
      return res.data;
    },
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(["user", email], updatedUser);
      setIsEditing(false);
      const newOriginalData = {
        name: updatedUser.name || "",
        photoURL: updatedUser.photoURL || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      };
      setOriginalData(newOriginalData);
      setFormErrors({});
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Profile updated successfully.",
        confirmButtonColor: "#ff1e00",
        customClass: { popup: "rounded-2xl" },
      });
    },
    onError: async (err) => {
      if (err.message === "No changes detected") {
        await Swal.fire({
          icon: "info",
          title: "No changes",
          text: "No changes were made to the profile.",
          confirmButtonColor: "#ff1e00",
          customClass: { popup: "rounded-2xl" },
        });
        setIsEditing(false);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: err.response?.data?.message || err.message || "Something went wrong.",
          confirmButtonColor: "#ff1e00",
          customClass: { popup: "rounded-2xl" },
        });
      }
    },
  });

  // Handle input changes and reset errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle form submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updates = getCleanUpdates(formData, originalData);
    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update your profile?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff1e00",
      cancelButtonColor: "#6b7280",
      customClass: { popup: "rounded-2xl" },
    });

    if (result.isConfirmed) {
      updateUserMutation.mutate({ email, updates: formData });
    }
  };

  // Cancel editing and reset form
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(originalData);
    setFormErrors({});
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-6">Please log in to see your profile information.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#ff1e00] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ff1e00]/90 transition-all cursor-pointer shadow-lg shadow-red-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10 text-[#ff1e00]" />
        <p className="text-gray-500 mt-4 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
          <X className="text-[#ff1e00] mx-auto mb-4" size={32} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load profile</h3>
          <p className="text-gray-600 mb-6">{error.message || "Unknown error occurred"}</p>
          <button
            onClick={() => queryClient.invalidateQueries(["user", email])}
            className="w-full bg-[#ff1e00] text-white px-6 py-3 rounded-xl font-semibold outline-none transition-all cursor-pointer"
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
        <h1 className="text-3xl font-bold text-gray-900">Participant Profile</h1>
        <p className="mt-2 text-gray-600">View and manage your personal health profile.</p>
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
                    src={user?.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"}
                    alt={user?.name || "Participant"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg")}
                  />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 font-inter">{user.name || "N/A"}</h3>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                <ShieldCheck size={14} />
                Verified Participant
              </div>
            </div>

            <div className="px-6 py-6 border-t border-gray-50 space-y-4">
              <ProfileFieldCompact icon={<Mail size={16} />} label="Email" value={user.email} />
              <ProfileFieldCompact icon={<Phone size={16} />} label="Phone" value={user.phone || "Not set"} />
            </div>
          </div>
        </div>

        {/* Right Column: Information/Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmitForm}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="text-[#ff1e00]" size={20} />
                Information Details
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-[#ff1e00] border border-transparent hover:border-gray-100 cursor-pointer"
                >
                  <Edit size={20} />
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Personal Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <InputField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                        required
                        icon={<User size={18} />}
                      />
                      <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={formErrors.phone}
                        type="tel"
                        required
                        placeholder="+1234567890"
                        icon={<Phone size={18} />}
                      />
                      <InputField
                        label="Profile Image URL"
                        name="photoURL"
                        value={formData.photoURL}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                        icon={<Camera size={18} />}
                        className="sm:col-span-2"
                      />
                      <div className="sm:col-span-2 space-y-1.5 ml-1">
                        <label className="block text-sm font-bold text-gray-700">
                          Address
                        </label>
                        <div className="relative group">
                           <div className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-[#ff1e00] transition-colors">
                            <MapPin size={18} />
                          </div>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff1e00]/5 focus:border-[#ff1e00] transition-all bg-gray-50/50 resize-none"
                            placeholder="Your address"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <DisplayField label="Full Name" value={user.name} icon={<User size={18} />} />
                      <DisplayField label="Phone Number" value={user.phone || "Not provided"} icon={<Phone size={18} />} />
                      <DisplayField label="Location" value={user.address || "Not provided"} icon={<MapPin size={18} />} className="sm:col-span-2" />
                    </>
                  )}
                </div>
              </div>

              {/* Account Section */}
              {!isEditing && (
                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Calendar size={16} /> Account Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Last Activity</p>
                      <p className="font-semibold text-gray-800">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-50">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      disabled={updateUserMutation.isLoading}
                      className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-red-100"
                    >
                      {updateUserMutation.isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <CheckIcon size={18} />
                      )}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updateUserMutation.isLoading}
                      className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/medical-history")}
                      className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gray-200"
                    >
                      <History size={18} />
                      Medical History
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-100"
                    >
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const DisplayField = ({ label, value, icon, className = "" }) => (
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
    <div className="min-w-0 flex-1 text-left">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">{label}</p>
      <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
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
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`w-full pl-11 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff1e00]/5 transition-all bg-gray-50/50 ${
          error ? "border-[#ff1e00] bg-[#ff1e00]/5" : "border-gray-200 focus:border-[#ff1e00]"
        }`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs font-semibold text-[#ff1e00] ml-1 flex items-center gap-1">
        <X size={12} /> {error}
      </p>
    )}
  </div>
);

export default ParticipantProfile;