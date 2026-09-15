import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import SellProduct from "./pages/SellProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Notifications from "./pages/Notifications";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import SellerOrders from "./pages/SellerOrders";
import OrderDetails from "./pages/OrderDetails";
import Chat from "./pages/Chat";
import MyRentals from "./pages/MyRentals";
import RentalRequests from "./pages/RentalRequests";
import AdminReports from "./pages/AdminReports";

import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import MyExchangeOffers from "./pages/MyExchangeOffers";
import ExchangeOffers from "./pages/ExchangeOffers";
function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/sell" element={<SellProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/rental-requests" element={<RentalRequests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/seller-orders" element={<SellerOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-exchange-offers" element={<MyExchangeOffers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          app.use( "/api/admin", adminRoutes );
          <Route path="/exchange-offers" element={<ExchangeOffers />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
