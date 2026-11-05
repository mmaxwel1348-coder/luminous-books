import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addBook');
  
  // Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [savingBook, setSavingBook] = useState(false);

  // Song Form State
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songPrice, setSongPrice] = useState('');
  const [songDesc, setSongDesc] = useState('');
  const [savingSong, setSavingSong] = useState(false);

  // Settings State
  const [phone, setPhone] = useState('0712345678');
  const [savedSettings, setSavedSettings] = useState(false);

  // Analytics & Orders State
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });

  useEffect(() => {
    const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
    if (savedPhone) setPhone(savedPhone);

    const savedSales = localStorage.getItem('luminiousbooks_sales');
    if (savedSales) setSalesData(JSON.parse(savedSales));
  }, []);

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!bookTitle || !bookPrice) {
      alert('Please fill in at least the book title and price.');
      return;
    }
    setSavingBook(true);

    setTimeout(() => {
      const newBook = {
        id: 'book_' + Date.now(),
        title: bookTitle,
        author: bookAuthor || 'Mr. Ngotho',
        price: bookPrice,
        description: bookDesc,
        summary: bookDesc,
        fullText: `[CHAPTER 1: ${bookTitle.toUpperCase()}]\n\nWelcome to the complete text of "${bookTitle}" by ${bookAuthor || 'Mr. Ngotho'}.\n\nThis extraordinary work explores deep spiritual insights, guiding the faithful through prayer, wisdom, and divine grace...\n\n[CHAPTER 2: WALKING IN FAITH]\n\nMay these pages bring you profound peace, strength, and lasting inspiration.`
      };

      const existingBooks = JSON.parse(localStorage.getItem('luminiousbooks_local_catalog') || '[]');
      localStorage.setItem('luminiousbooks_local_catalog', JSON.stringify([newBook, ...existingBooks]));

      setSavingBook(false);
      alert('✅ Book saved successfully and instantly!');
      setBookTitle('');
      setBookAuthor('');
      setBookPrice('');
      setBookDesc('');
    }, 400); // Super fast 0.4 second response
  };

  const handleSaveSong = (e) => {
    e.preventDefault();
    if (!songTitle || !songPrice) {
      alert('Please fill in song title and price.');
      return;
    }
    setSavingSong(true);

    setTimeout(() => {
      const newSong = {
        id: 'song_' + Date.now(),
        title: songTitle,
        artist: songArtist || 'Mr. Ngotho',
        price: songPrice,
        description: songDesc
      };

      const existingSongs = JSON.parse(localStorage.getItem('luminiousmusic_local_catalog') || '[]');
      localStorage.setItem('luminiousmusic_local_catalog', JSON.stringify([newSong, ...existingSongs]));

      setSavingSong(false);
      alert('✅ Song saved successfully and instantly!');
      setSongTitle('');
      setSongArtist('');
      setSongPrice('');
      setSongDesc('');
    }, 400);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('luminiousbooks_mpesa_phone', phone);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      <Head>
        <title>Store Admin Dashboard</title>
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
      `}</style>

      {/* Admin Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0, boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#38bdf8', margin: '0 0 1rem 0' }}>⚙️ STORE ADMIN</h2>
        
        <button onClick={() => setActiveTab('analytics')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'analytics' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📊 Analytics</button>
        <button onClick={() => setActiveTab('addBook')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'addBook' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>➕ Add Book</button>
        <button onClick={() => setActiveTab('addSong')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'addSong' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>💿 Add Song</button>
        <button onClick={() => setActiveTab('orders')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'orders' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📦 Orders Received</button>
        <button onClick={() => setActiveTab('settings')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'settings' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📲 M-Pesa Settings</button>
      </aside>

      {/* Admin Main Area */}
      <main style={{ flex: 1, padding: '3rem 2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* ADD BOOK TAB */}
        {activeTab === 'addBook' && (
          <div style={{ maxWidth: '650px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: '#fff' }}>Add a New Book</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Instantly publish a book with full summary and reader access.</p>
            
            <form onSubmit={handleSaveBook}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Book Title</label>
              <input type="text" placeholder="e.g. A Heritage of Gold" value={bookTitle} onChange={e => setBookTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Author</label>
              <input type="text" placeholder="Dr. Peter Ngotho Njoroge" value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Price (KES)</label>
              <input type="number" placeholder="600" value={bookPrice} onChange={e => setBookPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Summary & Description</label>
              <textarea rows={5} placeholder="Paste your juicy summary here..." value={bookDesc} onChange={e => setBookDesc(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.5rem', boxSizing: 'border-box' }} />

              <button type="submit" disabled={savingBook} style={{ width: '100%', padding: '0.85rem', backgroundColor: savingBook ? '#475569' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: savingBook ? 'not-allowed' : 'pointer' }}>
                {savingBook ? 'Saving Instantly...' : 'Save Book to Store 🚀'}
              </button>
            </form>
          </div>
        )}

        {/* ADD SONG TAB */}
        {activeTab === 'addSong' && (
          <div style={{ maxWidth: '650px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: '#fff' }}>Add a New Song / Track</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Publish sacred music tracks to your store catalog.</p>
            
            <form onSubmit={handleSaveSong}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Song Title</label>
              <input type="text" placeholder="e.g. Sacred Hymns Vol. 2" value={songTitle} onChange={e => setSongTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Composer / Artist</label>
              <input type="text" placeholder="Mr. Ngotho" value={songArtist} onChange={e => setSongArtist(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Price (KES)</label>
              <input type="number" placeholder="200" value={songPrice} onChange={e => setSongPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Description</label>
              <textarea rows={3} placeholder="Track details..." value={songDesc} onChange={e => setSongDesc(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.5rem', boxSizing: 'border-box' }} />

              <button type="submit" disabled={savingSong} style={{ width: '100%', padding: '0.85rem', backgroundColor: savingSong ? '#475569' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: savingSong ? 'not-allowed' : 'pointer' }}>
                {savingSong ? 'Saving Instantly...' : 'Save Song to Store 🎵'}
              </button>
            </form>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📊 Store Sales Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Books/Songs Sold</p>
                <h3 style={{ fontSize: '2.2rem', margin: 0, color: '#38bdf8' }}>{salesData.totalSold}</h3>
              </div>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Revenue Earned</p>
                <h3 style={{ fontSize: '2.2rem', margin: 0, color: '#34d399' }}>KES {salesData.totalRevenue}</h3>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📦 Orders Received</h2>
            {salesData.salesList.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>No orders recorded yet.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                {salesData.salesList.map((order, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{order.title}</h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Customer Phone: {order.phone} | Date: {order.date}</p>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#34d399' }}>KES {order.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '600px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: '#fff' }}>📲 M-Pesa Receiving Settings</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Enter the personal M-Pesa number where customers will send money.</p>
            
            <form onSubmit={handleSaveSettings}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Admin M-Pesa Phone Number</label>
              <input type="tel" placeholder="0712345678" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.5rem', boxSizing: 'border-box' }} />
              
              <button type="submit" style={{ width: '100%', padding: '0.85rem', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                Save Phone Number 💾
              </button>
              {savedSettings && <p style={{ color: '#34d399', textAlign: 'center', marginTop: '1rem' }}>Saved successfully!</p>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
