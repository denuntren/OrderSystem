import React, { useState } from "react";
import axios from "axios";
import "./RegisterForm.css";

const RegisterForm = ({ goToLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});

        // Client-side validation
        if (!email.includes("@")) {
            setErrors((prev) => ({ ...prev, email: "Невірний формат email." }));
            return;
        }

        if (password.length < 6) {
            setErrors((prev) => ({ ...prev, password: "Пароль повинен містити мінімум 6 символів." }));
            return;
        }

        // Send data to the server
        axios
            .post("http://localhost:5131/api/auth/register", {
                email,
                password,
                userName,
            })
            .then(() => {
                // Redirect to login form after successful registration
                goToLogin();
            })
            .catch((error) => {
                const serverMessage = error.response?.data?.message || "Сталася помилка.";
                setErrors((prev) => ({ ...prev, server: serverMessage }));
            });
    };

    return (
        <div className="register-form-container">
            <h2>Реєстрація</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <div className="form-group">
                    <label>Ім'я користувача</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                {errors.server && <div className="error-message">{errors.server}</div>}
                <button type="submit" className="btn btn-primary">
                    Зареєструватися
                </button>
                <div className="mt-2">
                    <a href="#" onClick={goToLogin}>
                        Вже є аккаунт? Увійти
                    </a>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
