import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.stockQuantity || !formData.description) {
            setError("Будь ласка, заповніть усі обов'язкові поля.");
            toast.error("Заповніть усі поля!");
            return;
        }

        axios
            .post("http://localhost:5131/api/products", formData, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            .then(() => {
                toast.success("Товар успішно додано!");
                navigate("/products");
            })
            .catch((error) => {
                console.error("Не вдалося додати товар:", error);
                toast.error("Сталася помилка під час додавання товару.");
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success mb-4">Додати новий товар</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Назва товару
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        Ціна
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="stockQuantity" className="form-label">
                        Кількість в наявності
                    </label>
                    <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        className="form-control"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Опис товару
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                        URL зображення
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                    {formData.imageUrl && (
                        <div className="mt-3 text-center">
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{
                                    maxWidth: "300px",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-success w-100">
                    Додати товар
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
