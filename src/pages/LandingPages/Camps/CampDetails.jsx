import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api";
import {
  MapPin,
  Calendar,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  Shield,
  X,
  Star,
  Activity,
  ChevronDown,
} from "lucide-react";
import Loader from "../../../components/Shared/Loader";
import useAuth from "../../../hooks/useAuth";
import useActionMenu from "../../../hooks/useActionMenu";
import Swal from "sweetalert2";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-hot-toast";

const fetchCampById = async (campId) => {
  const res = await api.get(
    `/camps/${campId}`
  );
  return res.data.camp;
};

const checkRegistrationStatus = async (campId, idToken) => {
  const res = await api.get(
    `/registrations/check`,
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
  const res = await api.get(`/users/${email}/role`);
  return res.data.role || "participant";
};

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const CampDetails = () => {
  const { campId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  const genderMenu = useActionMenu({
    options: genderOptions,
    initialValue: formData.gender,
    onSelect: (val) => setFormData((f) => ({ ...f, gender: val })),
  });

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
    return <Loader fullHeight message="Loading camp details..." />;
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
          // Redirect to login page with return state
          navigate("/login", { state: { from: location.pathname } });
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
      await api.post(
        "/registrations",
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
      await api.patch(
        `/camps/${campId}/increment`,
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
      toast.success("Successfully registered for the medical camp!");
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
        toast.error(
          error.response?.data?.error || "Registration failed. Try again."
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#F5F7F8] to-white pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#495E57]/10">
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
            {/* Header and participant count */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/50 rounded-full font-medium mb-4">
                <Activity size={18} className="text-white mr-2 animate-pulse" />
                Medical Camp Details
              </div>

              <div className="bg-[#F4CE14]/50 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Users size={14} className="mr-1" />
                {camp.participantCount} Participants
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#45474B] flex items-center">
              <MapPin size={16} className="mr-1 text-[#495E57]" />
              {camp.location}
            </div>
          </div>

          {/* Camp info */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#45474B] mb-2">
                  {camp.name}
                </h1>
                <p className="text-xl text-[#495E57] mb-6">
                  {camp.healthcareProfessional}
                </p>
              </div>

              {/* Already Registered alert */}
              {isAlreadyRegistered && (
                <div className="rounded-lg flex items-center mx-12">
                  <CheckCircle className="text-green-600 mr-3" size={20} />
                  <p className="text-green-800 font-medium">
                    You're already registered!
                  </p>
                </div>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
              className={`group w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus:outline-none ${isOrganizer
                ? "bg-gray-400 cursor-not-allowed"
                : joinSuccess || isAlreadyRegistered
                  ? "bg-green-500 shadow-lg cursor-not-allowed"
                  : "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] shadow-lg hover:shadow-xl cursor-pointer"
                } flex items-center justify-center`}
            >
              {isOrganizer ? (
                <>
                  <Shield className="mr-2" size={20} />
                  You are an Organizer
                </>
              ) : checkingRegistration ? (
                <Loader inline size="sm" variant="spinner" message="Checking Registration..." />
              ) : joinSuccess || isAlreadyRegistered ? (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Already Registered
                </>
              ) : formSubmitting ? (
                <Loader inline size="sm" variant="spinner" message="Processing..." />
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
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 relative border border-[#495E57]/10 shadow-2xl transform transition-all duration-300 scale-100 opacity-100"
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
                className="text-[#45474B] hover:text-[#495E57] transition cursor-pointer focus:outline-none"
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
                <label className="block text-sm font-medium text-[#45474B] mb-1">
                  Gender *
                </label>
                <div className="relative" ref={genderMenu.containerRef}>
                  <button
                    type="button"
                    onClick={genderMenu.toggle}
                    className="flex items-center justify-between w-full rounded-lg border border-[#495E57]/20 px-3 py-2 bg-white text-[#45474B] focus:outline-none focus:ring-2 focus:ring-[#495E57] transition-all duration-200"
                  >
                    <span>{genderMenu.selectedOption.label}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#495E57] transition-transform duration-200 ${genderMenu.isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {genderMenu.isOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-[#495E57]/15 rounded-xl shadow-xl z-50 overflow-hidden animate-[slideDown_0.2s_ease-out]">
                      {genderOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => genderMenu.handleSelect(opt.value)}
                          className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${genderMenu.value === opt.value
                            ? "bg-[#495E57]/10 text-[#495E57] font-medium"
                            : "text-[#45474B] hover:bg-[#F5F7F8]"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                  <Loader inline size="xs" variant="spinner" message="Registering..." />
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
