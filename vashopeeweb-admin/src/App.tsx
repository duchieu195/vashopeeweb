import { Refine, Authenticated } from '@refinedev/core';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { AuthPage, ThemedLayout, useNotificationProvider } from '@refinedev/antd';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TagsOutlined,
  OrderedListOutlined,
  PercentageOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import '@refinedev/antd/dist/reset.css';

import { supabaseClient } from './lib/supabase';
import { authProvider } from './lib/authProvider';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductList from './pages/products/ProductList';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import OrderList from './pages/orders/OrderList';
import OrderShow from './pages/orders/OrderShow';
import CategoryList from './pages/categories/CategoryList';
import CategoryCreate from './pages/categories/CategoryCreate';
import CategoryEdit from './pages/categories/CategoryEdit';
import CouponList from './pages/coupons/CouponList';
import CouponCreate from './pages/coupons/CouponCreate';
import BannerList from './pages/banners/BannerList';
import BannerCreate from './pages/banners/BannerCreate';
import BannerEdit from './pages/banners/BannerEdit';

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={{
        token: { colorPrimary: '#E91E8C' },
        components: {
          Menu: {
            itemSelectedBg: 'rgba(233, 30, 140, 0.12)',
            itemSelectedColor: '#E91E8C',
            itemActiveBg: 'rgba(233, 30, 140, 0.08)',
          },
        },
      }}>
        <AntApp>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            routerProvider={routerProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/dashboard',
                meta: { label: 'Dashboard', icon: <DashboardOutlined /> },
              },
              {
                name: 'products',
                list: '/products',
                create: '/products/create',
                edit: '/products/edit/:id',
                meta: { label: 'Sản Phẩm', icon: <ShoppingOutlined /> },
              },
              {
                name: 'orders',
                list: '/orders',
                show: '/orders/:id',
                meta: { label: 'Đơn Hàng', icon: <OrderedListOutlined /> },
              },
              {
                name: 'categories',
                list: '/categories',
                create: '/categories/create',
                edit: '/categories/edit/:id',
                meta: { label: 'Danh Mục', icon: <TagsOutlined /> },
              },
              {
                name: 'coupons',
                list: '/coupons',
                create: '/coupons/create',
                meta: { label: 'Mã Giảm Giá', icon: <PercentageOutlined /> },
              },
              {
                name: 'banners',
                list: '/banners',
                create: '/banners/create',
                edit: '/banners/edit/:id',
                meta: { label: 'Banner', icon: <PictureOutlined /> },
              },
            ]}
            options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="auth" fallback={<Navigate to="/login" />}>
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/create" element={<ProductCreate />} />
                <Route path="/products/edit/:id" element={<ProductEdit />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/:id" element={<OrderShow />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/categories/create" element={<CategoryCreate />} />
                <Route path="/categories/edit/:id" element={<CategoryEdit />} />
                <Route path="/coupons" element={<CouponList />} />
                <Route path="/coupons/create" element={<CouponCreate />} />
                <Route path="/banners" element={<BannerList />} />
                <Route path="/banners/create" element={<BannerCreate />} />
                <Route path="/banners/edit/:id" element={<BannerEdit />} />
              </Route>
              <Route
                path="/login"
                element={
                  <Authenticated key="login" fallback={<AuthPage type="login" title="VABeauty Admin" />}>
                    <Navigate to="/dashboard" />
                  </Authenticated>
                }
              />
            </Routes>
          </Refine>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}
