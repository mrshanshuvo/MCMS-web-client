import { Link } from "react-router";
import { SearchX, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F7F8] to-white px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#495E57]/10 p-6 rounded-full">
            <SearchX className="h-16 w-16 text-[#495E57]" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14] mb-4">
          404
        </h1>

        {/* Message */}
        <p className="text-2xl font-semibold text-[#45474B] mb-3">
          Page Not Found
        </p>
        <p className="text-[#45474B]/60 mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group"
          >
            <Home className="mr-2 group-hover:scale-110 transition-transform duration-200" size={18} />
            Go Back Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-[#495E57]/20 text-[#45474B] rounded-xl font-medium hover:bg-[#495E57]/5 transition-all duration-200 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
