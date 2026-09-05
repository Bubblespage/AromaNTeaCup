import { ShoppingCart, Search, User, LogOut, X, Truck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Header({ cartCount, onOpenAuth, onOpenAbout, currentUser, onSignOut, onOpenCart, onOpenTracker, allItems, onSearchFilter, onOpenDashboard }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    else {
      setQuery('');
      onSearchFilter('');
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearchFilter(val);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    onSearchFilter('');
  };

  return (
    <header className="header glass">
      <div className="container header-container">
        <div className="logo-container">
          <img src="/logo.jpg" alt="Aroma N Tea Cup Logo" className="header-logo-img" />
          <div className="logo">Aroma N Tea Cup</div>
        </div>
        
        {/* Search bar expands over nav on desktop */}
        {searchOpen ? (
          <div className="search-bar-wrapper">
            <Search size={20} className="search-bar-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-bar-input"
              placeholder="Search coffee, pastries..."
              value={query}
              onChange={handleSearch}
            />
            <button className="search-close-btn" onClick={closeSearch}>
              <X size={20} />
            </button>
          </div>
        ) : (
          <nav className="desktop-nav">
            <button 
              className="nav-link active"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </button>
            <button 
              className="nav-link"
              onClick={() => {
                const element = document.getElementById('menu-section');
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
            >
              Menu
            </button>
            <button 
              className="nav-link"
              onClick={() => {
                const element = document.getElementById('contact-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact
            </button>
            <button className="nav-link" onClick={onOpenAbout}>About Us</button>
          </nav>
        )}

        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={24} />
          </button>

          <button className="cart-btn" onClick={onOpenTracker} title="Track Order">
            <Truck size={24} />
          </button>

          <button className="cart-btn" onClick={onOpenCart} title="View Tray">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {currentUser ? (
            <div className="user-menu">
              <div className="user-avatar" onClick={onOpenDashboard} style={{ cursor: 'pointer' }} title="My Account">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="user-name" onClick={onOpenDashboard} style={{ cursor: 'pointer' }}>Hi, {currentUser.name.split(' ')[0]}!</span>
              <button className="icon-btn sign-out-btn" onClick={onSignOut} title="Sign Out">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <>
              <button className="icon-btn" onClick={onOpenAuth} title="Account"><User size={24} /></button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
