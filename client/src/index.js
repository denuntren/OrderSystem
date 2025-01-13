import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppWrapper from "./AppWrapper";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./components/Cart/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CartProvider> {}
            <AppWrapper />
        </CartProvider>
    </React.StrictMode>
);

reportWebVitals();
