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
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const fetchAnalytics = async (uid, token) => {
  const res = await fetch(
    `https://mcms-server-red.vercel.app/analytics/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  const result = await res.json();
  return result.data || [];
};

const Analytics = () => {
  const { user } = useAuth();
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["analytics", user?.uid],
    queryFn: () => fetchAnalytics(user?.uid, user?.accessToken),
    enabled: !!user?.uid,
  });

  const chartData = data.map((camp) => ({
    name: camp.campName || "Unnamed Camp",
    fees: camp.fees || 0,
    date: camp.date ? new Date(camp.date).toLocaleDateString() : "N/A",
    status: camp.status || "Pending",
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">{label}</h3>
          <div className="space-y-1">
            <p className="flex items-center text-sm">
              <FaBangladeshiTakaSign className="mr-2 text-blue-600" size={14} />
              <span className="font-medium">Fees:</span> ${data.fees}
            </p>
            <p className="flex items-center text-sm">
              <Calendar className="mr-2 text-purple-600" size={14} />
              <span className="font-medium">Date:</span> {data.date}
            </p>
            <p className="flex items-center text-sm">
              <span className="mr-2 text-yellow-600">📌</span>
              <span className="font-medium">Status:</span> {data.status}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const FreeLabel = (props) => {
    const { x, y, width, value } = props;

    if (value !== 0) return null;

    return (
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fill="#16a34a"
        fontSize={10}
        fontWeight="600"
      >
        FREE
      </text>
    );
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
          No analytics found
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
            Visualize your medical camp payments and confirmations
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(59,130,246,0.08)" }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 8 }}
                />
                <Bar
                  dataKey="fees"
                  name="Camp Fees (৳)"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  label={<FreeLabel />}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#3b82f6"
                      stroke="#1d4ed8"
                      strokeWidth={0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaBangladeshiTakaSign
                  className="text-blue-600 mr-2"
                  size={20}
                />
                Total Fees
              </h3>
              <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                <FaBangladeshiTakaSign className="inline-block" />
                {chartData
                  .reduce((sum, camp) => sum + (camp.fees || 0), 0)
                  .toFixed(2)}
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
