import { useEffect, useState } from 'react';
import { X, RefreshCcw, Receipt, Coffee, Car, Home } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

export default function OrderTracker({ isOpen, onClose, currentUser }) {
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (!currentUser) {
      setLatestOrder(null);
      return;
    }

    const q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid), orderBy('date', 'desc'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setLatestOrder({ id: doc.id, ...doc.data() });
      } else {
        setLatestOrder(null);
      }
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const orderItemsCount = latestOrder?.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
  const orderTotal = latestOrder?.total || 0;

  return (
    <>
      <div className="tracker-overlay" onClick={onClose}>
        <div className="tracker-modal-wide" onClick={(e) => e.stopPropagation()}>
          
          <div className="tracker-header-wide">
            <div className="th-left">
              <span className="th-id">{latestOrder ? `${latestOrder.id}` : 'No Order'}</span>
              <h2>Live Order Tracker</h2>
            </div>
            <div className="th-right">
              <button className="icon-btn-small" title="Refresh">
                <RefreshCcw size={18} />
              </button>
              <button onClick={onClose} className="icon-btn-small" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="tracker-content-wide">
            {latestOrder ? (
              <>
                <div className="tracker-status-pill">
                  <RefreshCcw size={16} className="spin-icon" /> ☕ {latestOrder.status}
                </div>

                <div className="tracker-timeline-box">
                  
                  {/* Step 1: Received (Always Completed if we have an order) */}
                  <div className="tracker-row completed">
                    <div className="tr-icon-box">
                      <Receipt size={20} />
                    </div>
                    <div className="tr-text-box">
                      <h4>Order Received</h4>
                      <p>Paid via GCash • Queue confirmed</p>
                    </div>
                  </div>
                  <div className="tr-connector completed-line"></div>

                  {/* Step 2: Preparing */}
                  <div className={`tracker-row ${latestOrder.status === 'Preparing' ? 'active' : 'completed'}`}>
                    <div className={`tr-icon-box ${latestOrder.status === 'Preparing' ? 'pulsing' : ''}`}>
                      <Coffee size={20} />
                    </div>
                    <div className="tr-text-box">
                      <h4>Preparing your drink</h4>
                      <p>Barista is crafting your order...</p>
                    </div>
                  </div>
                  <div className={`tr-connector ${latestOrder.status !== 'Preparing' ? 'completed-line' : ''}`}></div>

                  {/* Step 3: Out for Delivery */}
                  <div className={`tracker-row ${latestOrder.status === 'Out for Delivery' ? 'active' : (latestOrder.status === 'Delivered' ? 'completed' : 'pending')}`}>
                    <div className={`tr-icon-box ${latestOrder.status === 'Out for Delivery' ? 'pulsing' : ''}`}>
                      <Car size={20} />
                    </div>
                    <div className="tr-text-box">
                      <h4>Out for Delivery</h4>
                      <p>Assigning driver...</p>
                    </div>
                  </div>
                  <div className={`tr-connector ${latestOrder.status === 'Delivered' ? 'completed-line' : ''}`}></div>

                  {/* Step 4: Delivered */}
                  <div className={`tracker-row ${latestOrder.status === 'Delivered' ? 'active' : 'pending'}`}>
                    <div className={`tr-icon-box ${latestOrder.status === 'Delivered' ? 'pulsing' : ''}`}>
                      <Home size={20} />
                    </div>
                    <div className="tr-text-box">
                      <h4>Delivered & Enjoyed</h4>
                      <p>Fresh drinks received</p>
                    </div>
                  </div>
                </div>

                <div className="tracker-footer-wide">
                  <div className="tf-left">
                    {orderItemsCount} items • ₱{orderTotal.toFixed(2)}
                  </div>
                  <button className="tf-right-btn" onClick={onClose}>
                    Close Tracker
                  </button>
                </div>
              </>
            ) : (
              <div className="tracker-empty">
                <Coffee size={48} opacity={0.2} />
                <h3>No Active Orders</h3>
                <p>You haven't placed any orders yet.</p>
                <button className="tracker-shop-btn" onClick={onClose}>
                  Browse Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
