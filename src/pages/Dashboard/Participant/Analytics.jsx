import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["participant-registrations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/participants/registrations");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading analytics...</p>;

  // Aggregate fees per camp
  const chartData = registrations.map((reg) => ({
    name: reg.camp?.name || "Unknown Camp",
    fees: reg.camp?.fees || 0,
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Registered Camps Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fees" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
