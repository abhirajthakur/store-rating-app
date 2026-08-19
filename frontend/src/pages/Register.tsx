import { useState } from "react";
import { AxiosError } from "axios";
import { Link, Navigate, useNavigate } from "react-router";

import { registerUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import type { ApiError } from "../types/api";
import { getRedirectPath } from "../utils/redirectByRole";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  if (user && token) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim().length < 20 || name.trim().length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }

    if (address.trim().length > 400) {
      setError("Address cannot exceed 400 characters.");
      return;
    }

    if (
      password.length < 8 ||
      password.length > 16 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      setError(
        "Password must be 8-16 characters and include an uppercase letter and special character.",
      );
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      window.setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      setError(
        axiosError.response?.data?.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Create an account</h1>

          <p className="mt-2 text-sm text-zinc-500">Register to start rating stores.</p>
        </div>

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
              placeholder="Enter your full name"
              minLength={20}
              maxLength={60}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
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
              placeholder="you@example.com"
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
              placeholder="Enter your address"
              maxLength={400}
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
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
              placeholder="8-16 characters"
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
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-zinc-900 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
