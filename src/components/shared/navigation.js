export const getNavigationMenu = (role) => {
  const menus = {
    ADMIN: [
      { id: 1, label: "Dashboard", href: "/dashboard", icon: "home" },
      { id: 2, label: "Produk", href: "/dashboard/products", icon: "package" },
      { id: 3, label: "Pesanan", href: "/dashboard/orders", icon: "shopping-bag" },
      { id: 4, label: "Affiliate", href: "/dashboard/affiliates", icon: "users" },
      { id: 5, label: "Pengaturan", href: "/dashboard/settings", icon: "settings" },
    ],
    AFFILIATE: [
      { id: 1, label: "Dashboard", href: "/dashboard/affiliate", icon: "home" },
      { id: 2, label: "Performa", href: "/dashboard/affiliate/performance", icon: "trending-up" },
      { id: 3, label: "Marketing Materials", href: "/dashboard/affiliate/materials", icon: "download" },
      { id: 4, label: "Profil", href: "/dashboard/affiliate/profile", icon: "user" },
    ],
    BUYER: [
      { id: 1, label: "Dashboard", href: "/buyer", icon: "home" },
      { id: 2, label: "Pesanan Saya", href: "/buyer/orders", icon: "shopping-bag" },
      { id: 3, label: "Profil", href: "/buyer/profile", icon: "user" },
    ],
  };

  return menus[role] || menus.BUYER;
};
