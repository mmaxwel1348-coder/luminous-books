import { useState, useEffect } from 'react';
import Head from 'next/head';

const OWNER_PIN = '8086';
const ISSUED_CODES_STORAGE_KEY = 'luminiousbooks_issued_code_entries';

const DEFAULT_ADMIN_BOOKS = [
  { id: 'b1', title: 'A HERITAGE OF GOLD', prefix: 'HG', price: '600' },
  { id: 'b2', title: 'JOURNEYING WITH THE LIVING GOD', prefix: 'JG', price: '600' }
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('addBook');

  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Dr. Peter Ngotho Njoroge');
  const [bookPrice, setBookPrice] = useState('600');
  const [bookSummary, setBookSummary] = useState('');
  const [bookFullText, setBookFullText] = useState('');

  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('Dr. Peter Ngotho Njoroge');
  const [songPrice, setSongPrice] = useState('200');
  const [songDesc, setSongDesc] = useState('');

  const [mpesaNumber, setMpesaNumber] = useState('0712345678');

  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });
  const [localBooks, setLocalBooks] = useState([]);
  const [localSongs, setLocalSongs] = useState([]);

  // Owner Code Generator State (PIN: 8086)
  const [ownerAuthUnlocked, setOwnerAuthUnlocked] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [ownerPinError, setOwnerPinError] = useState('');
  const [genBookId, setGenBookId] = useState('b1');
  const [genBuyerNote, setGenBuyerNote] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [issuedCodeEntries, setIssuedCodeEntries] = useState([]);

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

      const savedCodes = localStorage.getItem(ISSUED_CODES_STORAGE_KEY);
      if (savedCodes) {
        const parsedCodes = JSON.parse(savedCodes);
        if (Array.isArray(parsedCodes)) setIssuedCodeEntries(parsedCodes);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const selectableBooks = [
    ...DEFAULT_ADMIN_BOOKS,
    ...localBooks.map((b) => ({
      id: b.id,
      title: b.title,
      prefix: (b.title || 'BK').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'BK',
      price: b.price || '600'
    }))
  ];

  const persistIssuedCodes = (entries) => {
    setIssuedCodeEntries(entries);
    try {
      localStorage.setItem(ISSUED_CODES_STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOwnerPinSubmit = (e) => {
    e.preventDefault();
    if (ownerPinInput.trim() === OWNER_PIN) {
      setOwnerAuthUnlocked(true);
      setOwnerPinError('');
      setOwnerPinInput('');
    } else {
      setOwnerPinError('Incorrect PIN.');
    }
  };

  const handleGenerateCustomCode = (e) => {
    e.preventDefault();
    const chosenBook = selectableBooks.find((b) => b.id === genBookId) || selectableBooks[0];
    const existingCodes = new Set(issuedCodeEntries.map((entry) => entry.code));

    let code = '';
    do {
      const num = Math.floor(1000 + Math.random() * 9000);
      code = `${chosenBook.prefix}-${num}`;
    } while (existingCodes.has(code));

    const newEntry = {
      id: Date.now() + Math.random(),
      bookId: chosenBook.id,
      code,
      note: genBuyerNote.trim() || 'Paying Customer',
      createdAt: new Date().toLocaleString()
    };

    const updated = [newEntry, ...issuedCodeEntries];
    persistIssuedCodes(updated);
    setLastGeneratedCode(code);
    setGenBuyerNote('');
  };

  const handleDeleteIssuedCode = (id) => {
    const updated = issuedCodeEntries.filter((entry) => entry.id !== id);
    persistIssuedCodes(updated);
  };

  const copyCodeToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const getBookTitle = (bookId) => {
    const found = selectableBooks.find((b) => b.id === bookId);
    return found ? found.title : bookId;
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Head>
        <title>Admin Dashboard - Luminous Bookstore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #090d16 !important;
          color: #f8fafc;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .admin-layout {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .admin-sidebar {
          width: 250px;
          backgroundColor: #0f172a;
          border-right: 1px solid #1e293b;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .admin-mobile-header {
          display: none;
        }

        .admin-main {
          flex: 1;
          padding: 2.5rem;
          overflow-y: auto;
          max-width: 900px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            display: none !important;
          }
          .admin-mobile-header {
            display: flex !important;
            flex-direction: column;
            background-color: #0f172a;
            border-bottom: 1px solid #1e293b;
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 100;
            width: 100%;
            box-sizing: border-box;
          }
          .admin-mobile-nav {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            padding-top: 0.5rem;
            width: 100%;
          }
          .admin-main {
            padding: 1.25rem 1rem !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="admin-layout">
        {/* Mobile Header Nav */}
        <header className="admin-mobile-header">
          <h2 style={{ fontSize: '1.1rem', color: '#38bdf8', margin: '0 0 0.5rem 0' }}>⚙️ Admin Dashboard</h2>
          <div className="admin-mobile-nav">
            <button onClick={() => setActiveTab('analytics')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'analytics' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>📊 Sales</button>
            <button onClick={() => setActiveTab('addBook')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'addBook' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>➕ Add Book</button>
            <button onClick={() => setActiveTab('addSong')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'addSong' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>🎛️ Add Song</button>
            <button onClick={() => setActiveTab('orders')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'orders' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>📦 Orders</button>
            <button onClick={() => setActiveTab('mpesa')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'mpesa' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>📱 M-Pesa</button>
            <button onClick={() => setActiveTab('codes')} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'codes' ? '#d97706' : '#1e293b', color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>🔑 Codes</button>
          </div>
        </header>

        {/* Desktop Sidebar */}
        <aside className="admin-sidebar">
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
          <button onClick={() => setActiveTab('codes')} style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'codes' ? '#d97706' : 'transparent', color: '#fff', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔑 Code Generator
          </button>

          <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '12px', fontSize: '0.85rem' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontWeight: 'bold' }}>Store Status</p>
            <p style={{ margin: 0, color: '#34d399' }}>● Live on LocalStorage</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {activeTab === 'addBook' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Add a New Book</h1>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Instantly publish a book with public summary and protected full reader access.</p>

              <form onSubmit={handleSaveBook} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Book Title</label>
                  <input
                    type="text"
                    placeholder="e.g. A Heritage of Gold"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Author</label>
                  <input
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (KES)</label>
                  <input
                    type="number"
                    value={bookPrice}
                    onChange={(e) => setBookPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Public Summary & Description</label>
                  <textarea
                    rows={4}
                    placeholder="Paste your juicy summary here..."
                    value={bookSummary}
                    onChange={(e) => setBookSummary(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#38bdf8' }}>🔓 Full Book Text / Chapters (Unlocked After Payment)</label>
                  <textarea
                    rows={8}
                    placeholder="Paste the complete book chapters or text here..."
                    value={bookFullText}
                    onChange={(e) => setBookFullText(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #38bdf8', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <button type="submit" style={{ padding: '1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '0.5rem', width: '100%' }}>
                  Save Book to Store 🚀
                </button>
              </form>

              {localBooks.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Your Published Books ({localBooks.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {localBooks.map(b => (
                      <div key={b.id} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', paddingRight: '0.5rem' }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{b.title}</h4>
                          <p style={{ margin: 0, color: '#34d399', fontSize: '0.9rem' }}>KES {b.price}</p>
                        </div>
                        <button onClick={() => deleteBook(b.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📊 Sales & Analytics</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem', width: '100%' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155', boxSizing: 'border-box' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Books Sold</p>
                  <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#38bdf8' }}>{salesData.totalSold}</h2>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155', boxSizing: 'border-box' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Total Revenue</p>
                  <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#34d399' }}>KES {salesData.totalRevenue}</h2>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addSong' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Add Music Track</h1>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Publish new hymns or audio albums to your music catalog.</p>

              <form onSubmit={handleSaveSong} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Song / Album Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sacred Hymns Vol. 2"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Composer / Artist</label>
                  <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (KES)</label>
                  <input
                    type="number"
                    value={songPrice}
                    onChange={(e) => setSongPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the audio track..."
                    value={songDesc}
                    onChange={(e) => setSongDesc(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button type="submit" style={{ padding: '1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '0.5rem', width: '100%' }}>
                  Save Song to Catalog 🎵
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📦 Orders Received</h1>
              {salesData.salesList.length === 0 ? (
                <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                  <p style={{ color: '#94a3b8', margin: 0 }}>No orders received yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  {salesData.salesList.map((sale, idx) => (
                    <div key={idx} style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                      <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', paddingRight: '0.5rem' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{sale.title}</h4>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Phone: <strong style={{ color: '#38bdf8' }}>{sale.phone}</strong> | Date: {sale.date}</p>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '1.05rem', flexShrink: 0 }}>KES {sale.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mpesa' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📱 M-Pesa Settings</h1>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Configure the mobile number where customer payments are sent.</p>

              <form onSubmit={handleSaveMpesa} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>M-Pesa Receive Number</label>
                  <input
                    type="tel"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button type="submit" style={{ padding: '1rem', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '0.5rem', width: '100%' }}>
                  Save M-Pesa Settings 💾
                </button>
              </form>
            </div>
          )}

          {activeTab === 'codes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#fde68a' }}>🔑 Owner Code Generator</h1>
                {ownerAuthUnlocked && (
                  <button
                    type="button"
                    onClick={() => setOwnerAuthUnlocked(false)}
                    style={{ backgroundColor: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Lock Generator
                  </button>
                )}
              </div>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Generate custom unlock codes after confirming customer payment.
              </p>

              {!ownerAuthUnlocked ? (
                <form onSubmit={handleOwnerPinSubmit} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px', width: '100%', boxSizing: 'border-box' }}>
                  <label style={{ fontWeight: '600' }}>Enter Owner PIN</label>
                  <input
                    type="password"
                    placeholder="Enter PIN (8086)"
                    value={ownerPinInput}
                    onChange={(e) => setOwnerPinInput(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                  {ownerPinError && (
                    <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.85rem' }}>{ownerPinError}</p>
                  )}
                  <button type="submit" style={{ padding: '0.9rem', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
                    Unlock Code Generator
                  </button>
                </form>
              ) : (
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
                  <form onSubmit={handleGenerateCustomCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Book</label>
                      <select
                        value={genBookId}
                        onChange={(e) => setGenBookId(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                      >
                        {selectableBooks.map((book) => (
                          <option key={book.id} value={book.id}>
                            {book.title} (KES {book.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Customer Note / M-Pesa Reference (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Paid KES 600 via M-Pesa - 0712..."
                        value={genBuyerNote}
                        onChange={(e) => setGenBuyerNote(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <button type="submit" style={{ padding: '1rem', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>
                      Generate Custom Code
                    </button>
                  </form>

                  {lastGeneratedCode && (
                    <div style={{ backgroundColor: '#0f172a', border: '1px solid #34d399', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Generated Code Ready to Send</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#34d399', letterSpacing: '0.06em' }}>{lastGeneratedCode}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCodeToClipboard(lastGeneratedCode)}
                        style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        {copiedCode === lastGeneratedCode ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  )}

                  {issuedCodeEntries.length > 0 && (
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
                      <h3 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', color: '#e2e8f0' }}>
                        Generated Codes ({issuedCodeEntries.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {issuedCodeEntries.map((entry) => (
                          <div key={entry.id} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div>
                              <strong style={{ color: '#fde68a', fontSize: '1rem' }}>{entry.code}</strong>
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginLeft: '0.5rem' }}>{getBookTitle(entry.bookId)}</span>
                              <div style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '0.2rem' }}>{entry.note} · {entry.createdAt}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.45rem' }}>
                              <button
                                type="button"
                                onClick={() => copyCodeToClipboard(entry.code)}
                                style={{ backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.8rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                              >
                                {copiedCode === entry.code ? 'Copied' : 'Copy'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteIssuedCode(entry.id)}
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '8px', padding: '0.45rem 0.7rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
