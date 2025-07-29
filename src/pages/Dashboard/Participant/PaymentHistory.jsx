// PaymentHistory.jsx
import React from "react";

const PaymentHistory = ({ payments }) => {
  return (
    <div>
      <h2>Payment History</h2>
      <table>
        <thead>
          <tr>
            <th>Camp Name</th>
            <th>Fees</th>
            <th>Payment Status</th>
            <th>Confirmation Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.campName}</td>
              <td>{payment.fees}</td>
              <td>{payment.paid ? "Paid" : "Unpaid"}</td>
              <td>{payment.confirmationStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
