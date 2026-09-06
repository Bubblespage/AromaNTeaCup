import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListOrdered, LogOut, Search, Clock, CheckCircle, Package, Layers, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('live_orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '₱', category: 'Frappe', image: '' });

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const fetchedOrders = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date (descending, assuming date is ISO string)
      fetchedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
      setOrders(fetchedOrders);
    });

    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const fetchedProducts = [];
      snapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
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
        alert("Failed to delete product.");
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
      alert("Failed to save product.");
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

  // Derived Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Aroma & Tea Admin</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'live_orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('live_orders')}
          >
            <ListOrdered size={20} /> Live Orders
            {activeOrdersCount > 0 && <span className="admin-badge">{activeOrdersCount}</span>}
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'batch_menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch_menu')}
          >
            <Layers size={20} /> Batch Menu
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={onSignOut}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'live_orders' && 'Live Order Management'}
            {activeTab === 'batch_menu' && 'Batch Menu Management'}
          </h1>
          <div className="admin-search">
            <Search size={18} />
            <input type="text" placeholder="Search orders..." />
          </div>
        </header>

        <div className="admin-content-area">
          {activeTab === 'dashboard' && (
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}><Package size={24} /></div>
                <div className="stat-info">
                  <p>Total Orders</p>
                  <h3>{totalOrders}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fdf5ec', color: '#8c5225' }}><Clock size={24} /></div>
                <div className="stat-info">
                  <p>Active Orders</p>
                  <h3>{activeOrdersCount}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}><CheckCircle size={24} /></div>
                <div className="stat-info">
                  <p>Total Revenue</p>
                  <h3>₱{totalRevenue.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'live_orders' && (
            <div className="kanban-board">
              <KanbanColumn
                title="Preparing"
                status="Preparing"
                orders={orders.filter(o => o.status === 'Preparing')}
                onUpdate={updateOrderStatus}
              />
              <KanbanColumn
                title="Out for Delivery"
                status="Out for Delivery"
                orders={orders.filter(o => o.status === 'Out for Delivery')}
                onUpdate={updateOrderStatus}
              />
              <KanbanColumn
                title="Delivered"
                status="Delivered"
                orders={orders.filter(o => o.status === 'Delivered')}
                onUpdate={updateOrderStatus}
              />
            </div>
          )}

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
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})} 
                  required 
                  placeholder="e.g. Mocha Frappe" 
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="text" 
                  value={productForm.price} 
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})} 
                  required 
                  placeholder="e.g. ₱89" 
                />
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
                <input 
                  type="text" 
                  value={productForm.image} 
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})} 
                  required 
                  placeholder="e.g. /mocha_frappe.jpg" 
                />
              </div>
              <button type="submit" className="auth-submit-btn" style={{ marginTop: '20px' }}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ title, status, orders, onUpdate }) {
  return (
    <div className="kanban-col">
      <div className="kanban-col-header">
        <h3>{title} <span className="kanban-count">{orders.length}</span></h3>
      </div>
      <div className="kanban-cards">
        {orders.map(order => (
          <div key={order.id} className="kanban-card">
            <div className="kc-header">
              <span className="kc-id">#{order.id}</span>
              <span className="kc-time">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="kc-customer">
              <strong>{order.customer.name}</strong>
              <p>{order.customer.address}</p>
            </div>
            <div className="kc-items">
              {order.items.map(item => (
                <div key={item.id} className="kc-item-row">
                  <span>{item.qty}x {item.name}</span>
                </div>
              ))}
            </div>
            <div className="kc-footer">
              <span className="kc-total">₱{order.total.toFixed(2)}</span>
              <div className="kc-actions">
                {status === 'Preparing' && (
                  <button onClick={() => onUpdate(order.id, 'Out for Delivery')} className="kc-btn kc-next">Send Out</button>
                )}
                {status === 'Out for Delivery' && (
                  <button onClick={() => onUpdate(order.id, 'Delivered')} className="kc-btn kc-done">Mark Delivered</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="kanban-empty">No orders</div>
        )}
      </div>
    </div>
  );
}
