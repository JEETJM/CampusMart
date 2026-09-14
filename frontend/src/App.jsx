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
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Chat from "./pages/Chat";
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

          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
