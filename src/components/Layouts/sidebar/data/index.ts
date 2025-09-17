import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Orders",
        url: "/orders",
        icon: Icons.ChevronUp,
        items: [],
      },
      {
        title: "Inventory",

        icon: Icons.Table,
        items: [
          {
            title: "View Inventory",
            url: "/inventory",
          },
          {
            title: "Add New Product",
            url: "/inventory/addProductForm",
          },
        ],
      },

      {
        title: "Payments",
        url: "/payments",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Promotions",

        icon: Icons.Calendar,
        items: [
          {
            title: "Create Promotion",
            url: "/promotions/create",
          },
          {
            title: "Manage Promotion",
            url: "/promotions/manage",
          },

          {
            title: "Promotion Reports",
            url: "/promotions/reports",
          },
          {
            title: "Buy a Plan",
            url: "/promotions/buy-plan",
          },
        ],
      },
    ],
  },
  {
    label: "USER",
    items: [
      {
        title: "Settings",
        url: "/pages/settings",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Review and Feedback",
        url: "/profile233",
        icon: Icons.PieChart,
        items: [],
      },

      {
        title: "FAQ",
        url: "/faqqq",
        icon: Icons.ArrowLeftIcon,
        items: [],
      },

      {
        title: "Logout",
        url: "/logoutttt",
        icon: Icons.Authentication,
        items: [],
      },
    ],
  },
];
