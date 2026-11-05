import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getBooks } from '../lib/firebase';
import SellerPanel from '../components/SellerPanel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });
  const [tempReceiveNumber, setTempReceiveNumber] = useState('0712345678');

  useEffect(() => {
    const savedSales = localStorage.getItem('luminiousbooks_sales');
    if (savedSales) {
      setSalesData(JSON.parse(savedSales));
    }
    const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
    if (savedPhone) {
      setTempReceiveNumber(savedPhone);
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!tempReceiveNumber || tempReceiveNumber.length < 9) {
      alert('Please enter a valid M-Pesa phone number.');
      return;
    }
    localStorage.setItem('luminiousbooks_mpesa_phone', tempReceiveNumber);
    alert('M-Pesa Send Money phone number updated successfully!');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Analytics', icon: '📊' },
    { id: 'add', label: 'Add Book', icon: '➕' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <Head>
        <title>Admin Dashboard - Luminous Books</title>
      </Head>

      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' }}>
          ⚙️ STORE ADMIN
        </h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.85rem 1rem',
                border: 'none', borderRadius: '10px', color: activeTab === item.id ? '#fff' : '#94a3b8',
                backgroundColor: activeTab === item.id ? '#2563eb' : 'transparent', fontWeight: '600', cursor: 'pointer'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📊 Analytics Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>Total Books Sold</p>
                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#38bdf8' }}>{salesData.totalSold}</h3>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>Total Revenue</p>
                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#34d399' }}>KES {salesData.totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && <SellerPanel onBookAdded={() => alert('Book added!')} />}

        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📦 Orders Received</h2>
            <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              {salesData.salesList.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No sales logged yet.</p>
              ) : (
                salesData.salesList.map((order) => (
                  <div key={order.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{order.title}</p>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Buyer: {order.phone} • {order.date}</p>
                    </div>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>KES {order.price}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>⚙️ M-Pesa Receiving Settings</h2>
            <form onSubmit={handleSaveSettings} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', maxWidth: '500px' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>M-Pesa Phone Number (Send Money)</label>
              <input 
                type="tel" 
                value={tempReceiveNumber} 
                onChange={(e) => setTempReceiveNumber(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1rem' }}
              />
              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Settings
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
