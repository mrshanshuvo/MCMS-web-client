import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { User, Calendar, Loader2, Edit, X, Check } from "lucide-react";
import { useNavigate } from "react-router";

const fetchUserByEmail = async (email) => {
  const res = await fetch(`http://localhost:5000/users/${email}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
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
  });

  // updateUser moved inside component to access authUser and token
  const updateUser = async ({ email, updates }) => {
    if (!authUser) throw new Error("User not authenticated");
    const token = await authUser.getIdToken();

    const res = await fetch(`http://localhost:5000/users/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- Add token here
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error("Failed to update user");
    }
    return res.json();
  };

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
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", email], updatedUser);
      setIsEditing(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserMutation.mutate({
      email,
      updates: formData,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      photoURL: user.photoURL || "",
    });
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

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
              <img
                src={user.photoURL || "https://i.ibb.co/5h7FQs6N/unnamed.jpg"}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/5h7FQs6N/unnamed.jpg";
                }}
              />
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full max-w-md mx-auto px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter your name"
                />
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  className="w-full max-w-md mx-auto px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Image URL"
                />
              </div>
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
          <div className="p-6 sm:p-8">
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-medium">{user.name || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">
                      {user.role || "participant"}
                    </p>
                  </div>
                  {isEditing && (
                    <div>
                      <p className="text-sm text-gray-500">Profile Image URL</p>
                      <input
                        type="text"
                        name="photoURL"
                        value={formData.photoURL}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
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
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={updateUserMutation.isLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {updateUserMutation.isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Check size={20} />
                      )}
                      Save Changes
                    </button>
                    <button
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
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={20} />
                      Edit Profile
                    </button>
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                      View Medical History
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantProfile;
