import { useState, useEffect } from 'react';
import Head from 'next/head';
import SellerPanel from '../components/SellerPanel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });
  const [tempReceiveNumber, setTempReceiveNumber] = useState('0712345678');

  // Music Management State
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songPrice, setSongPrice] = useState('');
  const [songDescription, setSongDescription] = useState('');
  const [uploadingSong, setUploadingSong] = useState(false);

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

  const handleAddSong = (e) => {
    e.preventDefault();
    if (!songTitle || !songPrice) {
      alert('Please provide a song title and price.');
      return;
    }
    setUploadingSong(true);

    setTimeout(() => {
      setUploadingSong(false);
      alert(`Song "${songTitle}" published for sale successfully!`);
      setSongTitle('');
      setSongArtist('');
      setSongPrice('');
      setSongDescription('');
    }, 1000);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Analytics Overview', icon: '📊' },
    { id: 'add', label: 'Add Book', icon: '➕' },
    { id: 'addSong', label: 'Add Song', icon: '🎛️' },
    { id: 'orders', label: 'Orders Received', icon: '📦' },
    { id: 'settings', label: 'M-Pesa Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Head>
        <title>Admin Dashboard - Luminous Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #090d16 !important;
          color: #f8fafc;
          width: 100%;
          overflow-x: hidden;
        }
        .admin-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-nav-btn:hover { background-color: #1e293b; color: #fff; }
        .admin-nav-btn.active { background-color: #2563eb; color: #fff; }
      `}</style>

      {/* Slim Compact Admin Sidebar matching Storefront style */}
      <aside style={{ width: '70px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }} title="Store Admin">⚙️</div>

        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`admin-nav-btn ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', boxSizing: 'border-box', minWidth: 0 }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📊 Analytics Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>Total Items Sold</p>
                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#38bdf8' }}>{salesData.totalSold}</h3>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>Total Revenue</p>
                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#34d399' }}>KES {salesData.totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && <SellerPanel onBookAdded={() => alert('Book added successfully!')} />}

        {activeTab === 'addSong' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🎛️ Add New Song for Sale</h2>
            <form onSubmit={handleAddSong} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxSizing: 'border-box' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Song Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Single Release Vol. 1" 
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Artist Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Max" 
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Price (KES)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 200" 
                  value={songPrice}
                  onChange={(e) => setSongPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Description / Format</label>
                <textarea 
                  placeholder="e.g. High quality audio download (MP3/WAV)" 
                  value={songDescription}
                  onChange={(e) => setSongDescription(e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={uploadingSong}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
              >
                {uploadingSong ? 'Publishing Song...' : 'Publish Song for Sale'}
              </button>
            </form>
          </div>
        )}

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
            <form onSubmit={handleSaveSettings} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', maxWidth: '500px', boxSizing: 'border-box' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>M-Pesa Phone Number (Send Money)</label>
              <input 
                type="tel" 
                value={tempReceiveNumber} 
                onChange={(e) => setTempReceiveNumber(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1rem', boxSizing: 'border-box' }}
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
