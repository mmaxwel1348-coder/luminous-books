import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('addBook');

  // Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Dr. Peter Ngotho Njoroge');
  const [bookPrice, setBookPrice] = useState('600');
  const [bookSummary, setBookSummary] = useState('');
  const [bookFullText, setBookFullText] = useState('');

  // Song Form State
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('Dr. Peter Ngotho Njoroge');
  const [songPrice, setSongPrice] = useState('200');
  const [songDesc, setSongDesc] = useState('');

  // M-Pesa Settings State
  const [mpesaNumber, setMpesaNumber] = useState('0712345678');

  // Stats State
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });
  const [localBooks, setLocalBooks] = useState([]);
  const [localSongs, setLocalSongs] = useState([]);

  useEffect(() => {
    try {
      const savedSales = localStorage.getItem('luminiousbooks_sales');
      if (savedSales) setSalesData(JSON.parse(savedSales));

      const savedBooks = localStorage.getItem('luminiousbooks_local_catalog');
      if (savedBooks) setLocalBooks(JSON.parse(savedBooks));

      const savedSongs = localStorage.getItem('luminiousmusic_local_catalog');
      if (savedSongs) setLocalSongs(JSON.parse(savedSongs));

      const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
      if (savedPhone) setMpesaNumber(savedPhone);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!bookTitle || !bookSummary || !bookFullText) {
      alert('Please fill in the book title, summary, and full book chapters!');
      return;
    }

    const newBook = {
      id: 'b_' + Date.now(),
      title: bookTitle,
      author: bookAuthor,
      price: bookPrice,
      summary: bookSummary,
      fullText: bookFullText
    };

    const updatedBooks = [newBook, ...localBooks];
    setLocalBooks(updatedBooks);
    localStorage.setItem('luminiousbooks_local_catalog', JSON.stringify(updatedBooks));

    alert('🎉 Book successfully published with full reader content!');
    setBookTitle('');
    setBookSummary('');
    setBookFullText('');
  };

  const handleSaveSong = (e) => {
    e.preventDefault();
    if (!songTitle || !songDesc) {
      alert('Please fill in the song title and description!');
      return;
    }

    const newSong = {
      id: 's_' + Date.now(),
      title: songTitle,
      artist: songArtist,
      price: songPrice,
      description: songDesc
    };

    const updatedSongs = [newSong, ...localSongs];
    setLocalSongs(updatedSongs);
    localStorage.setItem('luminiousmusic_local_catalog', JSON.stringify(updatedSongs));

    alert('🎵 Song successfully added to catalog!');
    setSongTitle('');
    setSongDesc('');
  };

  const handleSaveMpesa = (e) => {
    e.preventDefault();
    localStorage.setItem('luminiousbooks_mpesa_phone', mpesaNumber);
    alert('✅ M-Pesa receive number updated successfully!');
  };

  const deleteBook = (id) => {
    const filtered = localBooks.filter(b => b.id !== id);
    setLocalBooks(filtered);
    localStorage.setItem('luminiousbooks_local_catalog', JSON.stringify(filtered));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, boxSizing: 'border-box' }}>
      <Head>
        <title>Admin Dashboard - Luminous Bookstore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background-color: #090d16; color: #f8fafc; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5riem', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>⚙️ Admin Dashboard</h2>
        
        <button onClick={() => setActiveTab('analytics')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'analytics' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📊 Analytics & Sales
        </button>
        <button onClick={() => setActiveTab('addBook')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'addBook' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ➕ Add Book & Reader
        </button>
        <button onClick={() => setActiveTab('addSong')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'addSong' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎛️ Add Song
        </button>
        <button onClick={() => setActiveTab('orders')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'orders' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📦 Orders Received
        </button>
        <button onClick={() => setActiveTab('mpesa')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'mpesa' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📱 M-Pesa Settings
        </button>

        <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '12px', fontSize: '0.85rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontWeight: 'bold' }}>Store Status</p>
          <p style={{ margin: 0, color: '#34d399' }}>● Live on LocalStorage</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '900px' }}>
        
        {/* ADD BOOK TAB */}
        {activeTab === 'addBook' && (
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Add a New Book</h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Instantly publish a book with public summary and protected full reader access.</p>
            
            <form onSubmit={handleSaveBook} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Book Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. A Heritage of Gold" 
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Author</label>
                <input 
                  type="text" 
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (KES)</label>
                <input 
                  type="number" 
                  value={bookPrice}
                  onChange={(e) => setBookPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Public Summary & Description</label>
                <textarea 
                  rows={4}
                  placeholder="Paste your juicy summary here..." 
                  value={bookSummary}
                  onChange={(e) => setBookSummary(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#38bdf8' }}>🔓 Full Book Text / Chapters (Unlocked After Payment)</label>
                <textarea 
                  rows={8}
                  placeholder="Paste the complete book chapters or text here. Customers will only be able to read this after completing M-Pesa payment..." 
                  value={bookFullText}
                  onChange={(e) => setBookFullText(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #38bdf8', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>

              <button type="submit" style={{ padding: '1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '1rem' }}>
                Save Book to Store 🚀
              </button>
            </form>

            {localBooks.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Your Published Books ({localBooks.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {localBooks.map(b => (
                    <div key={b.id} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{b.title}</h4>
                        <p style={{ margin: 0, color: '#34d399', fontSize: '0.9rem' }}>KES {b.price}</p>
                      </div>
                      <button onClick={() => deleteBook(b.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️ Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>📊 Sales & Analytics</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Books Sold</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#38bdf8' }}>{salesData.totalSold}</h2>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Revenue</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#34d399' }}>KES {salesData.totalRevenue}</h2>
              </div>
            </div>
          </div>
        )}

        {/* ADD SONG TAB */}
        {activeTab === 'addSong' && (
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Add Sacred Music Track</h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Publish new hymns or audio albums to your music catalog.</p>
            
            <form onSubmit={handleSaveSong} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Song / Album Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sacred Hymns Vol. 2" 
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Composer / Artist</label>
                <input 
                  type="text" 
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (KES)</label>
                <input 
                  type="number" 
                  value={songPrice}
                  onChange={(e) => setSongPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe the audio track..." 
                  value={songDesc}
                  onChange={(e) => setSongDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <button type="submit" style={{ padding: '1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '1rem' }}>
                Save Song to Catalog 🎵
              </button>
            </form>
          </div>
        )}

        {/* ORDERS RECEIVED TAB */}
        {activeTab === 'orders' && (
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>📦 Orders Received</h1>
            {salesData.salesList.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>No orders received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {salesData.salesList.map((sale, idx) => (
                  <div key={idx} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{sale.title}</h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Customer Phone: <strong style={{ color: '#38bdf8' }}>{sale.phone}</strong> | Date: {sale.date}</p>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '1.05rem' }}>KES {sale.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* M-PESA SETTINGS TAB */}
        {activeTab === 'mpesa' && (
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱 M-Pesa Settings</h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Configure the mobile number where customer payments are sent.</p>
            
            <form onSubmit={handleSaveMpesa} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>M-Pesa Receive Number</label>
                <input 
                  type="tel" 
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <button type="submit" style={{ padding: '1rem', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '1rem' }}>
                Save M-Pesa Settings 💾
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
