import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import useAuth from "../../../../hooks/useAuth";
import api from "../../../../api";

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
    const token = await user.getIdToken();

    try {
      const response = await api.post(
        `/create-payment-intent`,
        {
          amount: camp.fees,
          campId: camp._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret } = response.data;

      if (!clientSecret) {
        await api.post(`/payments`, {
          campId: camp._id,
          registrationId: registration._id,
          transactionId: `FREE_PAYMENT_${Date.now()}`,
          amount: 0,
          paymentMethod: "FREE",
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        await api.post(`/payments`, {
          campId: camp._id,
          registrationId: registration._id,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-[#59ce8f] mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Thank you for your payment.</p>
            <div className="bg-[#e8f9fd] p-4 rounded-xl mb-4">
              <p className="font-mono text-sm break-all text-gray-600">
                Transaction ID: {paymentIntent.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#ff1e00] text-white rounded-lg hover:bg-[#ff1e00]/90 transition-colors"
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="bg-[#ff1e00] p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Pay for {camp?.name}</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <span className="text-gray-600">Amount Due:</span>
            <span className="text-2xl font-bold text-[#ff1e00]">${camp?.fees}</span>
          </div>

          {error && (
            <div className="bg-[#ff1e00]/5 border-l-4 border-[#ff1e00] p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-[#ff1e00] mr-3" />
                <p className="text-gray-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-[#e8f9fd]/30">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1f2937",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-[#e8f9fd] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="px-4 py-2 rounded-lg text-white font-medium bg-[#ff1e00] hover:bg-[#ff1e00]/90 disabled:opacity-50 transition-colors"
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
    </div>
  );
};

export default PaymentDialog;