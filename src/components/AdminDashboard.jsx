import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListOrdered, LogOut, Search, Clock, CheckCircle, Package, Layers } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { menuItems } from '../data';

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('live_orders');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const fetchedOrders = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date (descending, assuming date is ISO string)
      fetchedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

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
                <h3>Current Menu Items</h3>
                <button className="add-menu-btn">+ Add Item</button>
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
                    {menuItems.map(item => (
                      <tr key={item.id}>
                        <td><img src={item.image} alt={item.name} className="table-img" /></td>
                        <td><strong>{item.name}</strong></td>
                        <td><span className="table-cat-badge">{item.category}</span></td>
                        <td>{item.price}</td>
                        <td>
                          <button className="table-action-btn edit">Edit</button>
                          <button className="table-action-btn delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
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
