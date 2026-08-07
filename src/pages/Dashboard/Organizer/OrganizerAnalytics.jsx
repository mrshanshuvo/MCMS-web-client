import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../../components/Common/SEO';

const OrganizerAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [downloadingRegs, setDownloadingRegs] = useState(false);
  const [downloadingPayments, setDownloadingPayments] = useState(false);

  const { data: overviewRes, isLoading } = useQuery({
    queryKey: ['organizerOverview'],
    queryFn: async () => {
      const res = await axiosSecure.get('/analytics/organizer/overview');
      return res.data;
    },
  });

  const summary = overviewRes?.data?.summary || {};
  const monthlyRevenue = overviewRes?.data?.monthlyRevenue || [];
  const campsBreakdown = overviewRes?.data?.campsBreakdown || [];

  const formattedChartData = monthlyRevenue.map((item) => ({
    name: `${item.year}-${String(item.month).padStart(2, '0')}`,
    revenue: item.revenue,
    transactions: item.transactions,
  }));

  const handleDownloadRegistrationsCSV = async () => {
    try {
      setDownloadingRegs(true);
      const res = await axiosSecure.get('/analytics/export/registrations', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'registrations.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Registrations CSV downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export registrations CSV');
    } finally {
      setDownloadingRegs(false);
    }
  };

  const handleDownloadPaymentsCSV = async () => {
    try {
      setDownloadingPayments(true);
      const res = await axiosSecure.get('/analytics/export/payments', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payments.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payments CSV downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export payments CSV');
    } finally {
      setDownloadingPayments(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading analytics dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <SEO
        title="Organizer Analytics"
        description="View camp performance, revenue metrics, and export data."
      />
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Organizer Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of camp registrations, revenue metrics, and export tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadRegistrationsCSV}
            disabled={downloadingRegs}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Download size={16} />
            {downloadingRegs ? 'Downloading...' : 'Export Registrations CSV'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPaymentsCSV}
            disabled={downloadingPayments}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Download size={16} />
            {downloadingPayments ? 'Downloading...' : 'Export Payments CSV'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Camps</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.totalCamps || 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Registrations</p>
            <h3 className="text-2xl font-bold text-gray-800 font-numeric">
              {summary.totalRegistrations || 0}
            </h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Paid Registrations</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.paidCount || 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800">${summary.totalRevenue || 0}</h3>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue Trends</h3>
        {formattedChartData.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No completed payment transactions yet to render chart.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Camps Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Camps Performance Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Camp Name</th>
                <th className="px-6 py-3.5 font-semibold">Camp Fees</th>
                <th className="px-6 py-3.5 font-semibold">Participants Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campsBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    No camps found
                  </td>
                </tr>
              ) : (
                campsBreakdown.map((camp) => (
                  <tr key={camp.campId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{camp.campName}</td>
                    <td className="px-6 py-4">${camp.fees}</td>
                    <td className="px-6 py-4">{camp.participantCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerAnalytics;
