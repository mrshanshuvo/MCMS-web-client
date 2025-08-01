import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="mr-1 h-3 w-3" />
          Unpaid
        </span>
      );
  }
};

export default StatusBadge;
