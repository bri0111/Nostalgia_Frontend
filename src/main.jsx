import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <FavoritesProvider>
            <ProductProvider>
              <App />
            </ProductProvider>
          </FavoritesProvider>
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  </StrictMode>
);