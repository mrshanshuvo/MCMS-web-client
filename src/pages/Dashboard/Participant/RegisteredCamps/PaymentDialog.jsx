import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import useAuth from "../../../../hooks/useAuth";

const PaymentDialog = ({
  open,
  onClose,
  camp,
  registration,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) return;
    const token = user.accessToken;

    try {
      const response = await fetch(
        `https://mcms-server-red.vercel.app/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: camp.fees,
            campId: camp._id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create payment intent");
      const { clientSecret } = await response.json();

      // ✅ Handle free camp (no payment intent needed)
      if (!clientSecret) {
        await fetch(`https://mcms-server-red.vercel.app/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campId: camp._id,
            registrationId: registration._id,
            transactionId: `FREE_PAYMENT_${Date.now()}`,
            amount: 0,
            paymentMethod: "FREE",
          }),
        });

        setPaymentIntent({ status: "succeeded", id: "FREE_PAYMENT" });
        onPaymentSuccess();
        setIsProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setPaymentIntent(paymentIntent);
        await fetch(`https://mcms-server-red.vercel.app/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campId: camp._id,
            registrationId: registration._id,
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount,
          }),
        });
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  if (paymentIntent?.status === "succeeded") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="mb-4">Thank you for your payment.</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm break-all">
                Transaction ID: {paymentIntent.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white rounded-t-3xl -m-6 mb-6">
          <h3 className="text-xl font-bold">Pay for {camp?.name}</h3>
        </div>

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
                },
              }}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isProcessing
                  ? "bg-blue-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
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
  );
};

export default PaymentDialog;
