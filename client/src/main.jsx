// index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { FireBaseProvider } from "./context/Firebase.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FireBaseProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FireBaseProvider>
    </BrowserRouter>
  </StrictMode>
);
