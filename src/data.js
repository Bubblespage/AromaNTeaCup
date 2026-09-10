export const categories = ['Favorites', 'All', 'Frappe', 'Iced Coffee', 'Hot Coffee', 'Pastries'];

const imgs = {
  frappe: '/frappe_drink_1788523503782.jpg',
  hot: '/hot_coffee_drink_1788523517320.jpg',
  iced: '/iced_coffee_drink_1788523531349.jpg',
  blended: '/iced_blended_drink_1788523545693.jpg',
  cake: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400'
};

export const menuItems = [
  // --- FRAPPE ---
  { id: 1, name: 'Caramel Macchiato Frappe', price: '₱89', category: 'Frappe', image: '/caramel_frappe_1788524208307.jpg' },
  { id: 2, name: 'Oreo Cheesecake', price: '₱89', category: 'Frappe', image: '/oreo_frappe_1788602741814.jpg' },
  { id: 3, name: 'Mocha Cookie Crumble', price: '₱89', category: 'Frappe', image: '/mocha_frappe_1788602893315.jpg' },
  { id: 4, name: 'Tripple Dark Chocolate', price: '₱89', category: 'Frappe', image: '/mocha_frappe_1788602893315.jpg' },
  { id: 6, name: 'Salted Caramel Frappe', price: '₱89', category: 'Frappe', image: '/caramel_frappe_1788524208307.jpg' },
  { id: 7, name: 'Dark Caramel', price: '₱89', category: 'Frappe', image: '/caramel_frappe_1788524208307.jpg' },
  { id: 8, name: 'Mocha Frappe', price: '₱89', category: 'Frappe', image: '/mocha_frappe_1788602893315.jpg' },

  // --- ICED BLENDED (Moved to Frappe) ---
  { id: 10, name: 'Choco Java Chips', price: '₱89', category: 'Frappe', image: '/rocky_road_1788602920272.jpg' },
  { id: 12, name: 'Cookies & Cream', price: '₱89', category: 'Frappe', image: '/oreo_frappe_1788602741814.jpg' },
  { id: 13, name: 'Dark Chocolate', price: '₱89', category: 'Frappe', image: '/mocha_frappe_1788602893315.jpg' },
  { id: 15, name: 'Hershey', price: '₱89', category: 'Frappe', image: '/mocha_frappe_1788602893315.jpg' },

  // --- ICED COFFEE ---
  { id: 17, name: 'Salted Caramel Iced', price: '₱85', category: 'Iced Coffee', image: '/caramel_iced_1788602932720.jpg' },
  { id: 18, name: 'Hazelnut Mocha Iced', price: '₱85', category: 'Iced Coffee', image: '/mocha_iced_1788602984203.jpg' },
  { id: 19, name: 'Hazelnut Caramel', price: '₱85', category: 'Iced Coffee', image: '/caramel_iced_1788602932720.jpg' },
  { id: 20, name: 'Caramel Macchiato Iced', price: '₱85', category: 'Iced Coffee', image: '/caramel_iced_1788602932720.jpg' },
  { id: 21, name: 'White Cheesecake', price: '₱85', category: 'Iced Coffee', image: '/white_iced_1788602996843.jpg' },
  { id: 22, name: 'Hazelnut White Choco', price: '₱85', category: 'Iced Coffee', image: '/white_iced_1788602996843.jpg' },
  { id: 23, name: 'Butterscotch Mocha', price: '₱85', category: 'Iced Coffee', image: '/mocha_iced_1788602984203.jpg' },

  // --- HOT COFFEE ---
  { id: 24, name: 'Americano', price: '₱50', category: 'Hot Coffee', image: '/black_hot_1788603011976.jpg' },
  { id: 25, name: 'French Vanilla Hot', price: '₱75', category: 'Hot Coffee', image: '/vanilla_hot_1788603164515.jpg' },
  { id: 27, name: 'Cafe Latte', price: '₱75', category: 'Hot Coffee', image: '/vanilla_hot_1788603164515.jpg' },
  { id: 28, name: 'Salted Caramel Hot', price: '₱85', category: 'Hot Coffee', image: '/caramel_hot_1788603319348.jpg' },

  // --- PASTRIES ---
  { id: 30, name: 'Chocolate Cake Loaf', price: '₱180', category: 'Pastries', image: imgs.cake },
  { id: 31, name: 'Ube Cake Loaf', price: '₱185', category: 'Pastries', image: imgs.cake },
  { id: 32, name: 'Carrot Cake Loaf', price: '₱190', category: 'Pastries', image: imgs.cake },
  { id: 33, name: 'Banana Cake Loaf', price: '₱175', category: 'Pastries', image: imgs.cake }
];
