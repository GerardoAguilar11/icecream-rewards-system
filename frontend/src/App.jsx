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

import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";

import NotFound from "./pages/NotFound";

import AdminLayout from "./components/layout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================
            Public Routes
        ========================== */}

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


        {/* ==========================
            Customer Routes
        ========================== */}

        <Route
          path="/customer"
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
              ]}
            >
              <CustomerHome />
            </ProtectedRoute>
          }
        />


        {/* ==========================
            Admin + Employee Routes
        ========================== */}

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


          <Route
            path="/products"
            element={<Products />}
          />

        </Route>


        {/* ==========================
            Admin Only Routes
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
              ]}
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


          <Route
            path="/products/new"
            element={<ProductForm />}
          />


          <Route
            path="/products/:id/edit"
            element={<ProductForm />}
          />

        </Route>


        {/* ==========================
            Not Found
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;