import { AxiosError } from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import type { ApiError } from "../types/api";
import { getRedirectPath } from "../utils/redirectByRole";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  if (user && token) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      login(newToken, newUser);

      navigate(getRedirectPath(newUser.role), {
        replace: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      setError(axiosError.response?.data?.message || "Unable to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Store Ratings</h1>

          <p className="mt-2 text-sm text-zinc-500">Sign in to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-700">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-zinc-900 underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
