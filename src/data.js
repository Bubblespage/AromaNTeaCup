export const categories = ['Favorites', 'All', 'Frappe', 'Iced Coffee', 'Hot Coffee', 'Snacks'];

const imgs = {
  frappe: '/frappe_drink_1788523503782.jpg',
  hot: '/hot_coffee_drink_1788523517320.jpg',
  iced: '/iced_coffee_drink_1788523531349.jpg',
  blended: '/iced_blended_drink_1788523545693.jpg',
  cake: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400'
};

export const menuItems = [
  // --- FRAPPE ---
  { id: 1, name: 'Caramel Macchiato Frappe', price: '₱165', category: 'Frappe', image: '/caramel_macchiato_frappe.jpg' },
  { id: 2, name: 'Oreo Cheesecake', price: '₱165', category: 'Frappe', image: '/oreo_cheesecake.jpg' },
  { id: 3, name: 'Mocha Cookie Crumble', price: '₱165', category: 'Frappe', image: '/mocha_cookie.jpg' },
  { id: 4, name: 'Tripple Dark Chocolate', price: '₱165', category: 'Frappe', image: '/tripple_dark_choco.jpg' },
  { id: 6, name: 'Salted Caramel Frappe', price: '₱165', category: 'Frappe', image: '/salted_caramel_frappe.jpg' },
  { id: 7, name: 'Dark Caramel', price: '₱165', category: 'Frappe', image: '/frappe_2.jpg' },
  { id: 8, name: 'Mocha Frappe', price: '₱165', category: 'Frappe', image: '/mocha_frappe.jpg' },

  // --- ICED BLENDED (Moved to Frappe) ---
  { id: 10, name: 'Choco Java Chips', price: '₱165', category: 'Frappe', image: '/frappe_3.jpg' },
  { id: 12, name: 'Cookies & Cream', price: '₱165', category: 'Frappe', image: '/frappe_4.jpg' },
  { id: 13, name: 'Dark Chocolate', price: '₱165', category: 'Frappe', image: '/dark_chocolate.jpg' },

  // --- ICED COFFEE ---
  { id: 17, name: 'Iced Vanilla Latte', price: '₱135', category: 'Iced Coffee', image: '/vanilla_latte.jpg?v=4' },
  { id: 18, name: 'Iced Caramel Latte', price: '₱135', category: 'Iced Coffee', image: '/caramel_latte.jpg?v=4' },
  { id: 19, name: 'Iced Americano', price: '₱100', category: 'Iced Coffee', image: '/americano.jpg?v=4' },
  { id: 20, name: 'Iced Caramel Macchiato', price: '₱135', category: 'Iced Coffee', image: '/caramel_macchiato.jpg?v=4' },
  { id: 21, name: 'Spanish Latte', price: '₱135', category: 'Iced Coffee', image: '/spanish_latte.jpg?v=4' },
  { id: 22, name: 'Iced Mocha Latte', price: '₱135', category: 'Iced Coffee', image: '/mocha_latte.jpg?v=4' },

  // --- HOT COFFEE ---
  { id: 24, name: 'Americano', price: '₱50', category: 'Hot Coffee', image: '/black_hot_1788603011976.jpg' },
  { id: 25, name: 'French Vanilla Hot', price: '₱75', category: 'Hot Coffee', image: '/vanilla_hot_1788603164515.jpg' },
  { id: 28, name: 'Salted Caramel Hot', price: '₱85', category: 'Hot Coffee', image: '/caramel_hot_1788603319348.jpg' },

  // --- SNACKS ---
  { id: 30, name: 'Hashbrown', price: '₱40', category: 'Snacks', image: '/hashbrown.jpg' },
  { id: 31, name: 'Gyoza', price: '₱88', category: 'Snacks', image: '/gyoza.jpg' }
];
