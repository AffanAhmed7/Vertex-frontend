import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import {
    Home,
    Shop,
    ProductDetail,
    Cart,
    Checkout,
    Login,
    Register,
    Account,
    Admin
} from '../pages/Placeholders';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="account" element={<Account />} />
                <Route path="admin" element={<Admin />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
