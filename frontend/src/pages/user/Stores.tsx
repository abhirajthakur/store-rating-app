import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getStores, submitRating, updateRating } from "../../api/storeApi";
import type { ApiError } from "../../types/api";
import type { GetStoresParams, UserStore } from "../../types/store";

type SortField = "name" | "address" | "rating";
type SortOrder = "asc" | "desc";

function Stores() {
  const [stores, setStores] = useState<UserStore[]>([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});

  const [error, setError] = useState("");
  const [ratingError, setRatingError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [submittingStoreId, setSubmittingStoreId] = useState<string | null>(null);

  const loadStores = async () => {
    setError("");

    const params: GetStoresParams = {
      sortBy,
      sortOrder,
    };

    if (name.trim()) {
      params.name = name.trim();
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

  useEffect(() => {
    // Debouncing
    const timeoutId = window.setTimeout(() => {
      void loadStores();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [name, address, sortBy, sortOrder]);

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

  const handleRatingChange = (storeId: string, rating: number) => {
    setSelectedRatings((currentRatings) => ({
      ...currentRatings,
      [storeId]: rating,
    }));

    setRatingError("");
  };

  const handleSubmitRating = async (store: UserStore) => {
    const selectedRating = selectedRatings[store.id];

    if (!selectedRating) {
      setRatingError("Please select a rating between 1 and 5.");
      return;
    }

    setRatingError("");
    setSubmittingStoreId(store.id);

    try {
      if (store.userRating === null) {
        await submitRating(store.id, {
          rating: selectedRating,
        });
      } else {
        await updateRating(store.id, {
          rating: selectedRating,
        });
      }

      setSelectedRatings((currentRatings) => {
        const updatedRatings = { ...currentRatings };

        delete updatedRatings[store.id];

        return updatedRatings;
      });

      await loadStores();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      setRatingError(axiosError.response?.data?.message || "Unable to submit rating.");
    } finally {
      setSubmittingStoreId(null);
    }
  };

  const clearFilters = () => {
    setName("");
    setAddress("");
  };

  const getSelectedRating = (store: UserStore) => {
    return selectedRatings[store.id] ?? store.userRating ?? "";
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-900">Stores</h2>

        <p className="mt-2 text-sm text-zinc-500">Browse stores and submit your ratings.</p>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Search Stores</h3>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            Clear filters
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Search by store name"
            className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          />

          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Search by address"
            className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          />
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {ratingError && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {ratingError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Store Name
                    {getSortIndicator("name")}
                  </button>
                </th>

                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("address")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Address
                    {getSortIndicator("address")}
                  </button>
                </th>

                <th className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("rating")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Overall Rating
                    {getSortIndicator("rating")}
                  </button>
                </th>

                <th className="px-5 py-4 font-semibold text-zinc-700">Your Rating</th>

                <th className="px-5 py-4 font-semibold text-zinc-700">Rate Store</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-zinc-500">
                    Loading stores...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-zinc-500">
                    No stores found.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-900">{store.name}</td>

                    <td className="max-w-xs px-5 py-4 text-zinc-600">{store.address}</td>

                    <td className="px-5 py-4 text-zinc-600">
                      {Number(store.overallRating).toFixed(1)}
                    </td>

                    <td className="px-5 py-4 text-zinc-600">
                      {store.userRating === null
                        ? "Not rated"
                        : Number(store.userRating).toFixed(0)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          value={getSelectedRating(store)}
                          onChange={(event) =>
                            handleRatingChange(store.id, Number(event.target.value))
                          }
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
                        >
                          <option value="">Select</option>

                          {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleSubmitRating(store)}
                          disabled={submittingStoreId === store.id}
                          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submittingStoreId === store.id
                            ? "Saving..."
                            : store.userRating === null
                              ? "Submit"
                              : "Update"}
                        </button>
                      </div>
                    </td>
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
