import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Додаємо useNavigate для переходу
import { toast } from "react-toastify";
const LoginForm = ({ setAuthToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Ініціалізуємо навігатор

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        axios
            .post("http://localhost:5131/api/auth/login", { email, password })
            .then((response) => {
                toast.success("Успішний вхід!");
                setAuthToken(response.data.token);
            })
            .catch((error) => {
                toast.error("Помилка.");
                setErrorMessage("Невірний email або пароль.");
            });
    };

    const goToRegister = () => {
        navigate("/register"); // Перехід до сторінки реєстрації
    };

    return (
        <div className="card mx-auto" style={{ maxWidth: "400px" }}>
            <div className="card-body">
                <h3 className="card-title text-center">Вхід</h3>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Електронна пошта</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Увійти
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <button
                        className="btn btn-link"
                        onClick={goToRegister} // Викликаємо goToRegister для переходу на реєстрацію
                        style={{ textDecoration: "none" }}
                    >
                        Зареєструватися
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
