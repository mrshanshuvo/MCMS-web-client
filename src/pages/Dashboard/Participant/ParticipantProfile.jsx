import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { User, Calendar, Loader2, Edit, X, Check, Activity, Phone, MapPin, Mail } from "lucide-react";
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
      }
      else if (
        key === "address" &&
        currentValue === "" &&
        originalValue !== ""
      ) {
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
      });
    },
    onError: async (err) => {
      if (err.message === "No changes detected") {
        await Swal.fire({
          icon: "info",
          title: "No changes",
          text: "No changes were made to the profile.",
          confirmButtonColor: "#ff1e00",
        });
        setIsEditing(false);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text:
            err.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#ff1e00",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updates = getCleanUpdates(formData, originalData);
    if (Object.keys(updates).length === 0) {
      await Swal.fire({
        icon: "info",
        title: "No changes",
        text: "No changes were made to the profile.",
        confirmButtonColor: "#ff1e00",
      });
      setIsEditing(false);
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#59ce8f",
      cancelButtonColor: "#ff1e00",
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

  if (!email)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e8f9fd]">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md mx-4 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Please log in to see your profile
          </h3>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-[#ff1e00] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff1e00]/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e8f9fd]">
        <Loader2 className="animate-spin h-12 w-12 text-[#ff1e00]" />
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
            className="bg-[#e8f9fd] text-[#ff1e00] px-4 py-2 rounded-lg font-medium hover:bg-[#e8f9fd]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#e8f9fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-[#ff1e00]">Medical Profile</span>
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your participant information
          </p>
        </div>

        {/* Profile Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
          noValidate
        >
          {/* Profile Header */}
          <div className="bg-[#ff1e00] p-8 text-white text-center">
            <div className="relative mx-auto w-28 h-28 rounded-full border-4 border-white/30 mb-4 overflow-hidden bg-white">
              <img
                src={user?.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"}
                alt={user?.name || "user"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg";
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {user.name || "Participant"}
            </h3>
            <p className="text-white/80">{user.email}</p>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Personal Info */}
            <div className="bg-[#e8f9fd] p-6 rounded-xl border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-[#ff1e00]" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Full Name <span className="text-[#ff1e00]">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${formErrors.name
                          ? "border-[#ff1e00]"
                          : "border-gray-200"
                          }`}
                      />
                      {formErrors.name && (
                        <p className="text-[#ff1e00] text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Account Type
                  </label>
                  <p className="font-medium text-gray-900 capitalize">
                    {user.role || "participant"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Phone <span className="text-[#ff1e00]">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${formErrors.phone
                          ? "border-[#ff1e00]"
                          : "border-gray-200"
                          }`}
                        placeholder="+1234567890"
                      />
                      {formErrors.phone && (
                        <p className="text-[#ff1e00] text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <p className="font-medium text-gray-900">{user.phone || "N/A"}</p>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-500 block mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all resize-none"
                      placeholder="Your address"
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <p className="font-medium text-gray-900">{user.address || "N/A"}</p>
                    </div>
                  )}
                </div>

                {/* Profile Image URL */}
                {isEditing && (
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-500 block mb-1">
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-[#e8f9fd] p-6 rounded-xl border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[#ff1e00]" />
                Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Member Since
                  </label>
                  <p className="font-medium text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Last Login
                  </label>
                  <p className="font-medium text-gray-900">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={updateUserMutation.isLoading}
                    className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updateUserMutation.isLoading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <Check size={18} />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateUserMutation.isLoading}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-[#ff1e00] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#ff1e00]/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/medical-history")}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Medical History
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantProfile;