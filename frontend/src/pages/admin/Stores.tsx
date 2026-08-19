import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getStores } from "../../api/adminApi";
import type { AdminStore, GetStoresParams } from "../../types/admin";
import type { ApiError } from "../../types/api";

type SortField = "name" | "email" | "address" | "rating" | "createdAt";

type SortOrder = "asc" | "desc";

function Stores() {
  const [stores, setStores] = useState<AdminStore[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [sortBy, setSortBy] = useState<SortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      setError("");

      const params: GetStoresParams = {
        sortBy,
        sortOrder,
      };

      if (name.trim()) {
        params.name = name.trim();
      }

      if (email.trim()) {
        params.email = email.trim();
      }

      if (address.trim()) {
        params.address = address.trim();
      }

      try {
        const response = await getStores(params);
        setStores(response.data.stores);
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data?.message || "Unable to load stores.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      loadStores();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [name, email, address, sortBy, sortOrder]);

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

  const clearFilters = () => {
    setName("");
    setEmail("");
    setAddress("");
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Stores</h2>
          <p className="mt-2 text-sm text-zinc-500">View and manage registered stores.</p>
        </div>

        <Link
          to="/admin/stores/add"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Add Store
        </Link>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Filters</h3>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            Clear filters
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Filter by name"
            className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          />

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Filter by email"
            className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          />

          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Filter by address"
            className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          />
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-12.5 text-left text-sm">
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
                    onClick={() => handleSort("address")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Address{getSortIndicator("address")}
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
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-500">
                    Loading stores...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-500">
                    No stores found.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-900">{store.name}</td>
                    <td className="px-5 py-4 text-zinc-600">{store.email}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-zinc-600">{store.address}</td>
                    <td className="px-5 py-4 text-zinc-600">{formatRating(store.rating)}</td>
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

export default Stores;
