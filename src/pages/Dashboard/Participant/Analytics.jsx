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
import { Calendar, Loader2, AlertCircle, Activity, MapPin, TrendingUp } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import api from "../../../api";

const fetchAnalytics = async (uid, token) => {
  const res = await api.get(
    `/analytics/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data || [];
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
    queryFn: async () => {
      const token = user ? await user.getIdToken() : null;
      return fetchAnalytics(user?.uid, token);
    },
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
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
          <div className="space-y-2">
            <p className="flex items-center text-sm">
              <FaBangladeshiTakaSign className="mr-2 text-[#ff1e00]" size={14} />
              <span className="font-medium text-gray-600">Fees:</span>
              <span className="ml-1 text-[#ff1e00] font-semibold">${data.fees}</span>
            </p>
            <p className="flex items-center text-sm">
              <Calendar className="mr-2 text-[#59ce8f]" size={14} />
              <span className="font-medium text-gray-600">Date:</span>
              <span className="ml-1 text-gray-700">{data.date}</span>
            </p>
            <p className="flex items-center text-sm">
              <MapPin className="mr-2 text-[#ff1e00]/70" size={14} />
              <span className="font-medium text-gray-600">Status:</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${data.status === "Confirmed"
                ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                : "bg-gray-100 text-gray-600"
                }`}>
                {data.status}
              </span>
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
        fill="#59ce8f"
        fontSize={10}
        fontWeight="600"
      >
        FREE
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
        <Loader2 className="animate-spin h-12 w-12 text-[#ff1e00] mb-4" />
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#ff1e00]/5 border-l-4 border-[#ff1e00] p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-[#ff1e00] mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Error loading analytics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {error.message || "Please try again later"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-[#e8f9fd] rounded-xl p-12 text-center border border-gray-100">
        <Calendar className="mx-auto h-12 w-12 text-[#ff1e00] mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No analytics found
        </h3>
        <p className="text-gray-500">
          Your analytics will appear here once you register for medical camps
        </p>
        <button
          onClick={() => window.location.href = "/available-camps"}
          className="mt-4 px-6 py-2 bg-[#ff1e00] text-white rounded-lg text-sm font-medium hover:bg-[#ff1e00]/90 transition-colors"
        >
          Browse Available Camps
        </button>
      </div>
    );
  }

  const totalFees = chartData.reduce((sum, camp) => sum + (camp.fees || 0), 0);
  const totalCamps = chartData.length;

  return (
    <div className="min-h-screen bg-[#e8f9fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Your <span className="text-[#ff1e00]">Participation Insights</span>
          </h1>
          <p className="text-lg text-gray-600">
            Visualize your medical camp payments and registrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaBangladeshiTakaSign size={20} className="text-[#ff1e00]" />
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Fees</h3>
              </div>
              <TrendingUp size={18} className="text-[#59ce8f]" />
            </div>
            <p className="text-3xl font-bold text-gray-900 flex items-center gap-1">
              <FaBangladeshiTakaSign size={24} className="text-[#ff1e00]" />
              {totalFees.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-[#ff1e00]" />
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Camps Registered</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totalCamps}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f9fd" />
                <XAxis
                  dataKey="name"
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#e8f9fd" }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 8 }}
                  formatter={() => <span className="text-gray-600 text-sm">Camp Fees (USD)</span>}
                />
                <Bar
                  dataKey="fees"
                  name="Camp Fees"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  label={<FreeLabel />}
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={item.fees === 0 ? "#59ce8f" : "#ff1e00"}
                      stroke="none"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;