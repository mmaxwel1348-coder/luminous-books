import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';

const FULL_HERITAGE_OF_GOLD_TEXT = `A HERITAGE OF GOLD: UNVEILING THE TREASURE IN OUR YOUTH
By Dr. Peter Ngotho Njoroge
First edition: 2025
ISBN: 978-9914-35-182-8

DEDICATION
To all mentees, families, and leaders committed to walking with the next generation and helping young people discover their purpose.

ACKNOWLEDGMENTS
Grateful thanks to God, family, educators, mentors, and every reader who invests time and care into guiding youth toward a purposeful future.

FOREWORD
A call to see beyond surface challenges in young people and recognize the potential, gifts, and value waiting to be nurtured through intentional mentorship.

INTRODUCTION
Mentorship bridges generational gaps and equips young people with guidance, encouragement, and moral clarity when navigating modern pressures.

CHAPTER ONE: UNDERSTANDING MENTORSHIP: DEFINITION, PURPOSE AND THE CALL
Explores what mentorship means in everyday life, how mentors guide growth across different stages, and the core qualities that shape effective mentors.

CHAPTER TWO: BECOMING A MENTOR: DISCERNING THE CALL AND THE KEY QUALITIES
Looks at how mentorship begins, how mentors and mentees connect in daily life, and the habits and character traits that sustain healthy guidance.

CHAPTER THREE: THE SACRIFICE OF MENTORSHIP
Discusses the time, patience, and personal investment required to mentor well, along with common barriers that get in the way of generosity and service.

CHAPTER FOUR: REWARDS OF MENTORSHIP
Highlights how intentional mentorship strengthens both the mentee's confidence and direction and the mentor's own growth, perspective, and relationships.

CHAPTER FIVE: THE JOURNEY OF MENTORSHIP: FROM FAMILY TO SOCIETY
Traces how guidance expands from family and home life into schools, neighborhoods, workplaces, and wider community spaces.

CHAPTER SIX: SPECIAL MENTORSHIP: ADDRESSING SPECIAL NEEDS
Addresses supporting young people through different family circumstances, emotional challenges, and practical needs with care and wisdom.

CHAPTER SEVEN: DEPTH AND DURATION OF MENTORSHIP
Examines how mentorship varies in closeness and length—from brief encouragement to ongoing, long-term guidance.

CHAPTER EIGHT: COMMUNICATION AND COUNSELING IN MENTORSHIP
Covers practical conversation skills, active listening, boundaries, and supportive dialogue that help young people open up and make sound choices.

CHAPTER NINE: GROUP MENTORSHIP AND DYNAMICS
Explores guiding groups of young people, understanding different personalities, and encouraging healthy community growth.

CHAPTER TEN: THE BOY CHILD DEBATE: EMERGING VOICES IN MENTORSHIP
Reflects on the challenges facing boys and young men today and how families, mentors, and communities can offer balanced support.

CHAPTER ELEVEN: DANGERS TO MENTORSHIP: CAUSES AND COLLAPSE
Identifies warning signs, unhealthy patterns, and environmental pressures that can weaken or derail a mentoring relationship.

CHAPTER TWELVE: SCANDAL IN MENTORSHIP
Focuses on accountability, protecting young people from harm, and avoiding favoritism or misuse of trust.

CHAPTER THIRTEEN: STEPS TOWARDS ABUSE AND WOLVES IN SHEEP'S CLOTHING
Outlines how trust can be manipulated and how leaders and communities can spot red flags early.

CHAPTER FOURTEEN: THE CONSEQUENCES OF SCANDAL AND HOW TO AVOID IT
Examines the lasting impact of broken trust and practical safeguards that protect young people, families, and mentors.

CONCLUSION TO THE BOOK
A closing reflection on leaving a lasting legacy by investing patience, truth, and care into the next generation.

CLOSING PRAYER
A prayer for wisdom, discernment, and grace for mentors and young people alike.

BIBLIOGRAPHY
Reference notes and further reading on mentorship, youth development, and spiritual guidance.`;

const FULL_JOURNEYING_WITH_THE_LIVING_GOD_TEXT = `JOURNEYING WITH THE LIVING GOD: A PERSONAL ENCOUNTER
By Dr. Peter Ngotho Njoroge
First Edition: 2020 | Thika, Kenya

DEDICATION
Dedicated to the author's wife and children for their prayers and moral support, and to the Vincentian Ministries for bringing hope to God's children.`;

const MAJOR_HEADING_REGEX =
  /^(PART\s+[IVXLC0-9]+|CHAPTER\s+[A-Z0-9]+|SPECIAL\s+DEDICATION|DEDICATION|ACKNOWLEDGEMENT(?:S)?|FOREWORD|PREFACE|INTRODUCTION|SUMMARY\s+OF\s+PART\s+[IVXLC0-9]+|CONCLUSION(?:\s+TO\s+THE\s+BOOK)?|CLOSING\s+PRAYER|PRAYERS\s+FOR\s+GUIDANCE|BIBLIOGRAPHY)\b/i;

const ROMAN_PAGE_ONLY_REGEX = /^(?:[ivxlcdm]{1,8}|\d{1,4})$/i;

function isHeadingLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 110) return false;
  if (MAJOR_HEADING_REGEX.test(trimmed)) return true;

  const lettersOnly = trimmed.replace(/[^A-Za-z]/g, '');
  const upperLetters = trimmed.replace(/[^A-Z]/g, '');
  const isAllCapsHeading =
    lettersOnly.length >= 4 &&
    trimmed.length <= 85 &&
    upperLetters.length / lettersOnly.length >= 0.85 &&
    !/[.?!,;]$/.test(trimmed);

  return isAllCapsHeading;
}

function buildStructuredBlocks(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');

  const blocks = [];
  let paraBuffer = [];

  const flushParagraph = () => {
    if (paraBuffer.length === 0) return;
    const joined = paraBuffer
      .join(' ')
      .replace(/\s+([.,;:!?])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    paraBuffer = [];
    if (joined) {
      blocks.push({ type: 'paragraph', text: joined });
    }
  };

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (ROMAN_PAGE_ONLY_REGEX.test(line)) {
      continue;
    }

    if (isHeadingLine(line)) {
      flushParagraph();
      blocks.push({ type: 'heading', text: line });
      continue;
    }

    const isOrphanFragment =
      !/[.!?]["”']?$/.test(line) &&
      line.length <= 16 &&
      line.split(/\s+/).length <= 3;

    if (isOrphanFragment) {
      continue;
    }

    paraBuffer.push(line);
  }

  flushParagraph();
  return blocks;
}

function paginateBookText(rawText, charsPerPage = 1450) {
  const blocks = buildStructuredBlocks(rawText);
  if (blocks.length === 0) return [];

  const pages = [];
  let currentBlocks = [];
  let currentLen = 0;

  for (const block of blocks) {
    const blockLen = block.text.length + (block.type === 'heading' ? 110 : 18);

    if (currentLen + blockLen > charsPerPage && currentBlocks.length > 0) {
      pages.push(currentBlocks);
      currentBlocks = [block];
      currentLen = blockLen;
    } else {
      currentBlocks.push(block);
      currentLen += blockLen;
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
  const [loading, setLoading] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

  // Strictly locked until real full payment is verified
  const [unlockedBookIds, setUnlockedBookIds] = useState([]);
  const [unlockedSongIds, setUnlockedSongIds] = useState([]);
  const [bookBookmarks, setBookBookmarks] = useState({});
  const [bookmarkToast, setBookmarkToast] = useState('');
  const [loadedBookTexts, setLoadedBookTexts] = useState({});

  // Reader Modal State (Books)
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageFlipAnim, setPageFlipAnim] = useState(false);
  const pageSurfaceRef = useRef(null);

  // Music Player Modal State
  const [selectedSong, setSelectedSong] = useState(null);

  const defaultBooks = [
    {
      id: 'b1',
      title: 'A HERITAGE OF GOLD',
      author: 'Dr. Peter Ngotho Njoroge',
      price: '600',
      textUrl: '/books/heritage-of-gold.txt',
      summary:
        'Unveiling the Treasure in Our Youth. In a world wounded by moral confusion, broken families, and widening generational gaps, mentorship is no longer a luxury—it is a lifeline. Discover how parents, teachers, mentors, and leaders can recognize and draw out the gold within every young person.',
      fullText: FULL_HERITAGE_OF_GOLD_TEXT
    },
    {
      id: 'b2',
      title: 'JOURNEYING WITH THE LIVING GOD',
      author: 'Dr. Peter Ngotho Njoroge',
      price: '600',
      textUrl: '/books/journeying.txt',
      summary:
        'A Personal Encounter. A faith-filled testimonial autobiography and spiritual guide tracing life from childhood and education through severe health, family, and social trials to a profound turning point in God’s presence, followed by reflections on suffering, Christian duties, and prayer.',
      fullText: FULL_JOURNEYING_WITH_THE_LIVING_GOD_TEXT
    }
  ];

  const defaultSongs = [];

  useEffect(() => {
    const checkViewport = () => setIsMobileScreen(window.innerWidth <= 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    try {
      const localBooks = JSON.parse(localStorage.getItem('luminiousbooks_local_catalog') || '[]');
      const combinedBooks = localBooks.length > 0 ? [...localBooks, ...defaultBooks] : defaultBooks;
      setBooks(combinedBooks);

      const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
      if (savedPhone) {
        setMpesaReceiveNumber(savedPhone);
      }

      // Clear old unverified local unlocks so books stay locked until real payment
      localStorage.removeItem('luminiousbooks_unlocked_books');
      localStorage.removeItem('luminiousbooks_unlocked_songs');
      setUnlockedBookIds([]);
      setUnlockedSongIds([]);

      const savedBookmarks = JSON.parse(localStorage.getItem('luminiousbooks_bookmarks') || '{}');
      setBookBookmarks(savedBookmarks);
    } catch (e) {
      setBooks(defaultBooks);
      setUnlockedBookIds([]);
      setUnlockedSongIds([]);
    }
    setLoading(false);
  }, []);

  const bookPages = useMemo(() => {
    if (!selectedBook) return [];
    const budget = isMobileScreen ? 880 : 1450;
    const sourceText =
      loadedBookTexts[selectedBook.id] ||
      selectedBook.fullText ||
      selectedBook.summary ||
      '';
    return paginateBookText(sourceText, budget);
  }, [selectedBook, loadedBookTexts, isMobileScreen]);

  const openBookReader = async (book) => {
    setSelectedBook(book);
    setCurrentPageIndex(0);
    setBookmarkToast('');
    if (pageSurfaceRef.current) {
      pageSurfaceRef.current.scrollTop = 0;
    }

    // Only load full book text when verified unlocked
    if (isBookUnlocked(book.id) && book.textUrl && !loadedBookTexts[book.id]) {
      try {
        const res = await fetch(book.textUrl);
        if (res.ok) {
          const text = await res.text();
          if (text && text.trim()) {
            setLoadedBookTexts((prev) => ({ ...prev, [book.id]: text }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const flipToPage = (nextIdx) => {
    if (nextIdx < 0 || nextIdx >= bookPages.length) return;
    setPageFlipAnim(true);
    setTimeout(() => {
      setCurrentPageIndex(nextIdx);
      if (pageSurfaceRef.current) {
        pageSurfaceRef.current.scrollTop = 0;
      }
      setPageFlipAnim(false);
    }, 120);
  };

  const saveBookmarkForCurrentPage = () => {
    if (!selectedBook || bookPages.length === 0) return;
    const clampedIdx = Math.min(Math.max(currentPageIndex, 0), bookPages.length - 1);
    const updatedBookmarks = {
      ...bookBookmarks,
      [selectedBook.id]: clampedIdx
    };
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

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  // Does NOT auto-unlock without verified real payment
  const handleMpesaCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid M-Pesa phone number (e.g. 0712345678)');
      return;
    }
    setPaying(true);

    setTimeout(() => {
      setPaying(false);
      setPaymentSubmitted(true);

      try {
        const savedSales = localStorage.getItem('luminiousbooks_sales');
        const salesData = savedSales ? JSON.parse(savedSales) : { totalSold: 0, totalRevenue: 0, salesList: [] };

        const newSalesList = cart.map(item => ({
          id: Date.now() + Math.random(),
          title: item.title,
          price: item.price,
          phone: phoneNumber,
          status: 'pending_verification',
          date: new Date().toLocaleDateString()
        }));

        const updatedSales = {
          totalSold: salesData.totalSold,
          totalRevenue: salesData.totalRevenue,
          salesList: [...newSalesList, ...salesData.salesList]
        };

        localStorage.setItem('luminiousbooks_sales', JSON.stringify(updatedSales));
      } catch (err) {
        console.error(err);
      }

      setCart([]);
    }, 1200);
  };

  const closeModal = () => {
    setCheckoutOpen(false);
    setPaymentSubmitted(false);
    setPhoneNumber('');
  };

  let localSongs = [];
  try {
    localSongs = JSON.parse(localStorage.getItem('luminiousmusic_local_catalog') || '[]');
  } catch (e) {
    localSongs = [];
  }
  const allSongs = localSongs.length > 0 ? [...localSongs, ...defaultSongs] : defaultSongs;

  const isBookUnlocked = (bookId) => unlockedBookIds.includes(bookId);
  const isSongUnlocked = (songId) => unlockedSongIds.includes(songId);

  const renderBookPageBlocks = (blocks) => {
    return blocks.map((block, idx) => {
      if (block.type === 'heading') {
        const isChapter = /^CHAPTER\b/i.test(block.text.trim());
        return (
          <div
            key={idx}
            style={{
              background: isChapter
                ? 'linear-gradient(120deg, rgba(180, 83, 9, 0.2), rgba(217, 119, 6, 0.08), rgba(253, 250, 242, 0))'
                : 'linear-gradient(90deg, rgba(146, 64, 14, 0.14), rgba(146, 64, 14, 0.02))',
              borderLeft: '5px solid #b45309',
              borderBottom: '1px solid rgba(180, 83, 9, 0.22)',
              padding: '0.85rem 1.2rem',
              borderRadius: '0 12px 12px 0',
              marginTop: idx === 0 ? '0.1rem' : '1.15rem',
              marginBottom: '0.95rem'
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#92400e',
                fontWeight: 700,
                marginBottom: '0.25rem'
              }}
            >
              {isChapter ? '✦ Chapter Section ✦' : '✦ Luminous Edition ✦'}
            </div>
            <h4
              style={{
                margin: 0,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: isChapter ? '1.52rem' : '1.34rem',
                fontWeight: 700,
                lineHeight: 1.28,
                color: '#1c1917',
                letterSpacing: '0.02em'
              }}
            >
              {block.text}
            </h4>
          </div>
        );
      }

      return (
        <p
          key={idx}
          style={{
            margin: '0 0 0.85rem 0',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '1.08rem',
            lineHeight: 1.72,
            color: '#292524',
            textAlign: 'left'
          }}
        >
          {block.text}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Head>
        <title>Luminous Songs & Bookstore - Dr. Peter Ngotho Njoroge</title>
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
          background: linear-gradient(160deg, #1b150c 0%, #0f172a 55%, #17120a 100%);
          display: flex;
          flex-direction: column;
          padding: 0.4rem 0.5rem;
          overflow: hidden;
          min-height: 0;
        }

        .book-page-surface {
          flex: 1;
          min-height: 0;
          width: 100%;
          max-width: none;
          margin: 0;
          background:
            radial-gradient(circle at top right, rgba(217, 172, 74, 0.14), transparent 45%),
            linear-gradient(to right, rgba(120, 83, 28, 0.09) 0%, rgba(253, 250, 242, 0.99) 2.5%, #fdfaf2 97.5%, rgba(120, 83, 28, 0.09) 100%);
          color: #292524;
          border-radius: 12px;
          padding: 1.25rem 2.1rem;
          box-shadow:
            inset 8px 0 14px -6px rgba(92, 64, 24, 0.24),
            0 16px 38px rgba(0, 0, 0, 0.45);
          border: 1px solid #e7dcc4;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          overscroll-behavior: contain;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
          transition: transform 0.12s ease, opacity 0.12s ease;
        }

        .book-page-flipping {
          opacity: 0.25;
          transform: translateX(8px);
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
          .fullscreen-reader-shell { padding: 0.3rem 0.3rem; }
          .book-page-surface { padding: 0.95rem 0.9rem; border-radius: 10px; }
        }
      `}</style>

      {/* Mobile Top Header */}
      <header className="mobile-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.75rem 1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: '#38bdf8' }}>
          <span>📖</span> Dr. Ngotho
        </div>
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
      <aside className="desktop-sidebar" style={{ width: '70px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 0', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>📖</div>
        <button title="Home & About Author" onClick={() => setActiveCategory('home')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🏠</button>
        <button title="Books Store" onClick={() => setActiveCategory('books')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>📖</button>
        <button title="Music Catalog" onClick={() => setActiveCategory('music')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🎛️</button>
        <button title="Shopping Cart" onClick={() => setActiveCategory('cart')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', position: 'relative' }}>
          🛒
          {cart.length > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>{cart.length}</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, paddingBottom: '6rem' }}>

        {/* HOME VIEW */}
        {activeCategory === 'home' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a, #1e1b4b)', border: '1px solid #334155', borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '4rem' }}>🕊️</span>
              <h1 style={{ fontSize: '2.8rem', margin: '1rem 0 0.5rem 0', fontWeight: '800', color: '#fff' }}>Luminous Songs & Bookstore</h1>
              <p style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>Extraordinary Literature & Compositions by Dr. Peter Ngotho Njoroge</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '2px solid #2563eb', paddingBottom: '0.75rem' }}>📖 Meet the Author & Composer: Dr. Peter Ngotho Njoroge</h2>

              <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '1.25rem' }}>
                Welcome to a sanctuary of faith, wisdom, and divine inspiration. I am <strong style={{ color: '#38bdf8' }}>Dr. Peter Ngotho Njoroge</strong>—an author, publisher, and music composer called to touch souls and uplift spirits through extraordinary literature and heavenly melodies.
              </p>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Born with a deep passion for spiritual growth and community mentorship, my journey has been dedicated to guiding the next generation and nurturing moral resilience. In an era marked by shifting cultural values and generational gaps, my literary works—such as <em style={{ color: '#38bdf8' }}>A Heritage of Gold</em> and <em style={{ color: '#38bdf8' }}>Journeying with the Living God</em>—serve as practical lifelines for believers, parents, educators, and mentors seeking to build strong, faith-centered legacies.
              </p>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Beyond writing, my heart resonates deeply with choral composition. Through uplifting hymns and spiritual audio collections, I strive to create devotional spaces where every believer can draw closer to God through song. Thank you for walking this journey of faith with me.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <button onClick={() => setActiveCategory('books')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>Browse Books 📚</button>
                <button onClick={() => setActiveCategory('music')} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>Listen to Audio Songs 🎛️</button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKS VIEW */}
        {activeCategory === 'books' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2rem 1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>📚 Extraordinary Books</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>Books remain locked until full payment is completed and verified.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {books.map((book) => {
                const unlocked = isBookUnlocked(book.id);
                return (
                  <div key={book.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '140px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>📖</div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{book.title}</h3>
                      <p style={{ color: '#38bdf8', margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author || 'Dr. Peter Ngotho Njoroge'}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.summary}</p>
                    </div>

                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: unlocked ? '#38bdf8' : '#34d399' }}>
                          {unlocked ? '🔓 Unlocked' : `🔒 KES ${book.price}`}
                        </span>
                        <button
                          onClick={() => openBookReader(book)}
                          style={{ backgroundColor: unlocked ? '#059669' : '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                          {unlocked ? '📖 Read Full Book' : '🔒 Locked — Preview'}
                        </button>
                      </div>
                      {!unlocked && (
                        <button
                          onClick={() => addToCart(book)}
                          style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                        >
                          + Buy Full Book (KES {book.price})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MUSIC VIEW */}
        {activeCategory === 'music' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2rem 1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>💿 Music & Audio Catalog</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>Soul-stirring hymns and spiritual audio tracks by Dr. Peter Ngotho Njoroge.</p>
            </div>

            {allSongs.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>No songs available right now.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {allSongs.map((track) => {
                  const unlocked = isSongUnlocked(track.id);
                  return (
                    <div key={track.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ height: '140px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>🎵</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{track.title}</h3>
                        <p style={{ color: '#818cf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Composer: {track.artist || 'Dr. Peter Ngotho Njoroge'}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{track.description}</p>
                      </div>

                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: unlocked ? '#38bdf8' : '#34d399' }}>
                            {unlocked ? '🔓 Unlocked' : `🔒 KES ${track.price}`}
                          </span>
                          <button
                            onClick={() => setSelectedSong(track)}
                            style={{ backgroundColor: unlocked ? '#059669' : '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                          >
                            {unlocked ? '🎧 Listen Full' : '🎧 Preview Audio'}
                          </button>
                        </div>
                        {!unlocked && (
                          <button
                            onClick={() => addToCart(track)}
                            style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                          >
                            + Add to Cart (KES {track.price})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CART VIEW */}
        {activeCategory === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>Your cart is empty.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.25rem' }}>
                {cart.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{item.title}</h4>
                      <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.8rem' }}>{item.author ? `Author: ${item.author}` : `Composer: ${item.artist}`}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.95rem' }}>KES {item.price}</span>
                      <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.1rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Full Price Total:</span>
                  <span style={{ color: '#34d399' }}>KES {cartTotal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FULL-SCREEN PAGE-FLIP BOOK READER */}
      {selectedBook && (
        <div className="fullscreen-reader-shell">
          {/* Minimal Top Bar with Bookmark (shown only when unlocked) */}
          <div
            style={{
              width: '100%',
              margin: '0 0 0.35rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.15rem 0.25rem',
              flexShrink: 0
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '1.05rem',
                color: '#fef3c7',
                fontFamily: 'Georgia, "Times New Roman", serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
                minWidth: 0
              }}
            >
              {selectedBook.title}
            </h3>

            {isBookUnlocked(selectedBook.id) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={saveBookmarkForCurrentPage}
                  style={{
                    backgroundColor: savedBookmarkPageIndex === currentPageIndex ? '#047857' : '#1e293b',
                    color: '#fef3c7',
                    border: '1px solid rgba(217, 172, 74, 0.45)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {bookmarkToast || `🔖 p.${currentPageIndex + 1}`}
                </button>

                {savedBookmarkPageIndex !== null && (
                  <>
                    <button
                      type="button"
                      onClick={() => flipToPage(savedBookmarkPageIndex)}
                      style={{
                        backgroundColor: 'rgba(217, 119, 6, 0.2)',
                        color: '#fde68a',
                        border: '1px solid rgba(217, 172, 74, 0.45)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Go p.{savedBookmarkPageIndex + 1}
                    </button>

                    <button
                      type="button"
                      onClick={clearBookmarkForBook}
                      title="Remove saved bookmark"
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#fca5a5',
                        border: '1px solid rgba(248, 113, 113, 0.4)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedBook(null)}
              style={{
                backgroundColor: '#334155',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.82rem',
                flexShrink: 0
              }}
            >
              ✕ Close Book
            </button>
          </div>

          {/* Reader Content Area */}
          {!isBookUnlocked(selectedBook.id) ? (
            <div style={{ flex: 1, minHeight: 0, width: '100%', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '14px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 0.6rem 0', color: '#38bdf8', fontSize: '1.1rem' }}>🔒 Full Book Locked — Summary Only</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, fontSize: '1.05rem' }}>{selectedBook.summary}</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1.75rem', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '14px', border: '1px dashed #fbbf24' }}>
                <p style={{ color: '#e2e8f0', margin: '0 0 1rem 0', fontSize: '1rem' }}>Buy the book in full to unlock all pages.</p>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    addToCart(selectedBook);
                    setCheckoutOpen(true);
                  }}
                  style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.85rem 1.65rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                >
                  Buy Full Book (KES {selectedBook.price}) 💳
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={pageSurfaceRef}
                className={`book-page-surface ${pageFlipAnim ? 'book-page-flipping' : ''}`}
              >
                <div>{renderBookPageBlocks(bookPages[currentPageIndex] || [])}</div>

                <div
                  style={{
                    paddingTop: '0.45rem',
                    marginTop: '0.6rem',
                    borderTop: '1px solid rgba(146, 64, 14, 0.18)',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    color: '#78350f',
                    fontWeight: 600
                  }}
                >
                  — Page {currentPageIndex + 1} of {bookPages.length} —
                </div>
              </div>

              {/* Arrows Only at Bottom */}
              <div
                style={{
                  width: '100%',
                  margin: '0.3rem 0 0.15rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 0.35rem',
                  flexShrink: 0
                }}
              >
                <button
                  type="button"
                  aria-label="Previous Page"
                  onClick={() => flipToPage(currentPageIndex - 1)}
                  disabled={currentPageIndex === 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.2rem 0.65rem',
                    color: currentPageIndex === 0 ? 'rgba(253, 230, 138, 0.22)' : '#fbbf24',
                    fontWeight: 'bold',
                    cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1.7rem',
                    lineHeight: 1
                  }}
                >
                  ←
                </button>

                <button
                  type="button"
                  aria-label="Next Page"
                  onClick={() => flipToPage(currentPageIndex + 1)}
                  disabled={currentPageIndex >= bookPages.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.2rem 0.65rem',
                    color: currentPageIndex >= bookPages.length - 1 ? 'rgba(253, 230, 138, 0.22)' : '#fbbf24',
                    fontWeight: 'bold',
                    cursor: currentPageIndex >= bookPages.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '1.7rem',
                    lineHeight: 1
                  }}
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MUSIC PLAYER / PREVIEW MODAL */}
      {selectedSong && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: isSongUnlocked(selectedSong.id) ? '#34d399' : '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  {isSongUnlocked(selectedSong.id) ? '🔓 Full Audio Unlocked' : '🎧 Audio Preview'}
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.3rem', color: '#fff' }}>{selectedSong.title}</h3>
              </div>
              <button onClick={() => setSelectedSong(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.6rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1rem' }}>{selectedSong.description}</p>

              {!isSongUnlocked(selectedSong.id) ? (
                <div>
                  <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1rem', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sample Preview:</p>
                    <audio controls style={{ width: '100%' }}>
                      <source src={selectedSong.previewAudio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.25rem', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '12px', border: '1px dashed #38bdf8' }}>
                    <p style={{ color: '#cbd5e1', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Want full streaming & downloadable MP3/WAV access?</p>
                    <button
                      onClick={() => {
                        setSelectedSong(null);
                        addToCart(selectedSong);
                        setCheckoutOpen(true);
                      }}
                      style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      Buy Full Track for KES {selectedSong.price} 💳
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #34d399', textAlign: 'center' }}>
                  <p style={{ color: '#34d399', fontWeight: 'bold', margin: '0 0 1rem 0' }}>✅ Purchase Confirmed! Listen Below:</p>
                  <audio controls style={{ width: '100%', marginBottom: '1rem' }}>
                    <source src={selectedSong.fullAudio || selectedSong.previewAudio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedSong(null)} style={{ padding: '0.75rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Close Player
            </button>
          </div>
        </div>
      )}

      {/* Floating Checkout Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCheckoutOpen(true)}
          style={{
            position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#059669', color: '#ffffff',
            padding: '0.85rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.5)', zIndex: 900,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span>Checkout via M-Pesa (KES {cartTotal})</span> 💳
        </button>
      )}

      {/* M-Pesa Checkout Modal */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '420px' }}>
            {!paymentSubmitted ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📲 M-Pesa Full Payment Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.0rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Items in Cart: {cart.length}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Full Price Due: KES {cartTotal}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Full Payment To (Dr. Peter Ngotho Njoroge):</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your M-Pesa Phone Number (For Payment Reference)</label>
                  <input
                    type="tel"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', marginBottom: '1.25rem' }}
                  />
                  <button
                    type="submit"
                    disabled={paying}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: paying ? '#475569' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: paying ? 'not-allowed' : 'pointer' }}
                  >
                    {paying ? 'Recording Payment Request...' : `Submit KES ${cartTotal} Payment Details`}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <h3 style={{ fontSize: '1.3rem', color: '#fbbf24', margin: '0 0 0.5rem 0' }}>Payment Verification Required</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>Books stay locked until full payment is received and verified. Send KES {cartTotal} to {mpesaReceiveNumber} if you haven't already.</p>
                <button onClick={closeModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
