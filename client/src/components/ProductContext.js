// ProductsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children, authToken }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        if (authToken) {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5131/api/products', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (Array.isArray(response.data.$values)) {
                    setProducts(response.data.$values);
                    toast.success('Список товарів завантажено!');
                } else {
                    console.error('Products data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Failed to load products:', error);
                toast.error('Не вдалося завантажити список товарів.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [authToken]);

    return (
        <ProductsContext.Provider value={{ products, setProducts, loading, setLoading }}>
            {children}
        </ProductsContext.Provider>
    );
};
