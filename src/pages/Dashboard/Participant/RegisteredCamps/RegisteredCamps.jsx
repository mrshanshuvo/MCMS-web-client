import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  CalendarCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import CampCard from "./CampCard";
import CampTable from "./CampTable";
import PaymentDialog from "./PaymentDialog";
import FeedbackModal from "./FeedbackModal";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [paymentCamp, setPaymentCamp] = useState(null);
  const [paymentRegistration, setPaymentRegistration] = useState(null);
  const [feedbackCampId, setFeedbackCampId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Fetch registered camps
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["registeredCamps", user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/camps-with-registrations/${user.email}?page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const camps = data?.results || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Cancel registration mutation
  const { mutate: cancelRegistration, isPending: isCancelling } = useMutation({
    mutationFn: async (campId) => {
      const res = await axiosSecure.delete(`/cancel-registration/${campId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration cancelled successfully");
      queryClient.invalidateQueries(["registeredCamps"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    },
  });

  // Submit feedback mutation
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } =
    useMutation({
      mutationFn: async ({ campId, rating, feedback }) => {
        const res = await axiosSecure.post("/feedback", {
          campId,
          rating,
          feedback,
          name: user.displayName,
          photoURL: user.photoURL,
        });
        return res.data;
      },
      onSuccess: () => {
        toast.success("Feedback submitted successfully!");
        queryClient.invalidateQueries(["registeredCamps"]);
        setFeedbackCampId(null);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to submit feedback"
        );
      },
    });

  const handlePaymentSuccess = () => {
    refetch();
    toast.success("Payment completed successfully!");
    setPaymentCamp(null);
    setPaymentRegistration(null);
  };

  const getPaginationRange = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-6 mx-4 max-w-7xl">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading registered camps
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error.message || "Please try again later"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 hover:underline flex items-center"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (camps.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 text-center my-6 max-w-7xl mx-auto">
        <CalendarCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-blue-400 mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">
          No registered camps found
        </h3>
        <p className="text-sm md:text-base text-gray-500 mb-4">
          Your registered medical camps will appear here once you sign up
        </p>
        <a
          href="/available-camps"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Browse Available Camps
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Participant Dashboard
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Registered Camps
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            View and manage your upcoming medical camp registrations
          </p>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {camps.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <CampCard
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
                isCancelling={isCancelling}
              />
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
              isCancelling={isCancelling}
            />
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {getPaginationRange().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        )}

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
            isSubmitting={isSubmittingFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default RegisteredCamps;
