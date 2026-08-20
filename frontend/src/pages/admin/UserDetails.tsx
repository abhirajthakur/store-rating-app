import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getUserById } from "../../api/adminApi";
import type { AdminUserDetail } from "../../types/admin";
import type { ApiError } from "../../types/api";

function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadUser = async () => {
      try {
        const response = await getUserById(id);

        setUser(response.data.user);
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;

        setError(axiosError.response?.data?.message || "Unable to load user details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const getRoleLabel = (role: AdminUserDetail["role"]) => {
    if (role === "admin") {
      return "Administrator";
    }

    if (role === "store_owner") {
      return "Store Owner";
    }

    return "Normal User";
  };

  if (!id) {
    return (
      <div>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">User Details</h2>
          </div>

          <Link
            to="/admin/users"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition hover:text-zinc-900"
          >
            Back to users
          </Link>
        </div>

        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          User ID is missing.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">User Details</h2>

        <p className="mt-4 text-sm text-zinc-500">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">User Details</h2>
          </div>

          <Link
            to="/admin/users"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition hover:text-zinc-900"
          >
            Back to users
          </Link>
        </div>

        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "User not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">User Details</h2>

          <p className="mt-2 text-sm text-zinc-500">View account information.</p>
        </div>

        <Link
          to="/admin/users"
          className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition hover:text-zinc-900"
        >
          Back to users
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="divide-y divide-zinc-100">
          <div className="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4">
            <p className="text-sm font-medium text-zinc-500">Name</p>

            <p className="text-sm font-medium text-zinc-900 sm:col-span-2">{user.name}</p>
          </div>

          <div className="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4">
            <p className="text-sm font-medium text-zinc-500">Email</p>

            <p className="break-all text-sm font-medium text-zinc-900 sm:col-span-2">
              {user.email}
            </p>
          </div>

          <div className="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4">
            <p className="text-sm font-medium text-zinc-500">Address</p>

            <p className="whitespace-pre-wrap text-sm font-medium text-zinc-900 sm:col-span-2">
              {user.address}
            </p>
          </div>

          <div className="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4">
            <p className="text-sm font-medium text-zinc-500">Role</p>

            <p className="text-sm font-medium text-zinc-900 sm:col-span-2">
              {getRoleLabel(user.role)}
            </p>
          </div>

          {user.role === "store_owner" && (
            <div className="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4">
              <p className="text-sm font-medium text-zinc-500">Store Rating</p>

              <p className="text-sm font-medium text-zinc-900 sm:col-span-2">
                {user.rating !== undefined ? Number(user.rating).toFixed(1) : "No store assigned"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
