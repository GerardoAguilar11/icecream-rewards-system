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

import Employees from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";

import CustomerHome from "./pages/CustomerHome";
import CustomerRewards from "./pages/CustomerRewards";
import CustomerRedemptions from "./pages/CustomerRedemptions";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerPurchases from "./pages/CustomerPurchases";
import CustomerPurchaseDetail
  from "./pages/CustomerPurchaseDetail";

import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";

import Purchases from "./pages/Purchases";
import PurchaseCreate from "./pages/PurchaseCreate";
import PurchaseDetail from "./pages/PurchaseDetail";

import Rewards from "./pages/Rewards";
import RewardForm from "./pages/RewardForm";

import PointsSettings
  from "./pages/PointsSettings";

import NotFound from "./pages/NotFound";

import AdminLayout
  from "./components/layout/AdminLayout";

import CustomerLayout
  from "./components/layout/CustomerLayout";

import ProtectedRoute
  from "./routes/ProtectedRoute";

import PublicRoute
  from "./routes/PublicRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================
            PUBLIC
        ========================== */}

        <Route
          path="/"
          element={
            <Home />
          }
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
            CUSTOMER
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
              ]}
            >
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/customer"
            element={
              <CustomerHome />
            }
          />

          <Route
            path="/customer/rewards"
            element={
              <CustomerRewards />
            }
          />

          <Route
            path="/customer/redemptions"
            element={
              <CustomerRedemptions />
            }
          />

          <Route
            path="/customer/purchases"
            element={
              <CustomerPurchases />
            }
          />

          <Route
            path="/customer/purchases/:id"
            element={
              <CustomerPurchaseDetail />
            }
          />

          <Route
            path="/customer/profile"
            element={
              <CustomerProfile />
            }
          />
        </Route>


        {/* ==========================
            ADMIN + EMPLOYEE
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

          {/* Customers */}

          <Route
            path="/customers"
            element={
              <Customers />
            }
          />

          <Route
            path="/customers/:id"
            element={
              <CustomerDetail />
            }
          />

          <Route
            path="/customers/:id/edit"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                ]}
              >
                <CustomerEdit />
              </ProtectedRoute>
            }
          />


          {/* Products */}

          <Route
            path="/products"
            element={
              <Products />
            }
          />


          {/* Purchases */}

          <Route
            path="/purchases"
            element={
              <Purchases />
            }
          />

          <Route
            path="/purchases/new"
            element={
              <PurchaseCreate />
            }
          />

          <Route
            path="/purchases/:id"
            element={
              <PurchaseDetail />
            }
          />


          {/* Rewards */}

          <Route
            path="/rewards"
            element={
              <Rewards />
            }
          />
        </Route>


        {/* ==========================
            ADMIN ONLY
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

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />


          {/* Employees */}

          <Route
            path="/employees"
            element={
              <Employees />
            }
          />

          <Route
            path="/employees/new"
            element={
              <EmployeeForm />
            }
          />

          <Route
            path="/employees/:id/edit"
            element={
              <EmployeeForm />
            }
          />


          {/* Products */}

          <Route
            path="/products/new"
            element={
              <ProductForm />
            }
          />

          <Route
            path="/products/:id/edit"
            element={
              <ProductForm />
            }
          />


          {/* Rewards */}

          <Route
            path="/rewards/new"
            element={
              <RewardForm />
            }
          />

          <Route
            path="/rewards/:id/edit"
            element={
              <RewardForm />
            }
          />


          {/* Settings */}

          <Route
            path="/settings/points"
            element={
              <PointsSettings />
            }
          />
        </Route>


        {/* ==========================
            NOT FOUND
        ========================== */}

        <Route
          path="*"
          element={
            <NotFound />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;