import React, { useState } from "react";
import { Route, Routes, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ProductsList from "./components/ProductsList";
import EditProductForm from "./components/EditProductForm";
import ProductDetail from "./components/ProductDetail";
import { ProductsProvider } from "../src/components/ProductContext";
import AddProduct from "./components/AddProductForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogin = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        toast.success("Ви успішно вийшли з системи!");
        navigate("/login");
    };

    return (
        <ProductsProvider authToken={authToken}>
            <div className="container mt-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary">{authToken ? "Магазин" : "Вхід до системи"}</h2>
                    {authToken && (
                        <div>
                            {/* Змінюємо текст і маршрут кнопки залежно від поточного шляху */}
                            {location.pathname === "/cart" ? (
                                <Link to="/products" className="btn btn-secondary btn-sm me-2">
                                    Повернутись до списку товарів
                                </Link>
                            ) : (
                                <Link to="/cart" className="btn btn-secondary btn-sm me-2">
                                    Перейти до кошика
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                Вийти
                            </button>
                        </div>
                    )}
                </header>

                <Routes>
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProductForm authToken={authToken} />} />
                    <Route path="/products/detail/:id" element={<ProductDetail />} />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={authToken ? <ProductsList /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/login"
                        element={authToken ? <Navigate to="/products" replace /> : <LoginForm setAuthToken={handleLogin} />}
                    />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                        path="/"
                        element={authToken ? <ProductsList /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </ProductsProvider>
    );
};

export default App;
