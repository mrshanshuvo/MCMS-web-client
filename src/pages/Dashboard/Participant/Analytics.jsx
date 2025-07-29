import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  Calendar,
  Users,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";

const fetchRegisteredCamps = async (email) => {
  const res = await fetch(
    `http://localhost:5000/camps-with-registrations/${email}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch camps data");
  }
  return res.json();
};

const Analytics = () => {
  const { user } = useAuth();
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["registeredCamps", user?.email],
    queryFn: () => fetchRegisteredCamps(user.email),
    enabled: !!user?.email,
  });

  // Prepare chart data
  const chartData = data.map((camp) => ({
    name: camp.campName || camp.name || "Unnamed Camp",
    fees: camp.fees || camp.campFees || 0,
    participantsCount: camp.participantCount || 0,
    date: camp.dateTime ? new Date(camp.dateTime).toLocaleDateString() : "N/A",
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">{label}</h3>
          <div className="space-y-1">
            <p className="flex items-center text-sm">
              <DollarSign className="mr-2 text-blue-600" size={14} />
              <span className="font-medium">Fees:</span> ${data.fees}
            </p>
            <p className="flex items-center text-sm">
              <Users className="mr-2 text-teal-600" size={14} />
              <span className="font-medium">Participants:</span>{" "}
              {data.participantsCount}
            </p>
            <p className="flex items-center text-sm">
              <Calendar className="mr-2 text-purple-600" size={14} />
              <span className="font-medium">Date:</span> {data.date}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-xl border border-gray-100">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading analytics
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error.message || "Please try again later"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-blue-50 rounded-xl p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No registered camps found
        </h3>
        <p className="text-gray-500">
          Your analytics will appear here once you register for medical camps
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Medical Camp Analytics
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Participation Insights
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Visualize your medical camp registrations and participation trends
          </p>
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="fees" name="Camp Fees ($)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#3b82f6" // Blue-500
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="participantsCount"
                  name="Participants"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#10b981" // Emerald-500
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <DollarSign className="text-blue-600 mr-2" size={20} />
                Total Fees
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                $
                {chartData.reduce((sum, camp) => sum + camp.fees, 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="text-teal-600 mr-2" size={20} />
                Total Participants
              </h3>
              <p className="text-2xl font-bold text-teal-600">
                {chartData.reduce(
                  (sum, camp) => sum + camp.participantsCount,
                  0
                )}
              </p>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="text-purple-600 mr-2" size={20} />
                Camps Registered
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {chartData.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
