import {
  FiGrid,
  FiShoppingBag,
  // FiUsers,
  // FiUser,
  FiCompass,
  // FiGift,
  FiList,
  FiSettings,
  // FiSlack,
} from "react-icons/fi";
/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },
  // {
  //   icon: FiSettings,
  //   name: "Customer",
  //   routes: [
  //     // submenu

  //     {
  //       path: "/customer/user",
  //       name: "User ",
  //     },
  //     {
  //       path: "/customer/subscriptions",
  //       name: "Subscription",
  //     },
  //   ],
  // },

  {
    path: "/customer/user",
    icon: FiGrid,
    name: "Vendors",
  },
  {
    path: "/category",
    icon: FiList,
    name: "Categories",
  },
  {
    path: "/products",
    icon: FiShoppingBag,
    name: "Purchase",
  },
  {
    path: "/reviews",
    icon: FiShoppingBag,
    name: "Reviews",
  },

  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders",
  },
  {
    path: "/messages",
    icon: FiCompass,
    name: "Messages",
  },

  {
    icon: FiSettings,
    name: "Setting",
    routes: [
      // submenu
      {
        path: "/settings/admins",
        // icon: FiCompass,
        name: "Admins",
      },
      {
        path: "/settings/app-promotion",
        name: "App Promotion",
      },
      {
        path: "/settings/banner",
        name: "Banner ",
      },
      {
        path: "/settings/video-banner",
        name: "Video Banner ",
      },
      {
        path: "/settings/faq",
        // icon: FiCompass,
        name: "Faq",
      },
      
    ],
  },
];

export default sidebar;
