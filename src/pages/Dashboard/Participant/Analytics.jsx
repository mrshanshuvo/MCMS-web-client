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
  Cell,
} from "recharts";
import {
  Calendar,
  Loader2,
  AlertCircle,
  Activity,
  TrendingUp,
  ChevronRight,
  Info
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import api from "../../../api";

const fetchAnalytics = async (uid, token) => {
  const res = await api.get(`/analytics/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
    totalFees: camp.fees || 0,
    date: camp.date ? new Date(camp.date).toLocaleDateString() : "N/A",
    status: camp.status || "Pending",
  }));

  const totalFees = chartData.reduce((sum, camp) => sum + (camp.totalFees || 0), 0);
  const totalCamps = chartData.length;

  const FreeLabel = (props) => {
    const { x, y, width, value } = props;
    if (value !== 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fill="#59ce8f"
        fontSize={10}
        fontWeight="bold"
        className="uppercase"
      >
        FREE
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const toolData = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-w-[200px]">
          <h3 className="font-bold text-gray-900 mb-2 truncate border-b border-gray-50 pb-2">{label}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium uppercase tracking-wider">Fees:</span>
              <span className="text-[#ff1e00] font-bold">${toolData.totalFees}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium uppercase tracking-wider">Date:</span>
              <span className="text-gray-700 font-semibold">{toolData.date}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 mt-1 border-t border-gray-50">
              <span className="text-gray-500 font-medium uppercase tracking-wider">Status:</span>
              <span className={toolData.status === "Confirmed" ? "text-green-600 font-bold" : "text-gray-400 font-bold"}>
                {toolData.status}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10 text-[#ff1e00]" />
        <p className="text-gray-500 mt-4 font-medium animate-pulse">Loading your analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-[#ff1e00]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load analytics</h3>
          <p className="text-gray-600 mb-6">{error.message || "Something went wrong while fetching data."}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#ff1e00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ff1e00]/90 transition-all cursor-pointer shadow-lg shadow-red-100"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center p-12 bg-white rounded-3xl shadow-sm max-w-lg w-full border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Activity className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No data yet</h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your medical camp participation analytics will appear here once you start registering for camps.
          </p>
          <button
            onClick={() => window.location.href = "/available-camps"}
            className="inline-flex items-center gap-2 bg-[#ff1e00] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#ff1e00]/90 transition-all cursor-pointer shadow-lg shadow-red-100"
          >
            Browse Available Camps <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">Engagement Insights</h1>
        <p className="mt-2 text-base text-gray-500 font-medium tracking-tight">Tracking your contributions and healthcare journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column: Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
              <TrendingUp className="text-[#ff1e00]" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Summary</h2>
            </div>

            <div className="space-y-4">
              <SummaryItem
                icon={<FaBangladeshiTakaSign size={20} />}
                label="Total Fees"
                value={`$${totalFees.toFixed(2)}`}
                color="bg-[#ff1e00]"
              />
              <SummaryItem
                icon={<Calendar size={20} />}
                label="Registered"
                value={totalCamps}
                color="bg-gray-900"
              />
            </div>
          </div>

          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="p-2 bg-white text-[#ff1e00] rounded-xl shadow-sm border border-gray-100 mt-1">
              <Info size={18} />
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              These insights help you track your history and upcoming registrations in our medical network.
            </p>
          </div>
        </div>

        {/* Right column: Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Activity className="text-[#ff1e00]" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Contribution Trend</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff1e00]"></span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Fees In USD</span>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={700}>
                          {payload.value.length > 10 ? `${payload.value.substring(0, 9)}...` : payload.value}
                        </text>
                      </g>
                    )}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255, 30, 0, 0.04)", radius: 10 }}
                  />
                  <Bar
                    dataKey="totalFees"
                    radius={[10, 10, 0, 0]}
                    barSize={36}
                    label={<FreeLabel />}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.totalFees === 0 ? "#59ce8f" : "#ff1e00"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const SummaryItem = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:border-[#ff1e00]/20 transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${color} text-white rounded-xl shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
    <span className="text-xl font-black text-gray-900 group-hover:text-[#ff1e00] transition-colors">{value}</span>
  </div>
);

export default Analytics;