import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  // Navigation & Loading States
  const [activeTab, setActiveTab] = useState('books');

  // Book Management States
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Mr. Ngotho');
  const [bookPrice, setBookPrice] = useState('');
  const [bookSummary, setBookSummary] = useState('');
  const [bookFullText, setBookFullText] = useState('');
  const [catalogBooks, setCatalogBooks] = useState([]);

  // Music Management States
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('Mr. Ngotho');
  const [musicPrice, setMusicPrice] = useState('');
  const [musicDesc, setMusicDesc] = useState('');
  const [catalogMusic, setCatalogMusic] = useState([]);

  // M-Pesa Settings State
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sales & Orders States
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });

  useEffect(() => {
    // Load local storage items on mount
    const savedBooks = JSON.parse(localStorage.getItem('luminiousbooks_local_catalog') || '[]');
    setCatalogBooks(savedBooks);

    const savedMusic = JSON.parse(localStorage.getItem('luminiousmusic_local_catalog') || '[]');
    setCatalogMusic(savedMusic);

    const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
    if (savedPhone) setMpesaPhone(savedPhone);

    const savedSales = localStorage.getItem('luminiousbooks_sales');
    if (savedSales) setSalesData(JSON.parse(savedSales));
  }, []);

  // Handle Adding a Book
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!bookTitle || !bookPrice) {
      alert('Please enter at least a book title and price.');
      return;
    }

    const newBook = {
      id: 'b_' + Date.now(),
      title: bookTitle,
      author: bookAuthor,
      price: bookPrice,
      summary: bookSummary || 'An inspiring Catholic literary work by Mr. Ngotho.',
      fullText: bookFullText || '[CHAPTER 1]\n\nFull chapter content goes here...'
    };

    const updatedBooks = [newBook, ...catalogBooks];
    setCatalogBooks(updatedBooks);
    localStorage.setItem('luminiousbooks_local_catalog', JSON.stringify(updatedBooks));

    // Reset form
    setBookTitle('');
    setBookPrice('');
    setBookSummary('');
    setBookFullText('');
    alert('Book successfully published to storefront!');
  };

  // Handle Deleting a Book
  const handleDeleteBook = (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = catalogBooks.filter(b => b.id !== id);
      setCatalogBooks(updatedBooks);
      localStorage.setItem('luminiousbooks_local_catalog', JSON.stringify(updatedBooks));
    }
  };

  // Handle Adding Music
  const handleAddMusic = (e) => {
    e.preventDefault();
    if (!musicTitle || !musicPrice) {
      alert('Please enter at least a song title and price.');
      return;
    }

    const newTrack = {
      id: 'm_' + Date.now(),
      title: musicTitle,
      artist: musicArtist,
      price: musicPrice,
      description: musicDesc || 'Inspiring Catholic choral audio collection.'
    };

    const updatedMusic = [newTrack, ...catalogMusic];
    setCatalogMusic(updatedMusic);
    localStorage.setItem('luminiousmusic_local_catalog', JSON.stringify(updatedMusic));

    // Reset form
    setMusicTitle('');
    setMusicPrice('');
    setMusicDesc('');
    alert('Music track successfully published to storefront!');
  };

  // Handle Deleting Music
  const handleDeleteMusic = (id) => {
    if (confirm('Are you sure you want to delete this track?')) {
      const updatedMusic = catalogMusic.filter(m => m.id !== id);
      setCatalogMusic(updatedMusic);
      localStorage.setItem('luminiousmusic_local_catalog', JSON.stringify(updatedMusic));
    }
  };

  // Save M-Pesa Settings
  const handleSaveMpesa = (e) => {
    e.preventDefault();
    localStorage.setItem('luminiousbooks_mpesa_phone', mpesaPhone);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <Head>
        <title>Admin Dashboard - Luminous Bookstore</title>
      </Head>

      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#38bdf8', marginBottom: '1.5rem', paddingLeft: '0.75rem' }}>
          🛠️ Admin Panel
        </div>
        <button onClick={() => setActiveTab('books')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'books' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: '600' }}>📚 Manage Books</button>
        <button onClick={() => setActiveTab('music')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'music' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: '600' }}>💿 Manage Music</button>
        <button onClick={() => setActiveTab('mpesa')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'mpesa' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: '600' }}>💳 M-Pesa Settings</button>
        <button onClick={() => setActiveTab('sales')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'sales' ? '#2563eb' : 'transparent', color: '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: '600' }}>📊 Sales & Orders</button>
        
        <div style={{ marginTop: 'auto' }}>
          <a href="/" style={{ display: 'block', padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: '#1e293b', color: '#38bdf8', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' }}>
            🏠 Back to Storefront
          </a>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        
        {/* BOOKS TAB */}
        {activeTab === 'books' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Publish & Manage Books</h1>
            
            {/* Add Book Form */}
            <form onSubmit={handleAddBook} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', marginBottom: '2.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', color: '#38bdf8' }}>Add New Book Listing</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Book Title</label>
                  <input type="text" placeholder="e.g. Walking in Grace" value={bookTitle} onChange={e => setBookTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Price (KES)</label>
                  <input type="number" placeholder="600" value={bookPrice} onChange={e => setBookPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Free Summary Preview (Shown before purchase)</label>
                <textarea rows="3" placeholder="Short inspiring preview..." value={bookSummary} onChange={e => setBookSummary(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Full Chapters Text (Unlocked after payment)</label>
                <textarea rows="5" placeholder="[CHAPTER 1] Full book text here..." value={bookFullText} onChange={e => setBookFullText(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Book 🚀</button>
            </form>

            {/* Existing Books List */}
            <h3 style={{ marginBottom: '1rem' }}>Existing Local Books ({catalogBooks.length})</h3>
            {catalogBooks.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No custom books added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {catalogBooks.map(book => (
                  <div key={book.id} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{book.title}</h4>
                      <p style={{ margin: 0, color: '#34d399', fontWeight: 'bold' }}>KES {book.price}</p>
                    </div>
                    <button onClick={() => handleDeleteBook(book.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MUSIC TAB */}
        {activeTab === 'music' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Publish & Manage Sacred Music</h1>
            
            <form onSubmit={handleAddMusic} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', marginBottom: '2.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', color: '#38bdf8' }}>Add New Music Track/Album</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Track Title</label>
                  <input type="text" placeholder="e.g. Sacred Hymns Vol. 2" value={musicTitle} onChange={e => setMusicTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Price (KES)</label>
                  <input type="number" placeholder="300" value={musicPrice} onChange={e => setMusicPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Description</label>
                <textarea rows="3" placeholder="Uplifting choral audio collection..." value={musicDesc} onChange={e => setMusicDesc(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Music 🎵</button>
            </form>

            <h3 style={{ marginBottom: '1rem' }}>Existing Local Music Tracks ({catalogMusic.length})</h3>
            {catalogMusic.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No custom music tracks added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {catalogMusic.map(track => (
                  <div key={track.id} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{track.title}</h4>
                      <p style={{ margin: 0, color: '#34d399', fontWeight: 'bold' }}>KES {track.price}</p>
                    </div>
                    <button onClick={() => handleDeleteMusic(track.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* M-PESA SETTINGS TAB */}
        {activeTab === 'mpesa' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>M-Pesa Payment Settings</h1>
            
            <form onSubmit={handleSaveMpesa} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#94a3b8' }}>Mr. Ngotho's Personal M-Pesa Receive Number</label>
              <input type="tel" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1.1rem', marginBottom: '1.25rem', boxSizing: 'border-box' }} />
              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Save Phone Number</button>
              {saveSuccess && <p style={{ color: '#34d399', marginTop: '1rem', fontWeight: 'bold' }}>✅ M-Pesa number updated successfully!</p>}
            </form>
          </div>
        )}

        {/* SALES & ORDERS TAB */}
        {activeTab === 'sales' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Sales & Order History</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Items Sold</p>
                <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '2.2rem' }}>{salesData.totalSold}</h2>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Revenue</p>
                <h2 style={{ margin: 0, color: '#34d399', fontSize: '2.2rem' }}>KES {salesData.totalRevenue}</h2>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Recent Customer Orders</h3>
            {salesData.salesList.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No orders recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {salesData.salesList.map((sale, idx) => (
                  <div key={idx} style={{ backgroundColor: '#1e293b', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{sale.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Paid by: {sale.phone} on {sale.date}</p>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#34d399' }}>KES {sale.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
