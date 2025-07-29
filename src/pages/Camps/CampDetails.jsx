import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Users,
  User,
  DollarSign,
  ChevronRight,
  CheckCircle,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const fetchCampById = async (campId) => {
  const res = await axios.get(`http://localhost:5000/camps/${campId}`);
  return res.data.camp;
};

const checkRegistrationStatus = async (campId, idToken) => {
  const res = await axios.get(`http://localhost:5000/registrations/check`, {
    params: { campId },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.data.registered;
};

const CampDetails = () => {
  const { campId } = useParams();
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const { user } = useAuth();

  const {
    data: camp,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["camp", campId],
    queryFn: () => fetchCampById(campId),
    staleTime: 5 * 60 * 1000,
  });

  // Check registration status when component mounts and user is available
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (user && campId) {
        setCheckingRegistration(true);
        try {
          const idToken = await user.getIdToken();
          const registered = await checkRegistrationStatus(campId, idToken);
          setIsAlreadyRegistered(registered);
          if (registered) {
            setJoinSuccess(true);
          }
        } catch (error) {
          console.error("Failed to check registration status:", error);
        } finally {
          setCheckingRegistration(false);
        }
      }
    };

    checkUserRegistration();
  }, [user, campId]);

  const handleJoinCamp = async () => {
    if (!user) {
      alert("You must be logged in to register.");
      return;
    }

    if (isAlreadyRegistered) {
      return;
    }

    setJoining(true);

    try {
      const idToken = await user.getIdToken();

      // 1. Add registration
      await axios.post(
        "http://localhost:5000/registrations",
        {
          campId,
          participantName: user.displayName || "Anonymous",
          participantEmail: user.email,
          paymentStatus: "Unpaid",
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // 2. Increment participant count
      await axios.patch(
        `http://localhost:5000/camps/${campId}/increment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setJoinSuccess(true);
      setIsAlreadyRegistered(true);
      refetch();
    } catch (error) {
      alert("Failed to register for the camp.");
      console.error(error);
    } finally {
      setJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
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

  // Determine button state and content
  const getButtonContent = () => {
    if (checkingRegistration) {
      return (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Checking Registration...
        </>
      );
    }

    if (isAlreadyRegistered || joinSuccess) {
      return (
        <>
          <CheckCircle className="mr-2" size={20} />
          Already Registered
        </>
      );
    }

    if (joining) {
      return (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Processing...
        </>
      );
    }

    return (
      <>
        Register Now
        <ChevronRight
          className="ml-2 group-hover:translate-x-1 transition-transform"
          size={20}
        />
      </>
    );
  };

  const getButtonStyle = () => {
    if (isAlreadyRegistered || joinSuccess) {
      return "bg-green-500 shadow-lg cursor-not-allowed";
    }
    if (joining || checkingRegistration) {
      return "bg-blue-400 cursor-not-allowed";
    }
    return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with medical badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Medical Camp Details
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {camp.participantCount} Participants
          </div>
        </div>

        {/* Registration status alert */}
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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Camp image with medical placeholder */}
          <div className="relative h-64 sm:h-80 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            {camp.imageURL ? (
              <img
                src={camp.imageURL}
                alt={camp.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🏥</span>
            )}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-blue-800 flex items-center">
              <MapPin size={16} className="mr-1" />
              {camp.location}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {camp.name}
            </h1>
            <p className="text-xl text-blue-600 mb-6">
              {camp.healthcareProfessional}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-2">
                  <Calendar className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-gray-800">
                    Date & Time
                  </span>
                </div>
                <p className="text-gray-700">
                  {new Date(camp.dateTime).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-2">
                  <DollarSign className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-gray-800">
                    Registration Fee
                  </span>
                </div>
                <p className="text-gray-700">${camp.fees.toFixed(2)}</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-2">
                  <User className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-gray-800">
                    Lead Doctor
                  </span>
                </div>
                <p className="text-gray-700">{camp.healthcareProfessional}</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-2">
                  <Users className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-gray-800">
                    Available Slots
                  </span>
                </div>
                <p className="text-gray-700">
                  {camp.participantCount} remaining
                </p>
              </div>
            </div>

            {/* Description */}
            {camp.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ChevronRight className="text-blue-600 mr-2" />
                  Camp Overview
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {camp.description}
                  </p>
                </div>
              </div>
            )}

            {/* Join button */}
            <button
              onClick={handleJoinCamp}
              disabled={
                joining ||
                joinSuccess ||
                isAlreadyRegistered ||
                checkingRegistration
              }
              className={`group w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${getButtonStyle()} flex items-center justify-center`}
            >
              {getButtonContent()}
            </button>

            {/* Additional info */}
            <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center space-x-4">
              <span className="flex items-center">
                <Shield className="mr-1 text-blue-500" size={14} />
                HIPAA Compliant
              </span>
              <span className="flex items-center">
                <CheckCircle className="mr-1 text-green-500" size={14} />
                Verified Professionals
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampDetails;
