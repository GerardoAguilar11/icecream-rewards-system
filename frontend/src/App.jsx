import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
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

        </Route>


        <Route
          path="/customers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "EMPLOYEE",
              ]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;