import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ setAuthToken, goToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous error
        axios
            .post("http://localhost:5131/api/auth/login", { email, password })
            .then((response) => {
                setAuthToken(response.data.token);
            })
            .catch((error) => {
                setErrorMessage("Невірний email або пароль.");
            });
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
                        onClick={goToRegister}
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
