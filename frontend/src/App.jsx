import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerEdit from "./pages/CustomerEdit";
import CustomerHome from "./pages/CustomerHome";

import NotFound from "./pages/NotFound";

import AdminLayout from "./components/layout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />


        <Route
          path="/customer"
          element={
            <ProtectedRoute
              allowedRoles={["CUSTOMER"]}
            >
              <CustomerHome />
            </ProtectedRoute>
          }
        />


        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "EMPLOYEE",
              ]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/customers/:id"
            element={<CustomerDetail />}
          />

        </Route>


        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers/:id/edit"
            element={<CustomerEdit />}
          />

        </Route>


        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;