// ProductsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children, authToken }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authToken) {
            setLoading(true);
            axios
                .get('http://localhost:5131/api/products', {
                    headers: { Authorization: `Bearer ${authToken}` },
                })
                .then((response) => {
                    if (Array.isArray(response.data.$values)) {
                        setProducts(response.data.$values);
                    } else {
                        console.error('Products data is not an array:', response.data);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Failed to load products:', error);
                    setLoading(false);
                });
        }
    }, [authToken]);

    return (
        <ProductsContext.Provider value={{ products, setProducts, loading }}>
            {children}
        </ProductsContext.Provider>
    );
};
