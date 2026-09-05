import { useState } from 'react';
import { Coffee } from 'lucide-react';
import './App.css';
import { categories, menuItems } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import MenuGrid from './components/MenuGrid';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AboutModal from './components/AboutModal';
import CustomizationModal from './components/CustomizationModal';

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [favorites, setFavorites] = useState([]);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState(null);
  const [editingCartItemId, setEditingCartItemId] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'Favorites') {
      return favorites.includes(item.id) && matchesSearch;
    }
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    // Intercept items that are not pastries and haven't been customized yet
    if (item.category !== 'Pastries' && !item.customizations) {
      setSelectedItemForCustomization(item);
      setEditingCartItemId(null);
      setIsCustomizationOpen(true);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleEditCartItem = (item) => {
    setSelectedItemForCustomization(item);
    setEditingCartItemId(item.id);
    setIsCustomizationOpen(true);
    setIsCartOpen(false);
  };

  const handleUpdateCartItem = (newItem, oldItemId) => {
    setCartItems(prev => {
      const oldItem = prev.find(i => i.id === oldItemId);
      if (!oldItem) return prev;
      
      const qty = oldItem.qty;
      const withoutOld = prev.filter(i => i.id !== oldItemId);
      
      const existingNew = withoutOld.find(i => i.id === newItem.id);
      if (existingNew) {
        return withoutOld.map(i => i.id === newItem.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...withoutOld, { ...newItem, qty }];
    });
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleRemoveOne = (id) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const handleDeleteItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsDashboardOpen(false);
  };

  if (currentUser?.role === 'admin') {
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  if (isDashboardOpen && currentUser) {
    return (
      <UserDashboard 
        onSignOut={handleSignOut}
        onBack={() => setIsDashboardOpen(false)}
        onReorder={(items) => {
          setCartItems(prev => [...prev, ...items]);
          setIsDashboardOpen(false);
          setIsCartOpen(true);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <Header
        cartCount={cartCount}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSearchFilter={setSearchQuery}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />
      <Hero />
      <div id="menu-section">
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">
              <Coffee size={48} strokeWidth={1.5} />
            </div>
            <p>Oops! No results for "<strong>{searchQuery}</strong>"</p>
            <span>Try searching for something else or explore our categories!</span>
          </div>
        ) : (
          <MenuGrid
            items={filteredItems}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Footer / Contact Section */}
      <footer id="contact-section" className="app-footer">
        <div className="footer-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="logo-container">
              <img src="/logo.jpg" alt="Aroma N Tea Cup Logo" className="footer-logo-img" />
              <h3>Aroma N Tea Cup</h3>
            </div>
            <p>Experience the finest blends crafted just for you. Whether you're looking for a quick morning pick-me-up or a relaxing afternoon treat, we've got you covered with our premium handcrafted beverages and freshly baked pastries.</p>
          </div>
          <div className="footer-links">
            <h4>Contact Us</h4>
            <p>📍 Carsadang Bago II, Imus Cavite</p>
            <p>📞 09950829180</p>
            <p>✉️ aromanteacup@gmail.com</p>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" className="social-btn">FB</a>
              <a href="#" className="social-btn">IG</a>
              <a href="#" className="social-btn">TW</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Aroma N Tea Cup. All rights reserved.</p>
        </div>
      </footer>
      <BottomNav 
        onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMenu={() => {
          const element = document.getElementById('menu-section');
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }}
        onProfile={() => currentUser ? setIsDashboardOpen(true) : setIsAuthOpen(true)}
        onContact={() => {
          const element = document.getElementById('contact-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAdd={handleAddToCart}
        onRemove={handleRemoveOne}
        onDelete={handleDeleteItem}
        onCheckout={handleCheckout}
        onEdit={handleEditCartItem}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />
      <OrderTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        item={selectedItemForCustomization}
        onAddToCart={handleAddToCart}
        editingItemId={editingCartItemId}
        onUpdateItem={handleUpdateCartItem}
      />
    </div>
  );
}

export default App;
