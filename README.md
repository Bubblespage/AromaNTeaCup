# ☕ Aroma N Tea Cup

A modern, mobile-first web ordering app for **Aroma N Tea Cup** — a specialty coffee and tea shop located in Carsadang Bago II, Imus, Cavite, Philippines.

Built with **React + Vite** and powered by **Firebase** for authentication and real-time order management.

---

## ✨ Features

### 🛒 Ordering System
- Browse a full menu of **Frappes, Iced Coffees, Hot Coffees, and Pastries**
- **Drink customization** — choose size, sugar level, add-ons, and more
- Add to cart, edit items, and proceed to checkout
- **GCash payment** integration with QR code

### 🔐 User Accounts
- Sign up & log in with **Firebase Authentication**
- **User Dashboard** — view order history, reorder past favorites
- **Favorites** — save your go-to drinks for quick access

### 📦 Order Tracking
- Real-time order status tracking after checkout
- Get updates as your order is prepared

### 🛡️ Admin Panel
- Dedicated **Admin Dashboard** for managing orders
- Role-based access control (admin vs. customer)

### 🎨 Modern UI/UX
- Responsive, mobile-first design with a warm coffee-themed aesthetic
- Smooth animations and micro-interactions
- Hero banner, category navigation, and search functionality
- Bottom navigation bar for easy mobile browsing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Firebase Auth** | User authentication |
| **Cloud Firestore** | Database & order management |
| **Lucide React** | Icon library |
| **Vanilla CSS** | Styling with custom design system |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bubblespage/AromaNTeaCup.git
   cd AromaNTeaCup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
AromaNTeaCup/
├── public/               # Static assets (product images, logo, QR codes)
├── src/
│   ├── assets/           # App assets (hero image, icons)
│   ├── components/       # React components
│   │   ├── AboutModal.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AuthModal.jsx
│   │   ├── BottomNav.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CategoryNav.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── CustomizationModal.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── MenuGrid.jsx
│   │   ├── OrderTracker.jsx
│   │   └── UserDashboard.jsx
│   ├── data.js           # Menu items & categories
│   ├── firebase.js       # Firebase configuration
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json
└── vite.config.js
```

---

## 📬 Contact

- 📍 **Address:** Carsadang Bago II, Imus, Cavite
- 📞 **Phone:** 09950829180
- ✉️ **Email:** aromanteacup@gmail.com

---

## 📄 License

This project is private and proprietary. All rights reserved © 2023 Aroma N Tea Cup.
