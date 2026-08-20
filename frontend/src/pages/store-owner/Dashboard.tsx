import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getStoreOwnerDashboard } from "../../api/storeOwnerApi";
import type { ApiError } from "../../types/api";
import type { StoreOwnerDashboard, StoreRater } from "../../types/storeOwner";

type SortField = "name" | "email" | "rating" | "ratedAt";
type SortOrder = "asc" | "desc";

function Dashboard() {
  const [dashboard, setDashboard] = useState<StoreOwnerDashboard | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState<SortField>("ratedAt");

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getStoreOwnerDashboard();

        setDashboard(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;

        setError(axiosError.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder((currentOrder) => (currentOrder === "asc" ? "desc" : "asc"));

      return;
    }

    setSortBy(field);
    setSortOrder("asc");
  };

  const getSortIndicator = (field: SortField) => {
    if (field !== sortBy) {
      return "";
    }

    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const getSortedRaters = () => {
    if (!dashboard) {
      return [];
    }

    return [...dashboard.raters].sort((firstRater, secondRater) => {
      const firstValue = firstRater[sortBy];
      const secondValue = secondRater[sortBy];

      if (sortBy === "rating") {
        return sortOrder === "asc"
          ? Number(firstValue) - Number(secondValue)
          : Number(secondValue) - Number(firstValue);
      }

      if (sortBy === "ratedAt") {
        const firstDate = new Date(firstValue as string).getTime();

        const secondDate = new Date(secondValue as string).getTime();

        return sortOrder === "asc" ? firstDate - secondDate : secondDate - firstDate;
      }

      const comparison = String(firstValue).localeCompare(String(secondValue));

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>

        <p className="mt-4 text-sm text-zinc-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>

        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Unable to load dashboard."}
        </p>
      </div>
    );
  }

  const sortedRaters = getSortedRaters();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>

        <p className="mt-2 text-sm text-zinc-500">Overview of your store and customer ratings.</p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Your Store</p>

          <h3 className="mt-3 text-xl font-semibold text-zinc-900">{dashboard.store.name}</h3>

          <p className="mt-2 text-sm text-zinc-500">{dashboard.store.address}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Average Rating</p>

          <p className="mt-3 text-4xl font-semibold text-zinc-900">
            {Number(dashboard.averageRating).toFixed(1)}
            <span className="ml-1 text-lg font-medium text-zinc-400">/ 5</span>
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Based on {dashboard.raters.length}{" "}
            {dashboard.raters.length === 1 ? "rating" : "ratings"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Users Who Rated Your Store</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Name{getSortIndicator("name")}
                  </button>
                </th>

                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("email")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Email{getSortIndicator("email")}
                  </button>
                </th>

                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("rating")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Rating{getSortIndicator("rating")}
                  </button>
                </th>

                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("ratedAt")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Rated On{getSortIndicator("ratedAt")}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedRaters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-500">
                    No ratings submitted yet.
                  </td>
                </tr>
              ) : (
                sortedRaters.map((rater: StoreRater) => (
                  <tr key={rater.userId} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-900">{rater.name}</td>

                    <td className="px-5 py-4 text-zinc-600">{rater.email}</td>

                    <td className="px-5 py-4 text-zinc-600">{rater.rating}</td>

                    <td className="px-5 py-4 text-zinc-600">{formatDate(rater.ratedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
