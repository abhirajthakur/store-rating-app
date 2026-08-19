import { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";
import { createUser } from "../../api/adminApi";
import type { ApiError } from "../../types/api";
import type { CreateUserInput } from "../../types/admin";

type UserRole = CreateUserInput["role"];

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("normal");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value: string) => {
    return (
      value.length >= 8 &&
      value.length <= 16 &&
      /[A-Z]/.test(value) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(value)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();

    if (trimmedName.length < 20 || trimmedName.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }

    if (trimmedAddress.length > 400) {
      setError("Address cannot exceed 400 characters.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be 8-16 characters and include at least one uppercase letter and one special character.",
      );
      return;
    }

    setIsLoading(true);

    try {
      await createUser({
        name: trimmedName,
        email: trimmedEmail,
        address: trimmedAddress,
        password,
        role,
      });

      navigate("/admin/users", {
        replace: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || "Unable to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Add User</h2>
          <p className="mt-2 text-sm text-zinc-500">Create a new user account.</p>
        </div>

        <Link
          to="/admin/users"
          className="text-sm font-medium text-zinc-600 underline underline-offset-4 transition hover:text-zinc-900"
        >
          Back to users
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter full name"
              minLength={20}
              maxLength={60}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
            <p className="mt-2 text-xs text-zinc-500">Must be between 20 and 60 characters.</p>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-zinc-700">
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter address"
              maxLength={400}
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-zinc-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
            >
              <option value="normal">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              minLength={8}
              maxLength={16}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Use 8-16 characters with at least one uppercase letter and one special character.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to="/admin/users"
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating user..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
