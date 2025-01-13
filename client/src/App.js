import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider, useCart } from "./components/Cart/CartContext";
import { ProductsProvider } from "./components/Products/ProductContext";
import Header from "./components/Shared/Header";
import Footer from "./components/Shared/Footer";
import LoginForm from "./components/Shared/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ProductsList from "./components/Products/ProductsList";
import EditProductForm from "./components/Products/EditProductForm";
import AddProduct from "./components/Products/AddProductForm";
import ProductDetail from "./components/Products/ProductDetail";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
import AdminOrders from "./components/Orders/AdminOrders";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import "./App.css";

const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [userId, setUserId] = useState(localStorage.getItem("UserId"));
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    useEffect(() => {
        if (!authToken && !userId) {
            handleLogout();
        } else if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUserRole(
                    decodedToken[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                        ] || decodedToken.role
                );
            } catch (error) {
                console.error("Помилка декодування токена:", error);
            }
        }
    }, [authToken, userId]);

    const handleLogin = (token) => {
        const decodedToken = jwtDecode(token);

        setAuthToken(token);
        setUserId(decodedToken.UserId);
        setUserRole(decodedToken.role);

        localStorage.setItem("authToken", token);
        localStorage.setItem("UserId", decodedToken.UserId);

        clearCart();

        window.dispatchEvent(new Event("storage"));

        toast.success("Вхід успішний!");
        navigate("/products");
    };

    const handleLogout = () => {
        clearCart();
        localStorage.removeItem("authToken");
        localStorage.removeItem("UserId");

        setAuthToken(null);
        setUserId(null);
        setUserRole(null);

        toast.success("Ви успішно вийшли з системи!");
        navigate("/login");
    };

    return (
        <CartProvider>
            <ProductsProvider authToken={authToken}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="app-wrapper"
                >
                    <Header authToken={authToken} userRole={userRole} handleLogout={handleLogout} />
                    <div className="content">
                        <div className="container mt-4">
                            <ToastContainer position="top-right" autoClose={3000} />
                            <Routes>
                                <Route
                                    path="/products"
                                    element={
                                        authToken ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <ProductsList />
                                            </motion.div>
                                        ) : (
                                            <Navigate to="/login" replace />
                                        )
                                    }
                                />
                                <Route
                                    path="/products/add"
                                    element={
                                        <ProtectedRoute roles={["Admin"]}>
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.9 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <AddProduct />
                                            </motion.div>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/edit/:id"
                                    element={
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <EditProductForm authToken={authToken} />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/products/detail/:id"
                                    element={
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <ProductDetail />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute>
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.9 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Cart />
                                            </motion.div>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <motion.div
                                                initial={{ x: -50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 50, opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Orders />
                                            </motion.div>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/orders"
                                    element={
                                        <ProtectedRoute roles={["Admin"]}>
                                            <motion.div
                                                initial={{ y: -20 }}
                                                animate={{ y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <AdminOrders />
                                            </motion.div>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/login"
                                    element={
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <LoginForm setAuthToken={handleLogin} />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <RegisterForm />
                                        </motion.div>
                                    }
                                />
                                <Route
                                    path="/"
                                    element={<Navigate to="/products" />}
                                />
                                <Route
                                    path="*"
                                    element={
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <h1>Сторінка не знайдена</h1>
                                        </motion.div>
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                    <Footer />
                </motion.div>
            </ProductsProvider>
        </CartProvider>
    );
};

export default App;
