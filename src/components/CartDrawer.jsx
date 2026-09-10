import { X, Minus, Plus, ShoppingBag, Trash2, ChevronRight, Pencil } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onAdd, onRemove, onDelete, onCheckout, onEdit }) {
  const DELIVERY_FEE = 60;

  const handleBrowseMenu = () => {
    onClose();
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.cartPrice || parseInt(item.price.replace('₱', '').replace(',', ''));
    return sum + itemPrice * item.qty;
  }, 0);

  const total = subtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0);
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {isOpen && <div className="cart-backdrop" onClick={onClose} />}

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header" style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="cart-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Your Cart</h2>
            {itemCount > 0 && (
              <span className="cart-count-badge" style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>{itemCount}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={onClose} style={{ background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={40} strokeWidth={1.5} />
              </div>
              <p>Your cart is empty</p>
              <span>Add something delicious from our menu!</span>
              <button className="browse-btn" onClick={handleBrowseMenu}>Browse Menu</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img-wrap">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  {item.customizations && (
                    <div style={{ fontSize: '0.8rem', color: '#8a7f7b', marginBottom: '4px' }}>
                      {item.customizations.size !== 'Regular' && <div>Size: {item.customizations.size}</div>}
                      {item.customizations.addons.map(addon => (
                        <div key={addon}>+ {addon}</div>
                      ))}
                    </div>
                  )}
                  <span className="cart-item-price">₱{item.cartPrice || item.price.replace('₱', '')}</span>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => onRemove(item.id)}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onAdd(item)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.customizations && (
                      <button className="edit-btn" onClick={() => onEdit && onEdit(item)} style={{ background: 'transparent', color: '#8a7f7b', cursor: 'pointer', border: 'none' }} title="Edit Customizations">
                        <Pencil size={15} />
                      </button>
                    )}
                    <button className="delete-btn" onClick={() => onDelete(item.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <span className="cart-item-subtotal">
                    ₱{((item.cartPrice || parseInt(item.price.replace('₱', ''))) * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery fee</span>
                <span>₱{DELIVERY_FEE}</span>
              </div>
              <div className="cart-divider" />
              <div className="cart-summary-row total-row">
                <span>Total</span>
                <span className="total-price">₱{total.toLocaleString()}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <ChevronRight size={20} />
            </button>
            <p className="checkout-note">🔒 Secure checkout.</p>
          </div>
        )}
      </div>
    </>
  );
}
