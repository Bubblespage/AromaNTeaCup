import { X, Coffee } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal about-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="auth-split-layout">
          {/* Left Side: Image / Branding for Desktop */}
          <div className="auth-brand-side">
            <div className="auth-brand-overlay">
              <Coffee size={48} className="auth-brand-icon" />
              <h2>Aroma N Tea Cup</h2>
              <p>Experience the finest blends crafted just for you.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600" alt="Coffee pouring" className="auth-brand-img" />
          </div>

          {/* Right Side: About Content */}
          <div className="auth-form-side" style={{ justifyContent: 'center' }}>
            <div className="auth-header-mobile">
              <div className="auth-logo">
                <Coffee size={24} />
              </div>
              <span className="auth-brand">Aroma N Tea Cup</span>
            </div>

            <h2 className="modal-title">Our Story</h2>
            <p className="modal-subtitle" style={{ marginBottom: '16px' }}>
              Welcome to Aroma N Tea Cup! We are passionate about serving the community with the highest quality, hand-crafted coffee and tea beverages.
            </p>
            <p className="modal-subtitle" style={{ marginBottom: '24px' }}>
              Whether you're looking for a quick morning pick-me-up or a relaxing afternoon treat, we've got you covered with our premium blends and freshly baked pastries.
            </p>

            <div className="about-details" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa', padding: '16px', borderRadius: '16px', border: '1px solid #e8e3df' }}>
              <div>
                <strong>📍 Visit Us</strong>
                <p style={{ margin: '4px 0 0', color: '#8a7f7b', fontSize: '0.9rem' }}>Carsadang Bago II, Imus Cavite</p>
              </div>
              <div>
                <strong>📞 Contact</strong>
                <p style={{ margin: '4px 0 0', color: '#8a7f7b', fontSize: '0.9rem' }}>09950829180</p>
              </div>
              <div>
                <strong>✉️ Email</strong>
                <p style={{ margin: '4px 0 0', color: '#8a7f7b', fontSize: '0.9rem' }}>aromanteacup@gmail.com</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
