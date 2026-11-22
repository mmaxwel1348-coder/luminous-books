import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';

// Paste your own book text here (separate paragraphs with a blank line)
const YOUR_BOOK_TEXT = `CHAPTER ONE: INTRODUCTION
Replace this with your own chapter or section text. Separate paragraphs with an empty line so pagination splits cleanly across pages.

Add another paragraph here to test how pages break across mobile and desktop screens.`;

const MAJOR_HEADING_REGEX =
  /^(CHAPTER\s+[A-Z0-9]+|FOREWORD|INTRODUCTION|DEDICATION|ACKNOWLEDGMENTS|CONCLUSION|EPILOGUE|APPENDIX|BIBLIOGRAPHY)/i;

function paginateBookText(rawText, charsPerPage = 760) {
  if (!rawText || !rawText.trim()) return [];
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pages = [];
  let currentBlocks = [];
  let currentLen = 0;

  for (const para of paragraphs) {
    const isHeading = MAJOR_HEADING_REGEX.test(para.split('\n')[0]);

    if (isHeading && currentBlocks.length > 0 && currentLen > 120) {
      pages.push(currentBlocks);
      currentBlocks = [para];
      currentLen = para.length;
      continue;
    }

    if (currentLen + para.length > charsPerPage && currentBlocks.length > 0) {
      pages.push(currentBlocks);
      currentBlocks = [para];
      currentLen = para.length;
    } else {
      currentBlocks.push(para);
      currentLen += para.length + 2;
    }
  }

  if (currentBlocks.length > 0) {
    pages.push(currentBlocks);
  }

  return pages;
}

export default function Storefront() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [books, setBooks] = useState([]);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

  // Unlocked items, bookmarks & reader preferences
  const [unlockedBookIds, setUnlockedBookIds] = useState([]);
  const [unlockedSongIds, setUnlockedSongIds] = useState([]);
  const [bookBookmarks, setBookBookmarks] = useState({});
  const [bookmarkToast, setBookmarkToast] = useState('');
  const [fontScale, setFontScale] = useState(1.03);
  const [nightMode, setNightMode] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Reader State
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageFlipAnim, setPageFlipAnim] = useState(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const pageSurfaceRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  // Music Player State
  const [selectedSong, setSelectedSong] = useState(null);

  const defaultBooks = useMemo(
    () => [
      {
        id: 'b1',
        title: 'Your Book Title',
        author: 'Author Name',
        price: '600',
        summary: 'Add a short summary of your book here for visitors browsing the catalog.',
        fullText: YOUR_BOOK_TEXT
      }
    ],
    []
  );

  const defaultSongs = [
    {
      id: 'm1',
      title: 'Featured Audio Track',
      artist: 'Composer Name',
      price: '200',
      description: 'Add your audio description here.',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }
  ];

  useEffect(() => {
    const checkViewport = () => setIsMobileScreen(window.innerWidth <= 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    try {
      const localBooks = JSON.parse(localStorage.getItem('luminiousbooks_local_catalog') || '[]');
      setBooks(localBooks.length > 0 ? [...localBooks, ...defaultBooks] : defaultBooks);

      const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
      if (savedPhone) setMpesaReceiveNumber(savedPhone);

      setUnlockedBookIds(JSON.parse(localStorage.getItem('luminiousbooks_unlocked_books') || '[]'));
      setUnlockedSongIds(JSON.parse(localStorage.getItem('luminiousbooks_unlocked_songs') || '[]'));
      setBookBookmarks(JSON.parse(localStorage.getItem('luminiousbooks_bookmarks') || '{}'));
    } catch (e) {
      setBooks(defaultBooks);
    }
  }, [defaultBooks]);

  const bookPages = useMemo(() => {
    if (!selectedBook) return [];
    const budget = isMobileScreen ? 460 : 820;
    return paginateBookText(selectedBook.fullText || selectedBook.summary || '', budget);
  }, [selectedBook, isMobileScreen]);

  const chapterJumpOptions = useMemo(() => {
    const options = [{ label: 'Start', pageIndex: 0 }];
    bookPages.forEach((blocks, pageIdx) => {
      for (const block of blocks) {
        const firstLine = (block.split('\n')[0] || '').trim();
        if (MAJOR_HEADING_REGEX.test(firstLine)) {
          options.push({
            label: firstLine.length > 42 ? `${firstLine.slice(0, 39)}...` : firstLine,
            pageIndex: pageIdx
          });
          break;
        }
      }
    });
    return options;
  }, [bookPages]);

  const activeChapterPageIndex = useMemo(() => {
    let matched = 0;
    for (const opt of chapterJumpOptions) {
      if (opt.pageIndex <= currentPageIndex) matched = opt.pageIndex;
    }
    return matched;
  }, [chapterJumpOptions, currentPageIndex]);

  const isBookUnlocked = (bookId) => unlockedBookIds.includes(bookId);
  const isSongUnlocked = (songId) => unlockedSongIds.includes(songId);

  const openBookReader = (book) => {
    setSelectedBook(book);
    setBookmarkToast('');
    setControlsHidden(false);
    setJumpPageInput('');
    lastScrollTopRef.current = 0;

    const savedIdx = bookBookmarks[book.id];
    if (isBookUnlocked(book.id) && typeof savedIdx === 'number' && savedIdx >= 0) {
      setCurrentPageIndex(savedIdx);
    } else {
      setCurrentPageIndex(0);
    }

    if (pageSurfaceRef.current) pageSurfaceRef.current.scrollTop = 0;
  };

  const flipToPage = (nextIdx) => {
    if (nextIdx < 0 || nextIdx >= bookPages.length) return;
    setPageFlipAnim(true);
    setTimeout(() => {
      setCurrentPageIndex(nextIdx);
      setControlsHidden(false);
      lastScrollTopRef.current = 0;
      if (pageSurfaceRef.current) pageSurfaceRef.current.scrollTop = 0;
      setPageFlipAnim(false);
    }, 130);
  };

  const handleDirectPageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= bookPages.length) {
      flipToPage(pageNum - 1);
      setJumpPageInput('');
    }
  };

  const saveBookmarkForCurrentPage = () => {
    if (!selectedBook || bookPages.length === 0) return;
    const clampedIdx = Math.min(Math.max(currentPageIndex, 0), bookPages.length - 1);
    const updatedBookmarks = { ...bookBookmarks, [selectedBook.id]: clampedIdx };
    setBookBookmarks(updatedBookmarks);
    try {
      localStorage.setItem('luminiousbooks_bookmarks', JSON.stringify(updatedBookmarks));
    } catch (err) {
      console.error(err);
    }
    setBookmarkToast(`Saved p.${clampedIdx + 1}`);
    setTimeout(() => setBookmarkToast(''), 1800);
  };

  const clearBookmarkForBook = () => {
    if (!selectedBook) return;
    const updatedBookmarks = { ...bookBookmarks };
    delete updatedBookmarks[selectedBook.id];
    setBookBookmarks(updatedBookmarks);
    try {
      localStorage.setItem('luminiousbooks_bookmarks', JSON.stringify(updatedBookmarks));
    } catch (err) {
      console.error(err);
    }
    setBookmarkToast('Bookmark removed');
    setTimeout(() => setBookmarkToast(''), 1800);
  };

  const savedBookmarkPageIndex = useMemo(() => {
    if (!selectedBook || bookPages.length === 0) return null;
    const rawIdx = bookBookmarks[selectedBook.id];
    if (typeof rawIdx !== 'number' || Number.isNaN(rawIdx)) return null;
    return Math.min(Math.max(rawIdx, 0), bookPages.length - 1);
  }, [selectedBook, bookBookmarks, bookPages.length]);

  const handlePageScroll = (e) => {
    const currentTop = e.currentTarget.scrollTop;
    if (currentTop > lastScrollTopRef.current + 12 && currentTop > 40) {
      setControlsHidden(true);
    } else if (currentTop < lastScrollTopRef.current - 12 || currentTop <= 10) {
      setControlsHidden(false);
    }
    lastScrollTopRef.current = currentTop;
  };

  useEffect(() => {
    if (!selectedBook) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') flipToPage(currentPageIndex + 1);
      if (e.key === 'ArrowLeft') flipToPage(currentPageIndex - 1);
      if (e.key === 'Escape') setSelectedBook(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBook, currentPageIndex, bookPages.length]);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      !e.changedTouches ||
      e.changedTouches.length === 0
    ) {
      return;
    }
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    if (absX > 65 && absX > absY * 1.35) {
      if (diffX > 0) flipToPage(currentPageIndex + 1);
      else flipToPage(currentPageIndex - 1);
    }
  };

  const addToCart = (item) => setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  const removeFromCart = (cartId) => setCart(cart.filter((item) => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleMpesaCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid M-Pesa phone number (e.g. 0712345678)');
      return;
    }
    setPaying(true);

    setTimeout(() => {
      setPaying(false);
      setPaymentSuccess(true);

      const purchasedBookIds = cart
        .filter((item) => item.fullText !== undefined || String(item.id).startsWith('b'))
        .map((item) => item.id);
      const purchasedSongIds = cart
        .filter((item) => item.description !== undefined && !item.fullText && !String(item.id).startsWith('b'))
        .map((item) => item.id);

      const updatedBookIds = Array.from(new Set([...unlockedBookIds, ...purchasedBookIds]));
      const updatedSongIds = Array.from(new Set([...unlockedSongIds, ...purchasedSongIds]));

      setUnlockedBookIds(updatedBookIds);
      setUnlockedSongIds(updatedSongIds);

      try {
        localStorage.setItem('luminiousbooks_unlocked_books', JSON.stringify(updatedBookIds));
        localStorage.setItem('luminiousbooks_unlocked_songs', JSON.stringify(updatedSongIds));
      } catch (err) {
        console.error(err);
      }

      setCart([]);
    }, 1500);
  };

  const closeModal = () => {
    setCheckoutOpen(false);
    setPaymentSuccess(false);
    setPhoneNumber('');
  };

  let localSongs = [];
  try {
    localSongs = JSON.parse(localStorage.getItem('luminiousmusic_local_catalog') || '[]');
  } catch (e) {
    localSongs = [];
  }
  const allSongs = localSongs.length > 0 ? [...localSongs, ...defaultSongs] : defaultSongs;

  const renderBookPageBlocks = (blocks) => {
    const headingColor = nightMode ? '#fbbf24' : '#1e1b18';
    const subheadingColor = nightMode ? '#fcd34d' : '#78350f';
    const bodyColor = nightMode ? '#e2e8f0' : '#292524';

    return blocks.map((block, idx) => {
      const lines = block.split('\n').filter(Boolean);
      const firstLine = lines[0] || '';
      const isMajorHeading = MAJOR_HEADING_REGEX.test(firstLine.trim());

      if (isMajorHeading) {
        const restLines = lines.slice(1).join('\n');
        return (
          <div key={idx} style={{ marginBottom: '0.95rem' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, rgba(180, 130, 35, 0.18), rgba(180, 130, 35, 0.03))',
                borderLeft: '4px solid #b45309',
                padding: '0.6rem 0.95rem',
                borderRadius: '0 10px 10px 0',
                marginBottom: restLines ? '0.7rem' : 0
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: `${fontScale * 1.18}rem`,
                  lineHeight: 1.32,
                  color: headingColor
                }}
              >
                {firstLine}
              </h4>
            </div>
            {restLines && (
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: `${fontScale}rem`,
                  lineHeight: 1.7,
                  color: bodyColor,
                  whiteSpace: 'pre-line'
                }}
              >
                {restLines}
              </p>
            )}
          </div>
        );
      }

      const isSubheading =
        block.length < 75 &&
        !block.endsWith('.') &&
        !block.endsWith('?') &&
        !block.endsWith('!') &&
        !block.startsWith('-');

      if (isSubheading) {
        return (
          <h5
            key={idx}
            style={{
              margin: '0.85rem 0 0.35rem 0',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: `${fontScale * 1.03}rem`,
              fontWeight: 700,
              color: subheadingColor,
              borderBottom: '1px solid rgba(120, 53, 15, 0.18)',
              paddingBottom: '0.2rem'
            }}
          >
            {block}
          </h5>
        );
      }

      return (
        <p
          key={idx}
          style={{
            margin: '0 0 0.78rem 0',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${fontScale}rem`,
            lineHeight: 1.7,
            color: bodyColor,
            whiteSpace: 'pre-line'
          }}
        >
          {block}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <Head>
        <title>Bookstore & Audio Reader</title>
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
        .desktop-sidebar { display: flex; }
        .mobile-header { display: none; }
        .main-content { margin-left: 70px; padding: 2rem 1.5rem; }

        .fullscreen-reader-shell {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 1100;
          background: #fdfaf2;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          min-height: 0;
        }

        .reader-mini-bar {
          position: fixed;
          top: 8px;
          right: 10px;
          z-index: 1120;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: flex-end;
          max-width: calc(100vw - 20px);
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(6px);
          padding: 5px 8px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: opacity 0.2s ease;
        }

        .book-page-surface {
          flex: 1;
          min-height: 0;
          width: 100vw;
          height: 100%;
          margin: 0;
          background:
            radial-gradient(circle at top right, rgba(217, 172, 74, 0.12), transparent 45%),
            linear-gradient(to right, rgba(120, 83, 28, 0.08) 0%, rgba(253, 250, 242, 1) 2%, #fdfaf2 98%, rgba(120, 83, 28, 0.08) 100%);
          color: #292524;
          border-radius: 0;
          padding: 3.1rem 2rem 3.4rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transition: transform 0.13s ease, opacity 0.13s ease;
        }

        .book-page-night {
          background: #0f172a !important;
          color: #e2e8f0 !important;
        }

        .book-page-flipping {
          opacity: 0.22;
          transform: translateX(12px) scale(0.992);
        }

        .reader-arrow-nav {
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1120;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.84);
          backdrop-filter: blur(6px);
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: opacity 0.2s ease;
        }

        .reader-controls-hidden {
          opacity: 0;
          pointer-events: none;
        }

        .reader-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
          .book-page-surface { padding: 3.5rem 1.05rem 3.8rem 1.05rem; }
          .reader-arrow-btn { width: 34px; height: 34px; font-size: 0.92rem; }
        }
      `}</style>

      {/* Mobile Top Header */}
      <header className="mobile-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.75rem 1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#38bdf8' }}>📖 Reader</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setActiveCategory('home')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>🏠</button>
          <button onClick={() => setActiveCategory('books')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>📖</button>
          <button onClick={() => setActiveCategory('music')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>🎛️</button>
          <button onClick={() => setActiveCategory('cart')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer', position: 'relative' }}>
            🛒
            {cart.length > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem', fontWeight: 'bold' }}>{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: '70px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 0', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'fixed', top: 0, left: 0, bottom: 0, height: '100vh', zIndex: 100 }}>
        <button title="Home" onClick={() => setActiveCategory('home')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🏠</button>
        <button title="Books" onClick={() => setActiveCategory('books')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>📖</button>
        <button title="Music" onClick={() => setActiveCategory('music')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🎛️</button>
        <button title="Cart" onClick={() => setActiveCategory('cart')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', position: 'relative' }}>
          🛒
          {cart.length > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>{cart.length}</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, paddingBottom: '6rem' }}>
        {activeCategory === 'home' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundImage:
                  'linear-gradient(125deg, rgba(9, 13, 22, 0.90) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(30, 27, 75, 0.88) 100%), url("/images/author-bg.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 18%',
                backgroundRepeat: 'no-repeat',
                border: '1px solid #334155',
                borderRadius: '22px',
                padding: '2.5rem 2rem',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#38bdf8',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}
              >
                Autobiography
              </span>

              <h1 style={{ margin: '0 0 1.25rem 0', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                Meet the Author
              </h1>

              <p style={{ color: '#f1f5f9', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1rem', maxWidth: '72ch' }}>
                Paste your author autobiography here so it sits clearly over the dark gradient overlay while keeping the portrait subtly framed behind it.
              </p>

              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.75rem', maxWidth: '72ch' }}>
                Add your writing background, mentorship focus, and music composition details here.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveCategory('books')}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Browse Books
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('music')}
                  style={{
                    backgroundColor: '#059669',
                    color: '#fff',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Listen to Audio
                </button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'books' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {books.map((book) => {
              const unlocked = isBookUnlocked(book.id);
              return (
                <div key={book.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.4rem 0' }}>{book.title}</h3>
                    <p style={{ color: '#38bdf8', margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>{book.author}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{book.summary}</p>
                  </div>
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: unlocked ? '#38bdf8' : '#34d399' }}>{unlocked ? '🔓 Unlocked' : `KES ${book.price}`}</strong>
                      <button onClick={() => openBookReader(book)} style={{ backgroundColor: unlocked ? '#059669' : '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                        {unlocked ? '📖 Open' : '📖 Preview'}
                      </button>
                    </div>
                    {!unlocked && (
                      <button onClick={() => addToCart(book)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add to Cart (KES {book.price})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'music' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {allSongs.map((track) => {
              const unlocked = isSongUnlocked(track.id);
              return (
                <div key={track.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.4rem 0' }}>{track.title}</h3>
                  <p style={{ color: '#818cf8', margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>{track.artist}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{track.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <strong style={{ color: unlocked ? '#38bdf8' : '#34d399' }}>{unlocked ? '🔓 Unlocked' : `KES ${track.price}`}</strong>
                    <button onClick={() => setSelectedSong(track)} style={{ backgroundColor: '#059669', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🎧 Play</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ marginTop: 0 }}>🛒 Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #334155' }}>
                    <span>{item.title}</span>
                    <div>
                      <strong style={{ color: '#34d399', marginRight: '0.75rem' }}>KES {item.price}</strong>
                      <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.15rem' }}>
                  <span>Total:</span>
                  <span style={{ color: '#34d399' }}>KES {cartTotal}</span>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* FULL-SCREEN BOOK READER */}
      {selectedBook && (
        <div className="fullscreen-reader-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className={`reader-mini-bar ${controlsHidden ? 'reader-controls-hidden' : ''}`}>
            {isBookUnlocked(selectedBook.id) && (
              <>
                <button type="button" onClick={saveBookmarkForCurrentPage} style={{ backgroundColor: savedBookmarkPageIndex === currentPageIndex ? '#047857' : '#1e293b', color: '#fef3c7', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  {bookmarkToast || `🔖 p.${currentPageIndex + 1}`}
                </button>

                {savedBookmarkPageIndex !== null && (
                  <>
                    <button type="button" onClick={() => flipToPage(savedBookmarkPageIndex)} style={{ backgroundColor: 'rgba(217,119,6,0.25)', color: '#fde68a', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      ↳ p.{savedBookmarkPageIndex + 1}
                    </button>
                    <button type="button" onClick={clearBookmarkForBook} title="Clear bookmark" style={{ backgroundColor: '#1e293b', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.35)', borderRadius: '7px', padding: '0.3rem 0.45rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      ✕bm
                    </button>
                  </>
                )}

                <button type="button" onClick={() => setFontScale((s) => Math.max(0.85, Number((s - 0.1).toFixed(2))))} style={{ backgroundColor: '#1e293b', color: '#fef3c7', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.45rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>A-</button>
                <button type="button" onClick={() => setFontScale((s) => Math.min(1.35, Number((s + 0.1).toFixed(2))))} style={{ backgroundColor: '#1e293b', color: '#fef3c7', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.45rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>A+</button>
                <button type="button" onClick={() => setNightMode((n) => !n)} style={{ backgroundColor: '#1e293b', color: '#fde68a', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                  {nightMode ? '☀️' : '🌙'}
                </button>

                {chapterJumpOptions.length > 0 && (
                  <select aria-label="Jump to chapter" value={activeChapterPageIndex} onChange={(e) => flipToPage(Number(e.target.value))} style={{ backgroundColor: '#0f172a', color: '#fef3c7', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.3rem 0.45rem', fontSize: '0.76rem', maxWidth: '150px', cursor: 'pointer' }}>
                    {chapterJumpOptions.map((opt) => (
                      <option key={`${opt.label}-${opt.pageIndex}`} value={opt.pageIndex}>{opt.label} (p.{opt.pageIndex + 1})</option>
                    ))}
                  </select>
                )}

                <form onSubmit={handleDirectPageJump} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <input type="number" min={1} max={bookPages.length || 1} value={jumpPageInput} onChange={(e) => setJumpPageInput(e.target.value)} placeholder={`1-${bookPages.length || 1}`} aria-label="Page number" style={{ width: '52px', backgroundColor: '#0f172a', color: '#fef3c7', border: '1px solid rgba(217,172,74,0.4)', borderRadius: '7px', padding: '0.28rem 0.35rem', fontSize: '0.75rem' }} />
                  <button type="submit" style={{ backgroundColor: '#b45309', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.3rem 0.45rem', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer' }}>Go</button>
                </form>
              </>
            )}

            <button type="button" onClick={() => setSelectedBook(null)} title="Close" style={{ backgroundColor: '#334155', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '7px', padding: '0.3rem 0.55rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}>✕</button>
          </div>

          {!isBookUnlocked(selectedBook.id) ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '820px', margin: '0 auto', padding: '3.5rem 1.25rem 2rem 1.25rem', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '14px', border: '1px solid #334155' }}>
                <p style={{ color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{selectedBook.summary}</p>
              </div>
              <button onClick={() => { setSelectedBook(null); addToCart(selectedBook); setCheckoutOpen(true); }} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'center' }}>
                Unlock Full Book (KES {selectedBook.price}) 💳
              </button>
            </div>
          ) : (
            <>
              <div
                ref={pageSurfaceRef}
                onScroll={handlePageScroll}
                onClick={() => setControlsHidden((prev) => !prev)}
                className={`book-page-surface ${nightMode ? 'book-page-night' : ''} ${pageFlipAnim ? 'book-page-flipping' : ''}`}
              >
                <div>{renderBookPageBlocks(bookPages[currentPageIndex] || [])}</div>
                <div style={{ paddingTop: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid rgba(146,64,14,0.16)', textAlign: 'center', fontSize: '0.8rem', color: nightMode ? '#cbd5e1' : '#78350f', fontWeight: 600 }}>
                  {currentPageIndex + 1} / {bookPages.length}
                </div>
              </div>

              <div className={`reader-arrow-nav ${controlsHidden ? 'reader-controls-hidden' : ''}`}>
                <button type="button" aria-label="Previous page" onClick={() => flipToPage(currentPageIndex - 1)} disabled={currentPageIndex === 0} className="reader-arrow-btn" style={{ backgroundColor: currentPageIndex === 0 ? '#1e293b' : '#b45309', color: currentPageIndex === 0 ? '#64748b' : '#fff', cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer' }}>←</button>
                <button type="button" aria-label="Next page" onClick={() => flipToPage(currentPageIndex + 1)} disabled={currentPageIndex >= bookPages.length - 1} className="reader-arrow-btn" style={{ backgroundColor: currentPageIndex >= bookPages.length - 1 ? '#1e293b' : '#d97706', color: currentPageIndex >= bookPages.length - 1 ? '#64748b' : '#090d16', cursor: currentPageIndex >= bookPages.length - 1 ? 'not-allowed' : 'pointer' }}>→</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* AUDIO PLAYER MODAL */}
      {selectedSong && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ marginTop: 0 }}>{selectedSong.title}</h3>
            <p style={{ color: '#cbd5e1' }}>{selectedSong.description}</p>
            <audio controls style={{ width: '100%', marginBottom: '1rem' }}>
              <source src={isSongUnlocked(selectedSong.id) ? selectedSong.fullAudio : selectedSong.previewAudio} type="audio/mpeg" />
            </audio>
            <button onClick={() => setSelectedSong(null)} style={{ width: '100%', padding: '0.7rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* FLOATING CHECKOUT BUTTON */}
      {cart.length > 0 && (
        <button onClick={() => setCheckoutOpen(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#059669', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', zIndex: 900 }}>
          Checkout (KES {cartTotal}) 💳
        </button>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '420px' }}>
            {!paymentSuccess ? (
              <form onSubmit={handleMpesaCheckout}>
                <h3 style={{ marginTop: 0 }}>📲 M-Pesa Checkout</h3>
                <p style={{ color: '#34d399', fontWeight: 'bold' }}>Total: KES {cartTotal}</p>
                <p style={{ color: '#38bdf8', fontSize: '0.9rem' }}>Send to: {mpesaReceiveNumber}</p>
                <input type="tel" placeholder="0712345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1rem' }} />
                <button type="submit" disabled={paying} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {paying ? 'Processing...' : `Confirm KES ${cartTotal}`}
                </button>
                <button type="button" onClick={closeModal} style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#34d399' }}>✅ Unlocked!</h3>
                <button onClick={closeModal} style={{ padding: '0.7rem 1.4rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
