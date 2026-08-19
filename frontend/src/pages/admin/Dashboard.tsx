import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getDashboardStats } from "../../api/adminApi";
import type { ApiError } from "../../types/api";
import type { DashboardStats } from "../../types/admin";

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="mt-4 text-sm text-zinc-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  const dashboardCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
    },
    {
      label: "Total Stores",
      value: stats?.totalStores ?? 0,
    },
    {
      label: "Total Ratings",
      value: stats?.totalRatings ?? 0,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="mt-2 text-sm text-zinc-500">Overview of your platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
