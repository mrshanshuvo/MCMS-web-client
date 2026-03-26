import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#59ce8f]/10 text-[#59ce8f]">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#ff1e00]/10 text-[#ff1e00]">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <AlertCircle className="mr-1 h-3 w-3" />
          Unpaid
        </span>
      );
  }
};

export default StatusBadge;