import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router";
import { getUsers } from "../../api/adminApi";
import type { ApiError } from "../../types/api";
import type { AdminUser, GetUsersParams } from "../../types/admin";

type SortField = "name" | "email" | "address" | "role" | "createdAt";

type SortOrder = "asc" | "desc";

function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<"admin" | "normal" | "">("");

  const [sortBy, setSortBy] = useState<SortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError("");

      const params: GetUsersParams = {
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

      if (role) {
        params.role = role;
      }

      try {
        const response = await getUsers(params);
        setUsers(response.data.users);
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data?.message || "Unable to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      loadUsers();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [name, email, address, role, sortBy, sortOrder]);

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
    setRole("");
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Users</h2>
          <p className="mt-2 text-sm text-zinc-500">Manage normal users and administrators.</p>
        </div>

        <Link
          to="/admin/users/add"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Add User
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "admin" | "normal" | "")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
          >
            <option value="">All roles</option>
            <option value="normal">Normal User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
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
                    onClick={() => handleSort("role")}
                    className="font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Role{getSortIndicator("role")}
                  </button>
                </th>

                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-zinc-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-900">{user.name}</td>

                    <td className="px-5 py-4 text-zinc-600">{user.email}</td>

                    <td className="max-w-xs truncate px-5 py-4 text-zinc-600">{user.address}</td>

                    <td className="px-5 py-4 text-zinc-600">
                      {user.role === "admin" ? "Administrator" : "Normal User"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="text-sm font-medium text-zinc-900 underline underline-offset-4"
                      >
                        View
                      </Link>
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

export default Users;
