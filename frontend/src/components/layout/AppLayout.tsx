import { NavLink, Outlet, useNavigate } from "react-router";

import { useAuth } from "../../context/useAuth";

type NavigationItem = {
  label: string;
  path: string;
};

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = (): NavigationItem[] => {
    if (user?.role === "admin") {
      return [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
        },
        {
          label: "Users",
          path: "/admin/users",
        },
        {
          label: "Stores",
          path: "/admin/stores",
        },
        {
          label: "Change Password",
          path: "/change-password",
        },
      ];
    }

    if (user?.role === "normal") {
      return [
        {
          label: "Stores",
          path: "/stores",
        },
        {
          label: "Change Password",
          path: "/change-password",
        },
      ];
    }

    return [
      {
        label: "Dashboard",
        path: "/store-owner/dashboard",
      },
      {
        label: "Change Password",
        path: "/change-password",
      },
    ];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Store Ratings</h1>

            <p className="text-xs text-zinc-500">{user?.name}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
