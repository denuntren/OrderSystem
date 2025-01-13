import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = ({ setAuthToken, setUserId }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5131/api/auth/login", {
                email,
                password,
            });

            const { token } = response.data;
            const decodedToken = JSON.parse(atob(token.split(".")[1]));

            localStorage.setItem("authToken", token);
            localStorage.setItem("UserId", decodedToken.UserId);

            setAuthToken(token);
            setUserId(decodedToken.UserId);

            toast.success("Успішний вхід!");
            navigate("/products");
        } catch (error) {
            setErrorMessage("Невірний email або пароль.");
        }
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
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate("/register")}
                    >
                        Немає акаунта? Зареєструватися
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
