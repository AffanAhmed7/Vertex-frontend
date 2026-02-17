import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import LandingPage from '../pages/LandingPage';
import ShopPage from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AccountLayout from '../components/account/AccountLayout';
import AccountOverview from '../pages/account/AccountOverview';
import AccountOrders from '../pages/account/AccountOrders';
import AccountAddresses from '../pages/account/AccountAddresses';
import AccountReviews from '../pages/account/AccountReviews';
import AccountSettings from '../pages/account/AccountSettings';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSettings from '../pages/admin/AdminSettings';
import ScrollToTop from '../components/common/ScrollToTop';
import { Login, Register } from '../pages/Placeholders';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public / Customer Routes */}
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="product/:id" element={<ProductDetailPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* Account Dashboard Group */}
                    <Route path="account" element={<AccountLayout />}>
                        <Route index element={<AccountOverview />} />
                        <Route path="orders" element={<AccountOrders />} />
                        <Route path="addresses" element={<AccountAddresses />} />
                        <Route path="reviews" element={<AccountReviews />} />
                        <Route path="settings" element={<AccountSettings />} />
                    </Route>
                </Route>

                {/* Admin Dashboard Group */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
