import { lazy } from 'react';
import Users from '../pages/Users';
import UserOrder from '../pages/UserOrder';
import Subscriptions from '../pages/Subscriptions';
import Staff from '../pages/Staff';
import Messages from '../pages/Messages';
import VideoBanner from '../pages/VideoBanner';
import Faq from '../pages/Faq';

// use lazy for better code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Products = lazy(() => import('../pages/Products'));
const Reviews = lazy(() => import('../pages/Reviews'));
const Banner = lazy(() => import('../pages/Banner'));
const AppPromotion = lazy(() => import('../pages/AppPromotion'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Category = lazy(() => import('../pages/Category'));
const FaqDetails = lazy(() => import('../pages/FaqDetails'));
const Orders = lazy(() => import('../pages/Orders'));
const OrderInvoice = lazy(() => import('../pages/OrderInvoice'));
const ProductInvoice = lazy(() => import('../pages/ProductInvoice'));
const BannerDetails = lazy(() => import('../pages/BannerDetails'));

/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/products',
    component: Products,
  },
  {
    path: '/product/:id',
    component: ProductDetails,
  },
   {
    path: '/reviews',
    component: Reviews,
  },
  {
    path: '/category',
    component: Category,
  },
  {
    path: '/settings/faq',
    component: Faq,
  },

  {
    path: '/settings/faq/:id',
    component: FaqDetails,
  },

  {
    path: '/orders',
    component: Orders,
  },


  {
    path: '/order/:id',
    component: OrderInvoice,
  },
  {
    path: '/product-invoice/:id',
    component: ProductInvoice,
  },
  {
    path: '/messages',
    component: Messages,
  },
  {
   path: '/customer/user',
    component: Users,
  },
  {
   path: '/customer-order/:id',
    component: UserOrder,
  },
  {
   path: '/customer/subscriptions',
    component: Subscriptions,
  },
  {
   path: '/settings/banner',
    component: Banner,
  },
  {
   path: '/settings/video-banner',
    component: VideoBanner,
  },
  {
    path: '/settings/banner/:id',
    component: BannerDetails,
  },

  {
    path: '/settings/app-promotion',
    component: AppPromotion,
  },
  {
    path: '/settings/admins',
    component: Staff,
  },
];

export default routes;
