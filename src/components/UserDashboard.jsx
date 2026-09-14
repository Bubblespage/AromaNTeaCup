import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Clock, Coffee, ShoppingBag, CheckCircle, FileText, X, MapPin, Truck, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function UserDashboard({ onSignOut, onReorder, onBack, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [receiptModalOrder, setReceiptModalOrder] = useState(null);
  const [reorderStatus, setReorderStatus] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      // Sort chronologically (newest first) locally to bypass missing index
      fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleReorderClick = (orderId, items) => {
    onReorder(items);
    setReorderStatus(prev => ({ ...prev, [orderId]: true }));
    setTimeout(() => {
      setReorderStatus(prev => ({ ...prev, [orderId]: false }));
    }, 2000);
  };

  const renderTimeline = (status) => {
    if (status === 'Delivered') return null; // Only show for active
    const steps = ['Verify GCash', 'Preparing', 'Out for Delivery'];
    
    let currentStepIndex = steps.indexOf(status);
    if (currentStepIndex === -1 && status !== 'Delivered') {
      currentStepIndex = 1; // Default to preparing if unknown
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '16px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '32px', right: '32px', height: '2px', background: '#e0e0e0', zIndex: 0, transform: 'translateY(-50%)' }}></div>
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const color = isActive ? 'var(--color-primary)' : isCompleted ? '#2ecc71' : '#dcdcdc';
          const iconColor = isActive || isCompleted ? 'white' : '#8a7f7b';

          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
                {idx === 0 ? <FileText size={14} color={iconColor} /> : idx === 1 ? <Coffee size={14} color={iconColor} /> : <Truck size={14} color={iconColor} />}
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 'bold' : '600', color: isActive ? 'var(--color-text)' : '#8a7f7b' }}>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const downloadReceipt = async () => {
    if (!receiptModalOrder) return;
    const printArea = document.getElementById('receipt-print-area');
    if (!printArea) return;
    
    try {
      const canvas = await html2canvas(printArea, { 
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      doc.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      doc.save(`Receipt_${receiptModalOrder.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', paddingBottom: '60px' }}>
      <header className="admin-header glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onBack} style={{ background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontWeight: '600' }}>
              <ArrowLeft size={20} /> Menu
            </button>
            <h1 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-heading)' }}>My Account</h1>
          </div>
          <button onClick={onSignOut} style={{ color: '#e74c3c', fontWeight: '600', background: 'transparent' }}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 8px 0' }}>Order History</h2>
          <p style={{ color: '#8a7f7b', fontSize: '1.1rem', margin: 0 }}>Review your past orders and quickly reorder your favorites.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map(order => (
            <div 
              key={order.id} 
              style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #f0ece9', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>Order {order.id.startsWith('ATC') ? order.id : `#ATC-${order.id}`}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a7f7b', fontSize: '0.9rem' }}>
                    <Clock size={14} /> 
                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '6px 16px', 
                    background: order.status === 'Delivered' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(212, 154, 68, 0.1)', 
                    color: order.status === 'Delivered' ? '#2ecc71' : 'var(--color-primary)', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold', 
                    marginBottom: '4px' 
                  }}>
                    {order.status === 'Delivered' ? '✓ Delivered' : order.status}
                  </span>
                  <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--color-primary)' }}>₱{order.total?.toFixed(2)}</div>
                </div>
              </div>

              {order.status !== 'Delivered' && renderTimeline(order.status)}

              <div style={{ margin: '24px 0' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f1ed', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Coffee size={24} color="var(--color-primary)" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-text)' }}>{item.qty}x {item.name}</div>
                      {item.customizations && (
                        <div style={{ fontSize: '0.85rem', color: '#8a7f7b', marginTop: '2px' }}>
                          Size: {item.customizations.size}
                          {item.customizations.addons?.map(a => `, +${a}`)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setReceiptModalOrder(order)}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid #e0e0e0', color: 'var(--color-text)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={18} /> View E-Receipt
                </button>
                <button 
                  onClick={() => handleReorderClick(order.id, order.items)}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', background: reorderStatus[order.id] ? '#2ecc71' : 'var(--color-text)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {reorderStatus[order.id] ? (
                    <><CheckCircle size={18} /> Added to Cart!</>
                  ) : (
                    <><RefreshCw size={18} /> Reorder This</>
                  )}
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <ShoppingBag size={48} color="#c0b8b5" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0' }}>No orders yet</h3>
              <p style={{ color: '#8a7f7b', margin: 0 }}>When you place orders, they will appear here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Receipt Modal */}
      {receiptModalOrder && (
        <div className="modal-overlay" onClick={() => setReceiptModalOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', padding: '24px' }}>
            <button className="modal-close" onClick={() => setReceiptModalOrder(null)}>
              <X size={24} />
            </button>
            
            <div id="receipt-print-area" style={{ background: 'white', padding: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <FileText size={24} color="white" />
                </div>
                <h2 className="modal-title" style={{ margin: '0 0 4px 0', fontSize: '1.3rem' }}>E-Receipt</h2>
                <p style={{ margin: 0, color: '#8a7f7b', fontSize: '0.85rem' }}>{new Date(receiptModalOrder.date).toLocaleString()}</p>
              </div>
              
              <div style={{ borderTop: '2px dashed #e0e0e0', borderBottom: '2px dashed #e0e0e0', padding: '16px 0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#8a7f7b' }}>Order ID</span>
                  <strong style={{ color: 'var(--color-text)' }}>{receiptModalOrder.id.startsWith('ATC') ? receiptModalOrder.id : `#ATC-${receiptModalOrder.id}`}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#8a7f7b' }}>Payment Method</span>
                  <strong style={{ color: 'var(--color-text)' }}>{receiptModalOrder.screenshotUrl ? 'GCash' : 'Cash on Delivery'}</strong>
                </div>

                {receiptModalOrder.customer && (
                  <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.8rem' }}>
                    <div style={{ marginBottom: '4px' }}><strong>{receiptModalOrder.customer.name}</strong></div>
                    <div style={{ color: '#8a7f7b', marginBottom: '4px' }}>{receiptModalOrder.customer.phone}</div>
                    {receiptModalOrder.customer.address && <div style={{ color: '#8a7f7b' }}>{receiptModalOrder.customer.address}</div>}
                    {receiptModalOrder.customer.subdivision && <div style={{ color: '#8a7f7b' }}>{receiptModalOrder.customer.subdivision}</div>}
                  </div>
                )}

                <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '0.8rem', color: '#8a7f7b', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</div>
                {receiptModalOrder.items.map((item, idx) => {
                  const itemPrice = item.cartPrice || (typeof item.price === 'string' ? parseInt(item.price.replace('₱', '').replace(',', '')) : (item.price || 0));
                  return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: 'var(--color-text)' }}>{item.qty}x {item.name}</strong>
                      {item.customizations && (
                        <div style={{ fontSize: '0.75rem', color: '#8a7f7b', marginTop: '2px' }}>
                          {item.customizations.size} {item.customizations.addons?.length ? `+ ${item.customizations.addons.join(', ')}` : ''}
                        </div>
                      )}
                    </div>
                    <strong style={{ color: 'var(--color-text)' }}>₱{(itemPrice * item.qty).toFixed(2)}</strong>
                  </div>
                )})}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>Total Amount</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--color-primary)' }}>₱{receiptModalOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={downloadReceipt}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} /> Download
              </button>
              <button 
                onClick={() => setReceiptModalOrder(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--color-background)', color: 'var(--color-text)', border: '1px solid #e0e0e0', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
