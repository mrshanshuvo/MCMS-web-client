import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  Loader2,
  CalendarCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  X,
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
import useActionMenu from "../../../../hooks/useActionMenu";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [paymentCamp, setPaymentCamp] = useState(null);
  const [paymentRegistration, setPaymentRegistration] = useState(null);
  const [feedbackCampId, setFeedbackCampId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 5;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Paid", label: "Paid" },
    { value: "Unpaid", label: "Unpaid" },
  ];

  const {
    selectedOption,
    handleSelect,
    isOpen,
    setIsOpen,
    containerRef,
  } = useActionMenu({
    options: statusOptions,
    initialValue: statusFilter,
    onSelect: (val) => {
      setStatusFilter(val);
      setCurrentPage(1);
    },
  });

  // Fetch registered camps
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["registeredCamps", user?.email, currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/camps-with-registrations/${user.email}?page=${currentPage}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
    placeholderData: keepPreviousData,
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



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin h-12 w-12 text-[#ff1e00] mb-4" />
        <p className="text-gray-500">Loading registered camps...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#ff1e00]/5 border-l-4 border-[#ff1e00] p-4 rounded-lg my-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-[#ff1e00] mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Error loading registered camps
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {error.message || "Please try again later"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-[#ff1e00] hover:underline flex items-center cursor-pointer"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-[#ff1e00]">Registered Camps</span>
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your upcoming medical camp registrations
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Header with filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarCheck size={20} className="text-[#ff1e00]" />
                <h2 className="text-lg font-semibold text-gray-900">Registration Records</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#ff1e00] transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search camps..."
                    className="pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent text-gray-900 w-full sm:w-64"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff1e00] hover:bg-[#ff1e00]/10 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status ActionMenu */}
                <div className="relative" ref={containerRef}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 bg-white cursor-pointer hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent min-w-[160px]"
                  >
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                      Status:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {selectedOption.label}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-400 group-hover:text-[#ff1e00] transition-colors" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 group-hover:text-[#ff1e00] transition-colors" />
                    )}
                  </button>
                  {isOpen && (
                    <ul className="absolute right-0 mt-2 p-2 shadow-xl bg-white border border-gray-100 rounded-xl w-48 z-50 animate-[slideDown_0.2s_ease-out]">
                      {statusOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                              ? "bg-[#ff1e00]/10 text-[#ff1e00]"
                              : "text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <style>{`
                  @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden border-b border-gray-100 divide-y divide-gray-100">
            {camps.length === 0 ? (
              <div className="p-8 text-center bg-gray-50/50">
                <CalendarCheck className="mx-auto h-12 w-12 text-[#ff1e00] mb-4 opacity-20" />
                <p className="text-gray-500">No registered camps found</p>
                {/* Same logic as desktop for browsing camps if completely empty */}
                {(!searchTerm && statusFilter === "all") && (
                  <Link
                    to="/available-camps"
                    className="inline-flex items-center mt-4 text-[#ff1e00] hover:underline text-sm font-medium"
                  >
                    Browse Available Camps
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              camps.map((camp) => (
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
                  isCancelling={isCancelling}
                />
              ))
            )}
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
              isCancelling={isCancelling}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <span className="mx-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Last
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {totalCount} registrations total
            </div>
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
            isSubmitting={isSubmittingFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default RegisteredCamps;
