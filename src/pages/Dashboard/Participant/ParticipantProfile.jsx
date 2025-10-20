import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import {
  User,
  Calendar,
  Loader2,
  Edit,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

const fetchUserByEmail = async (email) => {
  const res = await fetch(`https://mcms-server-red.vercel.app/users/${email}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

const ParticipantProfile = () => {
  const { user: authUser } = useAuth();
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
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg: string }

  // Validation function
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\+?\d{7,15}$/.test(formData.phone.trim()))
      errors.phone = "Invalid phone number";
    // Address optional, no validation
    return errors;
  };

  // Update user API
  const updateUser = async ({ email, updates }) => {
    if (!authUser) throw new Error("User not authenticated");
    const token = await authUser.getIdToken();

    const res = await fetch(
      `https://mcms-server-red.vercel.app/users/${email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to update user");
    }
    return res.json();
  };

  // Fetch user data with React Query
  const {
    data: user,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", email],
    queryFn: () => fetchUserByEmail(email),
    enabled: !!email,
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        photoURL: data.photoURL || "",
        phone: data.phone || "",
        address: data.address || "",
      });
      setFormErrors({});
    },
  });

  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", email], updatedUser);
      setIsEditing(false);
      setToast({ type: "success", msg: "Profile updated successfully!" });
      setFormErrors({});
    },
    onError: (err) => {
      setToast({ type: "error", msg: err.message || "Update failed" });
    },
  });

  // Handle input changes and reset toast/errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setToast(null);
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    updateUserMutation.mutate({ email, updates: formData });
  };

  // Cancel editing and reset form
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      photoURL: user.photoURL || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setFormErrors({});
    setToast(null);
  };

  if (!email)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Please log in to see your profile
          </h3>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Participant Dashboard
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Medical Profile
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            View and manage your participant information
          </p>
        </div>

        {/* Toast messages */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-lg max-w-md mx-auto text-center ${
              toast.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Profile Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          noValidate
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
              <img
                src={
                  formData.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"
                }
                alt={formData.name || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg";
                }}
              />
            </div>
            {isEditing ? (
              <input
                aria-label="Full name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full max-w-md mx-auto px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white ${
                  formErrors.name ? "ring-red-500" : ""
                }`}
                placeholder="Enter your name"
              />
            ) : (
              <>
                <h3 className="text-2xl font-bold">
                  {user.name || "Participant"}
                </h3>
                <p className="text-blue-200">{user.email}</p>
              </>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Personal Info */}
            <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="text-blue-600 mr-2" size={20} />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm text-gray-500 block mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.name
                            ? "border-red-500 ring-red-500"
                            : "border-gray-300 ring-blue-500"
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium">{user.name || "N/A"}</p>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>

                {/* Account Type (readonly) */}
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">
                    {user.role || "participant"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm text-gray-500 block mb-1"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.phone
                            ? "border-red-500 ring-red-500"
                            : "border-gray-300 ring-blue-500"
                        }`}
                        placeholder="+1234567890"
                      />
                      {formErrors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium">{user.phone || "N/A"}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="text-sm text-gray-500 block mb-1"
                  >
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Your address"
                    />
                  ) : (
                    <p className="font-medium">{user.address || "N/A"}</p>
                  )}
                </div>

                {/* Profile Image URL */}
                {isEditing && (
                  <div>
                    <label
                      htmlFor="photoURL"
                      className="text-sm text-gray-500 block mb-1"
                    >
                      Profile Image URL
                    </label>
                    <input
                      id="photoURL"
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Account Info */}
            <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="text-blue-600 mr-2" size={20} />
                Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={updateUserMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updateUserMutation.isLoading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <Check size={20} />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateUserMutation.isLoading}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={20} />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/medical-history")}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
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
