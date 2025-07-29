import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
