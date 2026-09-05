import { Plus, Heart } from 'lucide-react';

export default function MenuGrid({ items, onAddToCart, favorites = [], onToggleFavorite }) {
  return (
    <section className="menu-section">
      <div className="container">
        <div className="menu-grid">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="menu-item animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.name} className="item-image" />
                <button 
                  onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: favorites.includes(item.id) ? '#e74c3c' : '#a09895',
                    transition: 'transform 0.2s, color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Heart size={20} fill={favorites.includes(item.id) ? '#e74c3c' : 'none'} strokeWidth={2} />
                </button>
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <div className="item-price-row">
                  <span className="price">{item.price}</span>
                  <button className="add-btn" onClick={() => onAddToCart(item)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
