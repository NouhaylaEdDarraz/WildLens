import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { ShopProvider } from "./Shop";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <ShopProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ShopProvider>
);
