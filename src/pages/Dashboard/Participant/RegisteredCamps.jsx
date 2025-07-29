import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import {
  Calendar,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentDialog = ({
  open,
  onClose,
  camp,
  registration,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) return;

    try {
      // 1. Create payment intent
      const response = await fetch(
        "http://localhost:5000/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            amount: camp.fees * 100, // Convert to cents
            campId: camp._id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create payment intent");
      const { clientSecret } = await response.json();

      // 2. Confirm card payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.displayName || "Participant",
              email: user.email,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save payment to database
        const paymentResponse = await fetch("http://localhost:5000/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            campId: camp._id,
            registrationId: registration._id,
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert back to dollars
            paymentMethod: paymentIntent.payment_method_types[0],
          }),
        });

        if (!paymentResponse.ok)
          throw new Error("Failed to save payment record");
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        open ? "" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white rounded-t-3xl">
          <h3 className="text-xl font-bold">Pay for {camp?.name}</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">Amount Due:</span>
            <span className="text-2xl font-bold">${camp?.fees}</span>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="border border-gray-200 rounded-xl p-4 mb-6">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  isProcessing
                    ? "bg-blue-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } transition-all`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Processing...
                  </span>
                ) : (
                  `Pay $${camp?.fees}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RegisteredCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentCamp, setPaymentCamp] = useState(null);
  const [paymentRegistration, setPaymentRegistration] = useState(null);
  const { user } = useAuth();

  const fetchRegisteredCamps = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/camps-with-registrations/${user?.email}`
      );
      if (!response.ok) throw new Error("Failed to fetch registered camps");
      const data = await response.json();
      setCamps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchRegisteredCamps();
  }, [user?.email]);

  const handlePaymentSuccess = () => {
    fetchRegisteredCamps();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading registered camps
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (camps.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-8 text-center my-8">
        <CalendarCheck className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No registered camps found
        </h3>
        <p className="text-gray-500">
          Your registered medical camps will appear here once you sign up
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-4 w-4" />
            Paid
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-4 w-4" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertCircle className="mr-1 h-4 w-4" />
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              Registered Camps
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            View and manage your medical camp registrations
          </p>
        </div>

        {/* Camps Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Camp</th>
                  <th className="px-6 py-4 text-left">Date & Time</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Fees</th>
                  <th className="px-6 py-4 text-left">Professional</th>
                  <th className="px-6 py-4 text-left">Registered On</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {camps.map((camp) => (
                  <tr key={camp._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{camp.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(camp.dateTime), "MMM d, yyyy")} <br />
                      {format(new Date(camp.dateTime), "h:mm a")}
                    </td>

                    <td className="px-6 py-4">{camp.location}</td>
                    <td className="px-6 py-4 font-medium">${camp.fees}</td>
                    <td className="px-6 py-4">{camp.healthcareProfessional}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(
                        new Date(camp.participants[0]?.registrationDate),
                        "MMM d, yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(camp.participants[0]?.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {camp.participants[0]?.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => {
                            setPaymentCamp(camp);
                            setPaymentRegistration(camp.participants[0]);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};

export default RegisteredCamps;
