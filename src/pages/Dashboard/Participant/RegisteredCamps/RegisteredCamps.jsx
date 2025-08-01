import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CalendarCheck, AlertCircle } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import CampCard from "./CampCard";
import CampTable from "./CampTable";
import PaymentDialog from "./PaymentDialog";
import FeedbackModal from "./FeedbackModal";
import useAuth from "../../../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const RegisteredCamps = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [paymentCamp, setPaymentCamp] = useState(null);
  const [paymentRegistration, setPaymentRegistration] = useState(null);
  const [feedbackCampId, setFeedbackCampId] = useState(null);

  // Fetch registered camps
  const {
    data: camps = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["registeredCamps", user?.email],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/camps-with-registrations/${
          user.email
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch registered camps");
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Cancel registration mutation
  const { mutate: cancelRegistration } = useMutation({
    mutationFn: async (campId) => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cancel-registration/${campId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to cancel registration");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Registration cancelled successfully");
      queryClient.invalidateQueries(["registeredCamps"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // Submit feedback mutation
  const { mutate: submitFeedback } = useMutation({
    mutationFn: async ({ campId, rating, feedback }) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campId,
          rating,
          feedback,
          name: user.displayName,
          photoURL: user.photoURL,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      queryClient.invalidateQueries(["registeredCamps"]);
    },
  });

  const handlePaymentSuccess = () => {
    refetch();
    toast.success("Payment completed successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-6 mx-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading registered camps
            </h3>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (camps.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 text-center my-6 mx-4">
        <CalendarCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-blue-400 mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">
          No registered camps found
        </h3>
        <p className="text-sm md:text-base text-gray-500">
          Your registered medical camps will appear here once you sign up
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-blue-100 rounded-full text-xs md:text-sm text-blue-800 font-medium mb-2 md:mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Participant Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Registered Camps
            </span>
          </h2>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {camps.map((camp) => (
            <CampCard
              key={camp._id}
              camp={camp}
              onPay={() => {
                setPaymentCamp(camp);
                setPaymentRegistration(camp.participants[0]);
              }}
              onCancel={cancelRegistration}
              onFeedback={() => {
                if (!camp.hasFeedback) {
                  setFeedbackCampId(camp._id);
                } else {
                  toast.error("You already submitted feedback for this camp");
                }
              }}
              feedbackDisabled={camp.hasFeedback}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <CampTable
            camps={camps}
            onPay={(camp) => {
              setPaymentCamp(camp);
              setPaymentRegistration(camp.participants[0]);
            }}
            onCancel={cancelRegistration}
            onFeedback={(camp) => {
              if (!camp.hasFeedback) {
                setFeedbackCampId(camp._id);
              } else {
                toast.error("You already submitted feedback for this camp");
              }
            }}
          />
        </div>
      </div>

      {/* Payment Dialog */}
      <Elements stripe={stripePromise}>
        <PaymentDialog
          open={!!paymentCamp}
          onClose={() => {
            setPaymentCamp(null);
            setPaymentRegistration(null);
          }}
          camp={paymentCamp}
          registration={paymentRegistration}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Elements>

      {/* Feedback Modal */}
      {feedbackCampId && (
        <FeedbackModal
          campId={feedbackCampId}
          onClose={() => setFeedbackCampId(null)}
          onSubmit={submitFeedback}
        />
      )}
    </div>
  );
};

export default RegisteredCamps;
