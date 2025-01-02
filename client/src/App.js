import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Додано Link
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ProductsList from "./components/ProductsList";
import EditProductForm from "./components/EditProductForm";
import ProductDetail from "./components/ProductDetail"; // Імпортуємо новий компонент
import { ProductsProvider } from "../src/components/ProductContext";

const App = () => {
    const [view, setView] = useState("login");
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [registrationMessage, setRegistrationMessage] = useState(""); // Стан для повідомлення про реєстрацію

    const handleLogin = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
        setView("products");
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        setView("login");
    };

    return (
        <Router>
            <ProductsProvider authToken={authToken}>
                <div className="container mt-4">
                    <header className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-primary">
                            {authToken
                                ? "Магазин"
                                : view === "login"
                                    ? "Вхід до системи"
                                    : "Реєстрація нового користувача"}
                        </h2>
                        {authToken && (
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                Вийти
                            </button>
                        )}
                    </header>

                    <Routes>
                        <Route
                            path="/products/edit/:id"
                            element={<EditProductForm authToken={authToken} />}
                        />
                        <Route
                            path="/products/detail/:id" // Додаємо маршрут для деталізованого перегляду
                            element={<ProductDetail />}
                        />
                        <Route
                            path="/products"
                            element={
                                authToken ? (
                                    <ProductsList />
                                ) : (
                                    <p>
                                        Unauthorized. Please <Link to="/login">log in</Link>.
                                    </p>
                                )
                            }
                        />
                        <Route
                            path="/login"
                            element={<LoginForm setAuthToken={handleLogin} goToRegister={() => setView("register")} />}
                        />
                        <Route
                            path="/register"
                            element={<RegisterForm goToLogin={() => setView("login")} setRegistrationMessage={setRegistrationMessage} />}
                        />
                        <Route
                            path="/"
                            element={
                                authToken ? (
                                    <ProductsList />
                                ) : view === "login" ? (
                                    <LoginForm setAuthToken={handleLogin} goToRegister={() => setView("register")} />
                                ) : (
                                    <RegisterForm goToLogin={() => setView("login")} setRegistrationMessage={setRegistrationMessage} />
                                )
                            }
                        />
                    </Routes>

                    {registrationMessage && <div className="alert alert-success mt-4">{registrationMessage}</div>}
                </div>
            </ProductsProvider>
        </Router>
    );
};

export default App;
