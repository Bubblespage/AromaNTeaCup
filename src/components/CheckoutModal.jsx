import { useState, useRef } from 'react';
import { X, MapPin, User, Phone, Home, ChevronRight, CheckCircle, Package, Star, Calendar, Info, ChevronLeft, QrCode, Image } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const DELIVERY_FEE = 60;

const ZONES = {
  'Carsadang Bago II': [
    'Legian 1', 'Legian 2', 'Montefarro',
    'ACM Woodstock', 'Palazzo Bello', 'Sampaguita Village',
    'Starkville Subd.', 'Grand Residences', 'Dreamville Subd.',
    'Other area in Carsadang Bago II',
  ],
  'Bucandala': [
    'Bucandala 1', 'Bucandala 2', 'Bucandala 3',
    'Bucandala 4', 'Bucandala 5', 'Other area in Bucandala',
  ]
};

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess, onOpenTracker, currentUser }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Carsadang Bago II');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', paymentMethod: 'gcash', notes: '',
  });
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseInt(item.price.replace('₱', '')) * item.qty;
  }, 0);
  const total = subtotal + DELIVERY_FEE;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 800);
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    
    try {
      const num = `ATC-${Date.now().toString().slice(-6)}`;
      setOrderNumber(num);
      
      const orderData = {
        id: num,
        items: cartItems,
        customer: form,
        refNumber: refNumber || null,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        date: new Date().toISOString(),
        status: 'Preparing',
        userId: currentUser?.uid || null,
      };

      await setDoc(doc(db, 'orders', num), orderData);

      setIsLoading(false);
      setStep(4);
    } catch (err) {
      console.error("Error saving order: ", err);
      setIsLoading(false);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSubdivision('');
    setRefNumber('');
    setScreenshot(null);
    setForm({ name: '', phone: '', address: '', paymentMethod: 'gcash', notes: '' });
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleDone = () => { handleClose(); onOrderSuccess(); };

  const handleConfirmArea = () => {
    // Pre-fill address with subdivision if selected
    if (selectedSubdivision && !selectedSubdivision.startsWith('Other area')) {
      setForm(f => ({ ...f, address: `${selectedSubdivision}, ${selectedZone}` }));
    }
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={step !== 3 ? handleClose : undefined}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>

        {/* ── STEP 1: Area Confirmation ── */}
        {step === 1 && (
          <div className="area-step">
            <button className="modal-close" onClick={handleClose}><X size={18} /></button>

            {/* Top branding strip */}
            <div className="area-top">
              <div className="area-brand-pill">
                <MapPin size={14} />
                <span>Delivery Zone</span>
              </div>
              <h3>Where are you located?</h3>

              <div className="zone-tabs">
                {Object.keys(ZONES).map(zone => (
                  <button 
                    key={zone} 
                    className={`zone-tab ${selectedZone === zone ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedZone(zone);
                      setSelectedSubdivision('');
                    }}
                  >
                    {zone}
                  </button>
                ))}
              </div>

              <p>We deliver within <strong>{selectedZone}</strong>. Pick your subdivision below.</p>
            </div>

            {/* Subdivision grid */}
            <div className="subdivision-grid">
              {ZONES[selectedZone].map((sub, i) => {
                const isLast = i === ZONES[selectedZone].length - 1;
                return (
                  <button
                    key={sub}
                    className={`subdivision-chip ${selectedSubdivision === sub ? 'selected' : ''} ${isLast ? 'full-width' : ''}`}
                    onClick={() => setSelectedSubdivision(sub)}
                  >
                    {selectedSubdivision === sub && <span className="chip-check">✓ </span>}
                    {sub}
                  </button>
                );
              })}
            </div>

            {/* Selected label */}
            {selectedSubdivision && (
              <p className="selected-label">
                📍 Delivering to: <strong>{selectedSubdivision}</strong>
              </p>
            )}

            {/* Actions */}
            <div className="area-actions">
              <button className="area-back-btn" onClick={handleClose}>← Go Back</button>
              <button
                className={`area-go-btn ${!selectedSubdivision ? 'disabled' : ''}`}
                onClick={handleConfirmArea}
                disabled={!selectedSubdivision}
              >
                Continue to Checkout →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Full Web Checkout Form ── */}
        {step === 2 && (
          <div className="checkout-full-layout">
            <div className="co-header-full">
              <div className="co-header-title">
                <div className="co-header-icon"><Package size={20}/></div>
                <h2>Review & Checkout</h2>
              </div>
              <button className="modal-close" style={{position:'static'}} onClick={handleClose}><X size={20}/></button>
            </div>
            
            <form id="checkout-form" className="co-body-full" onSubmit={handlePlaceOrder}>
              {/* LEFT COLUMN */}
              <div className="co-left-col">
                {/* Contact & Delivery Details */}
                <div className="co-section-block">
                  <h4 className="co-section-title"><Star size={12}/> CONTACT & DELIVERY DETAILS</h4>
                  <div className="co-form-row">
                    <div className="co-input-group">
                      <label>Recipient Name *</label>
                      <div className="co-input-wrapper">
                        <User size={16}/>
                        <input name="name" type="text" placeholder="Juan dela Cruz" value={form.name} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="co-input-group">
                      <label>Mobile Number *</label>
                      <div className="co-input-wrapper">
                        <Phone size={16}/>
                        <span className="phone-prefix">+63</span>
                        <input name="phone" type="tel" placeholder="9XXXXXXXXX" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Enter a 10-digit phone number after +63" />
                      </div>
                    </div>
                  </div>
                  <div className="co-input-group">
                    <label>Complete Delivery Address *</label>
                    <div className="co-input-wrapper">
                      <MapPin size={16}/>
                      <input name="address" type="text" value={form.address} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                <div className="co-section-block">
                  <h4 className="co-section-title"><Star size={12}/> RIDER / STORE NOTES (Optional)</h4>
                  <div className="co-input-wrapper textarea-wrapper">
                    <textarea name="notes" placeholder="e.g. call upon arrival..." value={form.notes} onChange={handleChange} rows={2}/>
                  </div>
                </div>
                
                {/* Promise */}
                <div className="co-promise-box">
                  <div className="co-promise-icon">☕</div>
                  <div className="co-promise-text">
                    <h5>Freshly Brewed Promise</h5>
                    <p>Your coffees and teas are prepared with love and the finest ingredients.</p>
                  </div>
                </div>
              </div>
              
              {/* RIGHT COLUMN */}
              <div className="co-right-col">
                {/* Payment Method */}
                <div className="co-section-block">
                  <h4 className="co-section-title"><Star size={12}/> PAYMENT METHOD</h4>
                  <button type="button" className={`co-payment-btn active`}>
                    <span className="pay-icon">📱</span> <span>GCash (Online Payment)</span>
                  </button>
                  <div className="co-info-box">
                    <Info size={16} className="info-icon"/> 
                    <p>You will be redirected to the secure GCash payment portal after clicking Place Order.</p>
                  </div>
                </div>
                
                {/* Payment Breakdown */}
                <div className="co-section-block">
                  <h4 className="co-section-title"><Star size={12}/> PAYMENT BREAKDOWN</h4>
                  
                  <div className="co-breakdown">
                    <div className="co-b-row">
                      <span>Items Subtotal ({cartItems.reduce((a,b)=>a+b.qty,0)} items)</span>
                      <strong>₱{subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="co-b-row">
                      <span>Delivery Fee</span>
                      <strong className="fee-badge">₱{DELIVERY_FEE.toFixed(2)}</strong>
                    </div>
                    <div className="co-b-row co-b-total">
                      <span>Grand Total:</span>
                      <span className="total-badge">₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            
            <div className="co-footer-full">
              <button type="button" className="co-back-btn" onClick={() => setStep(1)}>
                <ChevronLeft size={18}/> Back to Location
              </button>
              <div className="co-footer-action">
                <div className="co-footer-total">
                  <span>Paying via GCash</span>
                  <strong>₱{total.toFixed(2)}</strong>
                </div>
                <button type="submit" form="checkout-form" className={`co-place-btn-new ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                  {isLoading ? <span className="spinner" /> : <><CheckCircle size={18}/> Place Order</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: GCash Payment ── */}
        {step === 3 && (
          <div className="gcash-full-modal">
            <div className="gcash-header">
              <button className="gcash-close-btn" onClick={handleClose}><X size={20} /></button>
              <div className="gcash-header-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5v-4h16V7"/></svg>
                Complete Payment
              </div>
              <div style={{width: 40}}></div> {/* Spacer to center title */}
            </div>
            
            <div className="gcash-content">
              <p className="gcash-subtitle-1">Paying via GCash</p>
              <p className="gcash-subtitle-2">Scan the QR code below using your GCash app.</p>
              
              <div className="gcash-qr-box">
                <img src="/square-qr.png" alt="GCash QR" />
              </div>
              
              <div className="gcash-amount-text">
                <span>Total:</span> ₱{total.toFixed(2)}
              </div>
              
              <div className="gcash-ref-container">
                <div className="gcash-ref-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Reference Number (Optional)"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                />
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              
              <button className="gcash-upload-btn-new" onClick={() => fileInputRef.current?.click()}>
                <Image size={18} /> {screenshot ? screenshot.name : 'Upload Screenshot Instead'}
              </button>
              
              <div className="gcash-footer-actions">
                <button className="gcash-btn-cancel" onClick={() => setStep(2)}>Cancel</button>
                <button 
                  className={`gcash-btn-submit ${isLoading ? 'loading' : ''}`}
                  onClick={handlePaymentSubmit}
                  disabled={isLoading || (!refNumber && !screenshot)}
                >
                  {isLoading ? <span className="spinner" /> : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <div className="co-success-card">
            <div className="co-success-icon"><CheckCircle size={48} strokeWidth={2} /></div>
            <h2>Order Placed! <span role="img" aria-label="coffee">☕</span></h2>
            <p className="co-success-sub">Thank you, {form.name.split(' ')[0]}! Your order is being prepared.</p>
            
            <div className="co-receipt-box">
              <div className="co-receipt-header">
                <Package size={16} /> Order #{orderNumber}
              </div>
              <div className="co-receipt-body">
                <div className="co-receipt-row"><span>Delivering to</span><strong>{form.address}</strong></div>
                <div className="co-receipt-row"><span>Contact</span><strong>{form.phone}</strong></div>
                <div className="co-receipt-row"><span>Payment</span><strong>GCash</strong></div>
                <div className="co-receipt-row"><span>Total</span><strong>₱{total.toFixed(2)}</strong></div>
              </div>
            </div>
            
            <div className="co-eta-note">
              🕒 Estimated delivery: <strong>30–45 minutes</strong>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '24px' }}>
              <button className="co-done-btn-new" style={{ flex: 1, background: '#f5f1ed', color: '#8c7b74', boxShadow: 'none' }} onClick={handleDone}>Back to Menu</button>
              <button className="co-done-btn-new" style={{ flex: 1 }} onClick={() => { handleDone(); onOpenTracker(); }}>Track Order</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
