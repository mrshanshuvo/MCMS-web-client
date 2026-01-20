import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  Loader2,
  Shield,
  X,
  Star,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const fetchCampById = async (campId) => {
  const res = await axios.get(
    `https://mcms-server-red.vercel.app/camps/${campId}`
  );
  return res.data.camp;
};

const checkRegistrationStatus = async (campId, idToken) => {
  const res = await axios.get(
    `https://mcms-server-red.vercel.app/registrations/check`,
    {
      params: { campId },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return res.data.registered;
};

const fetchUserRole = async (email) => {
  const res = await axios.get(
    `https://mcms-server-red.vercel.app/users/${email}/role`
  );
  return res.data.role || "participant";
};

const CampDetails = () => {
  const { campId } = useParams();
  const { user } = useAuth();

  // modal open state
  const [modalOpen, setModalOpen] = useState(false);
  // form states
  const [formData, setFormData] = useState({
    participantName: user?.displayName || "",
    participantEmail: user?.email || "",
    age: "",
    phoneNumber: "",
    gender: "",
    emergencyContact: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Fetch camp details
  const {
    data: camp,
    isLoading,
    isError,
    error,
    refetch: refetchCamp,
  } = useQuery({
    queryKey: ["camp", campId],
    queryFn: () => fetchCampById(campId),
    staleTime: 5 * 60 * 1000,
    enabled: !!campId,
  });

  // Fetch user role
  const {
    data: role = "participant",
    isLoading: roleLoading,
    isError: roleError,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: () => fetchUserRole(user.email),
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000,
  });

  // Check registration status
  const {
    data: isAlreadyRegistered = false,
    isLoading: checkingRegistration,
    refetch: refetchRegistration,
  } = useQuery({
    queryKey: ["registrationStatus", campId, user?.email],
    queryFn: async () => {
      const idToken = await user.getIdToken();
      return await checkRegistrationStatus(campId, idToken);
    },
    enabled: !!user && !!campId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white">
        <Loader2 className="animate-spin h-12 w-12 text-[#495E57]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600 bg-white rounded-xl shadow-lg max-w-4xl">
        <p>{error.message || "Failed to load camp details."}</p>
      </div>
    );
  }

  if (roleError) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600 bg-white rounded-xl shadow-lg max-w-4xl">
        <p>Failed to load user role.</p>
      </div>
    );
  }

  const isOrganizer = role === "organizer";

  const openModal = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "You must be logged in!",
        text: "Please log in to register for the camp.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#495E57",
        cancelButtonColor: "#E53E3E",
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = "/login"; // replace with your login route
        }
      });
      return;
    }

    setJoinError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (formSubmitting) return; // block close while submitting
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.age ||
      !formData.phoneNumber ||
      !formData.gender ||
      !formData.emergencyContact
    ) {
      setJoinError("Please fill all required fields.");
      return;
    }

    setFormSubmitting(true);
    setJoinError("");

    try {
      const idToken = await user.getIdToken();

      // 1. Register the participant
      await axios.post(
        "https://mcms-server-red.vercel.app/registrations",
        {
          campId,
          participantName: formData.participantName,
          participantEmail: formData.participantEmail,
          age: formData.age,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          emergencyContact: formData.emergencyContact,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // 2. Increment participant count
      await axios.patch(
        `https://mcms-server-red.vercel.app/camps/${campId}/increment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setJoinSuccess(true);
      setModalOpen(false);
      await refetchRegistration();
      refetchCamp();
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );

      // Handle specific errors
      if (error.response?.status === 404) {
        setJoinError("Camp not found - please refresh and try again");
      } else {
        setJoinError(
          error.response?.data?.error ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header and participant count */}
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
            <div className="w-2 h-2 bg-[#495E57] rounded-full mr-2 animate-pulse"></div>
            Medical Camp Details
          </div>
          <div className="bg-[#F4CE14]/20 text-[#45474B] px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Users size={14} className="mr-1" />
            {camp.participantCount} Participants
          </div>
        </div>

        {/* Already Registered alert */}
        {isAlreadyRegistered && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={20} />
            <div>
              <p className="text-green-800 font-medium">
                You're already registered!
              </p>
              <p className="text-green-600 text-sm">
                You have successfully registered for this medical camp.
              </p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#495E57]/10">
          {/* Camp image */}
          <div className="relative h-64 sm:h-80 w-full bg-gradient-to-br from-[#495E57]/10 to-[#F4CE14]/10 flex items-center justify-center">
            {camp.imageURL ? (
              <img
                src={camp.imageURL}
                alt={camp.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🏥</span>
            )}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#45474B] flex items-center">
              <MapPin size={16} className="mr-1 text-[#495E57]" />
              {camp.location}
            </div>
          </div>

          {/* Camp info */}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#45474B] mb-2">
              {camp.name}
            </h1>
            <p className="text-xl text-[#495E57] mb-6">
              {camp.healthcareProfessional}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#495E57]/5 p-4 rounded-xl border border-[#495E57]/10">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="text-[#495E57]" size={16} />
                  </div>
                  <span className="font-semibold text-[#45474B]">
                    Date & Time
                  </span>
                </div>
                <p className="text-[#45474B]">
                  {new Date(camp.dateTime).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-[#495E57]/5 p-4 rounded-xl border border-[#495E57]/10">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#F4CE14]/20 rounded-lg flex items-center justify-center mr-3">
                    <FaBangladeshiTakaSign
                      className="text-[#F4CE14]"
                      size={16}
                    />
                  </div>
                  <span className="font-semibold text-[#45474B]">
                    Registration Fee
                  </span>
                </div>
                <p className="text-[#45474B]">${camp.fees.toFixed(2)}</p>
              </div>

              <div className="bg-[#495E57]/5 p-4 rounded-xl border border-[#495E57]/10">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                    <User className="text-[#495E57]" size={16} />
                  </div>
                  <span className="font-semibold text-[#45474B]">
                    Lead Doctor
                  </span>
                </div>
                <p className="text-[#45474B]">{camp.healthcareProfessional}</p>
              </div>

              <div className="bg-[#495E57]/5 p-4 rounded-xl border border-[#495E57]/10">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                    <Users className="text-[#495E57]" size={16} />
                  </div>
                  <span className="font-semibold text-[#45474B]">
                    Available Slots
                  </span>
                </div>
                <p className="text-[#45474B]">
                  {camp.participantCount} remaining
                </p>
              </div>
            </div>

            {/* Description */}
            {camp.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#45474B] mb-4 flex items-center">
                  <ChevronRight className="text-[#495E57] mr-2" />
                  Camp Overview
                </h2>
                <div className="prose max-w-none">
                  <p className="text-[#45474B] leading-relaxed">
                    {camp.description}
                  </p>
                </div>
              </div>
            )}

            {/* Join Camp Button */}
            <button
              onClick={openModal}
              disabled={
                isOrganizer ||
                joinSuccess ||
                isAlreadyRegistered ||
                checkingRegistration ||
                formSubmitting
              }
              className={`group w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                isOrganizer
                  ? "bg-gray-400 cursor-not-allowed"
                  : joinSuccess || isAlreadyRegistered
                  ? "bg-green-500 shadow-lg cursor-not-allowed"
                  : "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] shadow-lg hover:shadow-xl"
              } flex items-center justify-center`}
            >
              {isOrganizer ? (
                <>
                  <Shield className="mr-2" size={20} />
                  You are an Organizer
                </>
              ) : checkingRegistration ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Checking Registration...
                </>
              ) : joinSuccess || isAlreadyRegistered ? (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Already Registered
                </>
              ) : formSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  Register Now
                  <ChevronRight
                    className="ml-2 text-[#F4CE14] group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 relative border border-[#495E57]/10"
            onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
          >
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#45474B]">
                Join Camp Registration
              </h3>
              <button
                onClick={closeModal}
                disabled={formSubmitting}
                aria-label="Close modal"
                className="text-[#45474B] hover:text-[#495E57] transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Read-only camp info */}
            <div className="mb-4 space-y-2 text-[#45474B] bg-[#F5F7F8] p-4 rounded-lg">
              <p>
                <strong>Camp Name:</strong> {camp.name}
              </p>
              <p>
                <strong>Fees:</strong> ${camp.fees.toFixed(2)}
              </p>
              <p>
                <strong>Location:</strong> {camp.location}
              </p>
              <p>
                <strong>Healthcare Professional:</strong>{" "}
                {camp.healthcareProfessional}
              </p>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="participantName"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Participant Name *
                </label>
                <input
                  type="text"
                  id="participantName"
                  name="participantName"
                  value={formData.participantName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="participantEmail"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Participant Email *
                </label>
                <input
                  type="email"
                  id="participantEmail"
                  name="participantEmail"
                  value={formData.participantEmail}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  pattern="^\+?\d{7,15}$"
                  placeholder="+8801xxxxxxxxx"
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="emergencyContact"
                  className="block text-sm font-medium text-[#45474B]"
                >
                  Emergency Contact *
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  pattern="^\+?\d{7,15}$"
                  placeholder="+8801xxxxxxxxx"
                  required
                  className="mt-1 block w-full rounded-lg border border-[#495E57]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#495E57] bg-white"
                />
              </div>

              {joinError && (
                <p className="text-red-600 text-sm font-medium">{joinError}</p>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Registering...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampDetails;
