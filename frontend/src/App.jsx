import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ============================================================
// STUDENT PAGES
// ============================================================

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import SellProduct from "./pages/SellProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import SellerOrders from "./pages/SellerOrders";
import Chat from "./pages/Chat";
import MyRentals from "./pages/MyRentals";
import RentalRequests from "./pages/RentalRequests";
import MyExchangeOffers from "./pages/MyExchangeOffers";
import ExchangeOffers from "./pages/ExchangeOffers";

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminProducts from "./pages/AdminProducts";

// ============================================================
// NOT FOUND
// ============================================================

import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app min-h-screen">
      <Navbar />

      <main>
        <Routes>
          {/* ==================================================
              STUDENT ROUTES
          ================================================== */}

          <Route path="/" element={<Home />} />

          <Route path="/marketplace" element={<Marketplace />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/sell" element={<SellProduct />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/profile/edit" element={<EditProfile />} />
          

          <Route path="/profile/edit" element={<EditProfile />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<MyOrders />} />

          <Route path="/orders/:id" element={<OrderDetails />} />

          <Route path="/seller-orders" element={<SellerOrders />} />

          <Route path="/my-listings" element={<MyListings />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/my-rentals" element={<MyRentals />} />

          <Route path="/rental-requests" element={<RentalRequests />} />

          <Route path="/my-exchange-offers" element={<MyExchangeOffers />} />

          <Route path="/exchange-offers" element={<ExchangeOffers />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ==================================================
              ADMIN ROUTES
          ================================================== */}

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/profile" element={<Profile />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/products" element={<AdminProducts />} />

          <Route path="/admin/reports" element={<AdminReports />} />

          {/* ==================================================
              NOT FOUND
          ================================================== */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
