import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListOrdered, LogOut, Search, Clock, CheckCircle, Package, Layers, X, Settings, FileText, Image } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('live_orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '₱', category: 'Frappe', image: '' });

  // Storefront Settings State
  const [storeSettings, setStoreSettings] = useState({
    onlineOrdersAcceptance: true,
    gcashQrUrl: 'assets/images/gcash_qr.png'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // GCash Verify Modal State
  const [verifyModalOrder, setVerifyModalOrder] = useState(null);

  // Live Orders Filter State
  const [orderFilter, setOrderFilter] = useState('All');

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const fetchedOrders = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ ...doc.data(), id: doc.id });
      });
      // Sort by date descending
      fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(fetchedOrders);
    }, (err) => {
      console.error("Admin order fetch error:", err);
    });

    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const fetchedProducts = [];
      snapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
    });

    const settingsRef = doc(db, 'settings', 'storefront');
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setStoreSettings(docSnap.data());
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeSettings();
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '₱', category: 'Frappe', image: '' });
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id.toString()));
      } catch (err) {
        console.error("Error deleting product: ", err);
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id.toString()), productForm);
      } else {
        const newId = Date.now().toString();
        await setDoc(doc(db, 'products', newId), { id: newId, ...productForm });
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error("Error saving product: ", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating order: ", err);
      alert("Failed to update order status.");
    }
  };

  const handleVerifyConfirm = async () => {
    if (verifyModalOrder) {
      await updateOrderStatus(verifyModalOrder.id, 'Preparing');
      setVerifyModalOrder(null);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'storefront'), storeSettings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error("Error saving settings:", err);
      alert('Failed to save settings.');
    }
    setIsSavingSettings(false);
  };

  // Derived Stats for Dashboard
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;
  const deliveriesDone = orders.filter(o => o.status === 'Delivered').length;
  
  // Recharts Data (Cumulative Revenue)
  const chartData = [...orders].reverse().map((o, i) => ({
    name: i + 1,
    revenue: o.total || 0,
  }));
  let cumulative = 0;
  chartData.forEach(d => {
    cumulative += d.revenue;
    d.revenue = cumulative;
  });

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Aroma & Tea Admin</h2>
          <span className="brand-sub">SUPER ADMIN</span>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-btn ${activeTab === 'live_orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('live_orders')}
          >
            <ListOrdered size={18} /> Live Orders
            {activeOrdersCount > 0 && <span className="admin-badge">{activeOrdersCount}</span>}
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'batch_menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch_menu')}
          >
            <Layers size={18} /> Batch Drops & Menu
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Storefront Settings
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={onSignOut}>
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="header-admin-btn">Super Admin</button>
        </header>

        <div className="admin-content-area">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-wrapper">
              <div className="tab-header-flex">
                <h2>Dashboard Overview</h2>
                <button className="export-btn">📥 Export PDF</button>
              </div>

              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <p>TOTAL REVENUE</p>
                    <h3>₱{totalRevenue.toFixed(2)}</h3>
                    <span className="stat-subtext">From completed deliveries</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-info">
                    <p>ACTIVE ORDERS</p>
                    <h3>{activeOrdersCount} Orders</h3>
                    <span className="stat-subtext">In pipeline now</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <p>DELIVERIES DONE</p>
                    <h3>{deliveriesDone} Orders</h3>
                    <span className="stat-subtext">Completed drops</span>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h3>📈 Revenue Trend</h3>
                    <p>Cumulative revenue from completed deliveries over time</p>
                  </div>
                  <span className="chart-badge">Last {orders.length} Orders</span>
                </div>
                <div className="chart-container" style={{ height: 350, width: '100%', marginTop: '30px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8c5225" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8c5225" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e4" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8a7465' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v/1000).toFixed(1)}k`} tick={{ fontSize: 12, fill: '#8a7465' }} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        formatter={(value) => [`₱${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8c5225" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* LIVE ORDERS TAB */}
          {activeTab === 'live_orders' && (
            <div className="pipeline-wrapper">
              <div className="pipeline-card">
                <div className="pipeline-header">
                  <h2>Live Kitchen Pipeline</h2>
                  <div className="pipeline-filters">
                    <button className="export-btn-outline">📥 Export PDF</button>
                  </div>
                </div>

                <div className="pipeline-table-wrapper">
                  <table className="pipeline-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}><input type="checkbox" /></th>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>ITEMIZED DETAILS &amp; SPECS</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><input type="checkbox" /></td>
                          <td>
                            <strong>{order.id.startsWith('ATC') ? order.id : `#ATC-${order.id}`}</strong>
                            <div className="pipeline-date">{new Date(order.date).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</div>
                          </td>
                          <td>
                            <strong>{order.customer?.name}</strong>
                            <div className="pipeline-subtext">{order.customer?.phone}</div>
                            <span className="pipeline-tag gcash">GCash</span>
                            {order.refNumber && (
                              <div style={{ fontSize: '0.8rem', color: '#8a7f7b', marginTop: '4px' }}>Ref: {order.refNumber}</div>
                            )}
                          </td>
                          <td>
                            {order.items?.map((item, idx) => (
                              <div key={idx}><strong>{item.qty}x {item.name}</strong></div>
                            ))}
                            <div className="pipeline-subtext">Rider Delivery (Paid to Rider)</div>
                          </td>
                          <td><strong>₱{order.total?.toFixed(2)}</strong></td>
                          <td>
                            {order.status === 'Delivered' ? (
                              <span className="status-pill delivered">✓ Completed Delivery</span>
                            ) : order.status === 'Out for Delivery' ? (
                              <span className="status-pill out">🛵 Out for Delivery</span>
                            ) : order.status === 'Verify GCash' ? (
                              <span className="status-pill" style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>⏳ Verify GCash</span>
                            ) : (
                              <span className="status-pill prep">☕ Preparing</span>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-btn-outline"><FileText size={16} /></button>
                              {order.screenshotUrl && (
                                <a href={order.screenshotUrl} target="_blank" rel="noopener noreferrer" className="icon-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'inherit' }}>
                                  <Image size={16} />
                                </a>
                              )}
                              {order.status === 'Verify GCash' && (
                                <button className="track-btn" style={{ background: '#d97706' }} onClick={() => setVerifyModalOrder(order)}>Verify Pay</button>
                              )}
                              {order.status === 'Preparing' && (
                                <button className="track-btn" onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}>Send Out</button>
                              )}
                              {order.status === 'Out for Delivery' && (
                                <button className="track-btn" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Mark Delivered</button>
                              )}
                              {order.status === 'Delivered' && (
                                <button className="track-btn" disabled style={{ opacity: 0.5 }}>Completed</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="7" className="pipeline-empty">No active orders right now.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STOREFRONT SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="settings-wrapper">
              <div className="tab-header-flex">
                <div>
                  <h2>Storefront & Operations Settings</h2>
                  <p>Global shop controls, GCash merchant QR, and customer alerts.</p>
                </div>
                <button className="save-btn" onClick={handleSaveSettings} disabled={isSavingSettings}>
                  ✓ Save Changes
                </button>
              </div>

              <div className="settings-card">
                <h3>Store Operations & Kitchen Availability</h3>
                <div className="settings-row">
                  <div className="settings-info">
                    <h4>Online Orders Acceptance</h4>
                    <p>Allow customers to checkout and place fresh drop orders</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={storeSettings.onlineOrdersAcceptance} onChange={(e) => setStoreSettings({...storeSettings, onlineOrdersAcceptance: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>

              </div>



              <div className="settings-card mt-4">
                <h3>Merchant QR Image Settings (GCash Only)</h3>
                <div className="input-group-styled">
                  <div className="input-header">
                    <span className="slot-line"></span>
                    <label>GCash QR Asset / URL</label>
                    <span className="slot-line"></span>
                  </div>
                  <div className="input-with-icon">
                    <span className="input-prefix">QR</span>
                    <input type="text" value={storeSettings.gcashQrUrl} onChange={(e) => setStoreSettings({...storeSettings, gcashQrUrl: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BATCH MENU TAB */}
          {activeTab === 'batch_menu' && (
            <div className="admin-menu-table">
              <div className="table-header">
                <h3>Current Menu Items ({products.length})</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="add-menu-btn" onClick={handleOpenAdd}>+ Add Item</button>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(item => (
                      <tr key={item.id}>
                        <td><img src={item.image} alt={item.name} className="table-img" /></td>
                        <td><strong>{item.name}</strong></td>
                        <td><span className="table-cat-badge">{item.category}</span></td>
                        <td>{item.price}</td>
                        <td>
                          <button className="table-action-btn edit" onClick={() => handleOpenEdit(item)}>Edit</button>
                          <button className="table-action-btn delete" onClick={() => handleDeleteProduct(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No products found. Please seed the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>
              <X size={24} />
            </button>
            <h2 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form className="auth-form" style={{ marginTop: '20px' }} onSubmit={handleSaveProduct}>
              {/* Product form fields stay the same */}
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="text" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #e8e3df', borderRadius: '14px', fontSize: '1rem', background: '#fafafa' }}
                  value={productForm.category} 
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                >
                  <option value="Frappe">Frappe</option>
                  <option value="Iced Coffee">Iced Coffee</option>
                  <option value="Hot Coffee">Hot Coffee</option>
                  <option value="Pastries">Pastries</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL or Path</label>
                <input type="text" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} required />
              </div>
              <button type="submit" className="auth-submit-btn" style={{ marginTop: '20px' }}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GCash Verification Modal */}
      {verifyModalOrder && (
        <div className="modal-overlay" onClick={() => setVerifyModalOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <button className="modal-close" onClick={() => setVerifyModalOrder(null)}>
              <X size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f5f1ed', padding: '10px', borderRadius: '12px', color: '#3a2a22' }}>
                <CheckCircle size={24} />
              </div>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.4rem' }}>Verify GCash Payment</h2>
            </div>
            
            <p style={{ color: '#8a7f7b', lineHeight: '1.5', marginBottom: '20px' }}>
              Confirm receipt of payment from <strong>{verifyModalOrder.customer?.name}</strong> for the amount of <strong>₱{verifyModalOrder.total?.toFixed(2)}</strong> before forwarding to the kitchen pipeline.
            </p>

            {verifyModalOrder.refNumber && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', color: '#3a2a22', marginBottom: '8px' }}>REFERENCE NUMBER</label>
                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontWeight: 'bold', letterSpacing: '2px', color: '#3a2a22' }}>
                  {verifyModalOrder.refNumber}
                </div>
              </div>
            )}

            {verifyModalOrder.screenshotUrl ? (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', color: '#3a2a22', marginBottom: '8px' }}>CUSTOMER PAYMENT SCREENSHOT</label>
                <div style={{ background: '#f9f9f9', padding: '8px', borderRadius: '16px', border: '1px solid #e0e0e0', position: 'relative' }}>
                  <img src={verifyModalOrder.screenshotUrl} alt="GCash Receipt" style={{ width: '100%', borderRadius: '12px', maxHeight: '350px', objectFit: 'contain' }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#8a7f7b', marginTop: '8px', fontStyle: 'italic' }}>Tap the image in a new tab to zoom in</p>
              </div>
            ) : (
              <div style={{ marginBottom: '24px', padding: '20px', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center', color: '#8a7f7b', border: '1px dashed #ccc' }}>
                No screenshot uploaded by customer.
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setVerifyModalOrder(null)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid #e0e0e0', color: '#3a2a22', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyConfirm}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#3a2a22', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                Confirm & Prepare Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
