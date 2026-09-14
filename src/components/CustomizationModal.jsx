import { useState, useEffect } from 'react';
import { X, Coffee } from 'lucide-react';

export default function CustomizationModal({ isOpen, onClose, item, onAddToCart, editingItemId, onUpdateItem }) {
  const [size, setSize] = useState('16oz');
  const [addons, setAddons] = useState([]);

  // Reset state when a new item is opened
  useEffect(() => {
    if (isOpen && item) {
      if (item.customizations) {
        setSize(item.customizations.size);
        setAddons(item.customizations.addons);
      } else {
        setSize('16oz');
        setAddons([]);
      }
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleAddonToggle = (addon) => {
    setAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const availableAddons = [];
  if (['Frappe', 'Iced Coffee', 'Hot Coffee'].includes(item.category)) {
    availableAddons.push({ name: 'Extra Shot', price: 30 });
  }

  const nameLower = item.name.toLowerCase();
  if (nameLower.includes('americano')) {
    // Americano only gets Extra Shot, no extra syrups
  } else if (nameLower.includes('oreo cheesecake')) {
    availableAddons.push({ name: 'Cheesecake', price: 20 });
  } else if (nameLower.includes('cookies and cream') || nameLower.includes('cookies & cream')) {
    availableAddons.push({ name: 'Cookie Crumbs', price: 20 });
  } else if (nameLower.includes('choco java')) {
    availableAddons.push({ name: 'Chocolate Syrup', price: 20 });
  } else if (nameLower.includes('vanilla') || nameLower.includes('spanish')) {
    availableAddons.push({ name: 'Vanilla Syrup', price: 20 });
  } else if (nameLower.includes('caramel')) {
    availableAddons.push({ name: 'Caramel Drizzle', price: 20 });
  } else if (nameLower.includes('mocha') || nameLower.includes('chocolate') || nameLower.includes('oreo')) {
    availableAddons.push({ name: 'Chocolate Sauce', price: 20 });
  } else {
    // For plain coffees like Cafe Latte, offer standard syrups just in case
    availableAddons.push({ name: 'Vanilla Syrup', price: 20 });
    availableAddons.push({ name: 'Caramel Syrup', price: 20 });
  }

  if (item.category === 'Frappe') {
    availableAddons.push({ name: 'Whipped Cream Peak', price: 20 });
  }

  const ADDON_PRICES = {
    'Extra Shot': 30,
    'Vanilla Syrup': 20,
    'Caramel Syrup': 20,
    'Caramel Drizzle': 20,
    'Chocolate Sauce': 20,
    'Chocolate Syrup': 20,
    'Whipped Cream Peak': 20,
    'Cheesecake': 20,
    'Cookie Crumbs': 20
  };

  // Base price + size upcharge + addon upcharges
  let currentPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
  if (size === '22oz') currentPrice += 21;
  addons.forEach(addon => {
    if (ADDON_PRICES[addon]) currentPrice += ADDON_PRICES[addon];
  });

  const handleConfirm = () => {
    const customizedItem = {
      ...item,
      // Create a unique ID based on customizations so they don't stack improperly in cart
      // We base it on the original base ID. If editing, item.id might already have customizations appended,
      // so we use item.id split by '-' to get the base ID.
      id: `${item.id.toString().split('-')[0]}-${size}-${addons.join('-')}`,
      cartPrice: currentPrice,
      customizations: { size, addons }
    };

    if (editingItemId && onUpdateItem) {
      onUpdateItem(customizedItem, editingItemId);
    } else {
      onAddToCart(customizedItem);
    }
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div style={{ padding: '24px', paddingTop: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} 
            />
            <h2 className="modal-title" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.name}</h2>
            <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₱{currentPrice}</p>
          </div>

          {item.category === 'Frappe' && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--color-text)' }}>Size</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => setSize('16oz')}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${size === '16oz' ? 'var(--color-primary)' : '#e8e3df'}`,
                    background: size === '16oz' ? 'rgba(212, 154, 68, 0.1)' : 'transparent',
                    fontWeight: '600'
                  }}
                >
                  16oz
                </button>
                <button 
                  onClick={() => setSize('22oz')}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${size === '22oz' ? 'var(--color-primary)' : '#e8e3df'}`,
                    background: size === '22oz' ? 'rgba(212, 154, 68, 0.1)' : 'transparent',
                    fontWeight: '600'
                  }}
                >
                  22oz <span style={{ fontSize: '0.8rem', color: '#8a7f7b', display: 'block' }}>+₱21</span>
                </button>
              </div>
            </div>
          )}

          {availableAddons.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--color-text)' }}>Add-ons</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availableAddons.map((addon) => (
                  <label key={addon.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', border: '1px solid #e8e3df', cursor: 'pointer' }}>
                    <span style={{ fontWeight: '500' }}>{addon.name} (+₱{addon.price})</span>
                    <input 
                      type="checkbox" 
                      checked={addons.includes(addon.name)}
                      onChange={() => handleAddonToggle(addon.name)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <button 
            className="auth-submit-btn" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            onClick={handleConfirm}
          >
            {editingItemId ? 'Update Tray' : 'Add to Tray'} • ₱{currentPrice}
          </button>
        </div>
      </div>
    </div>
  );
}
