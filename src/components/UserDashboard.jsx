import { useState } from 'react';
import { ArrowLeft, RefreshCw, Clock, Coffee, ShoppingBag } from 'lucide-react';
import { menuItems } from '../data';

export default function UserDashboard({ onSignOut, onReorder, onBack }) {
  // Mock order history data
  const mockOrders = [
    {
      id: 'ORD-7742',
      date: '2023-11-20T08:30:00',
      status: 'Delivered',
      total: 510,
      items: [
        { ...menuItems[0], qty: 1, cartPrice: 295, customizations: { size: 'Large', addons: [] } },
        { ...menuItems[10], qty: 1 }
      ]
    },
    {
      id: 'ORD-6511',
      date: '2023-11-15T14:15:00',
      status: 'Delivered',
      total: 260,
      items: [
        { ...menuItems[7], qty: 1 } // Iced Vanilla Latte
      ]
    }
  ];

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
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>Order History</h2>
          <p style={{ color: '#8a7f7b', fontSize: '1.1rem' }}>Review your past orders and quickly reorder your favorites.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {mockOrders.map(order => (
            <div key={order.id} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0ece9', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Order {order.id}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a7f7b', fontSize: '0.9rem' }}>
                    <Clock size={14} /> 
                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    {order.status}
                  </span>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₱{order.total}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f1ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coffee size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.qty}x {item.name}</div>
                      {item.customizations && (
                        <div style={{ fontSize: '0.85rem', color: '#8a7f7b' }}>
                          Size: {item.customizations.size}
                          {item.customizations.addons.map(a => `, +${a}`)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onReorder(order.items)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--color-text)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <RefreshCw size={18} /> Reorder This
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
