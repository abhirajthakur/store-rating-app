import { Route, Routes } from "react-router";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AddStore from "./pages/admin/AddStore";
import AddUser from "./pages/admin/AddUser";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStores from "./pages/admin/Stores";
import UserDetails from "./pages/admin/UserDetails";
import AdminUsers from "./pages/admin/Users";

import OwnerDashboard from "./pages/owner/Dashboard";
import UserStores from "./pages/user/Stores";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/change-password" element={<ChangePassword />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/stores" element={<AdminStores />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/stores/add" element={<AddStore />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["normal"]} />}>
            <Route path="/stores" element={<UserStores />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["store_owner"]} />}>
            <Route path="/store-owner/dashboard" element={<OwnerDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
