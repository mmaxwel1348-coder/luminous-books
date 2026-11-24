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
Dedicated to the author's wife and children for their prayers and moral support, and to the Vincentian Ministries for bringing hope to God's children.

ACKNOWLEDGMENTS
Reflects on six years of writing and research alongside family life, ministry, and profession, thanking the Holy Trinity, the author's wife Regina and children Joy, Elvis, and Vincent, parents and siblings, reviewers, and readers.

FOREWORD
Introduces the book as a faith journey rooted in an ordinary life's daily struggles, family trials, and the meaning found in trusting God's plan and duties toward self, neighbor, and God.

PREFACE
Explains the book as a testimonial autobiography moving from early blessings through severe trials to a turning point in God's presence, followed by biblical and church teachings on suffering, Christian duties, and prayer.

CHAPTER ONE: CHILDHOOD MEMORIES
Recalls growing up in 1970s Uasin Gishu (Burnt Forest) as the third of twelve children to Michael and Jacinta, shaped by family history, hard work, humor, discipline, and daily Catholic prayer.

CHAPTER TWO: MY EDUCATION
Traces schooling from Koiluget Primary and Eldoret Union School to Njoro Boys High School and studying Pharmacy at the University of Nairobi, alongside leadership, music, and Kiswahili mashairi poetry.

CHAPTER THREE: MY FAITH
Follows early parish life as an altar boy with Fr. Francis, navigating religious questions in Eldoret and secondary school through Y.C.S., and leading Catholic student life and music at university.

CHAPTER FOUR: THE SEASON OF TRIBULATIONS
Chronicles early adulthood challenges including health issues, campus disruptions, the 1992 ethnic clashes and displacement to Nyandarua, and navigating HELB and travel hardships to finish university.

CHAPTER FIVE: FROM THE FRYING PAN INTO THE FIRE
Describes starting work in October 1997, drifting from regular prayer, enduring years of cervical spondylosis and trigeminal neuralgia, church marriage, pregnancy losses, and raising children through severe allergies and reflux.

CHAPTER SIX: MY TURNING POINT
Narrates attending the 2013 Vincentian retreat at Don Bosco Church, experiencing physical healing after sixteen years of pain, and praying through generational bondages for the healing of the children and restored voice and talents.

CHAPTER SEVEN: THE MISSING LINK
Covers later trials—including a stalled fourth music album, ongoing food allergies, a difficult house-help incident, a car accident, a home break-in, and family prayer and healing Masses—culminating in deliverance and gratitude.

SUMMARY OF PART I
Summarizes the testimonial autobiography around five core lessons: faith-rooted parenting and youth formation, God's presence inside life's storms, vulnerability before God, everyday miracles, and seeking deeper spiritual understanding.

CHAPTER EIGHT: FOLLOWING CHRIST
Opens Part II by examining Christian discipleship and categories of suffering—our cross, the suffering of Job and saints, and the roots of suffering—through Scripture and church teaching.

CHAPTER NINE: CONSEQUENTIAL SUFFERING
Explores unnecessary suffering stemming from inner wounds, sin, unforgiveness, unhealed trauma, harmful relationships, and ancestral bondages, along with steps toward repentance, forgiveness, sanctification, and spiritual warfare.

CHAPTER TEN: WHAT GOD REQUIRES OF US
Focuses on duties toward God—seeking and fearing the Lord, obeying His commandments in love, offering unceasing praise even in distress, and giving genuine tithes, offerings, and participation in the Mass.

CHAPTER ELEVEN: CATEGORY B - DUTIES TOWARDS SELF
Examines inner spiritual care through repentance and confession, limitless forgiveness, humility over pride, and persistent personal, family, and intercessory prayer.

CHAPTER TWELVE: CATEGORY C - DUTIES TOWARDS OTHERS
Highlights service to others through works of mercy and charity, witnessing and evangelization, and using God-given talents, gifts, and fruits of the Holy Spirit with humility.

CHAPTER THIRTEEN: PRAYERS FOR GUIDANCE
Brings together prayers for praise to the Holy Trinity, forgiveness, confession, deliverance, healing, protection, sufferers, a prayerful heart, obedience, humility, offerings, the needy, and the Peace Prayer of St. Francis of Assisi.

BIBLIOGRAPHY
Draws on Scripture (extensively using the Good News Bible), church teachings, writings of the saints, and spiritual works referenced across the book's testimonial and doctrinal chapters.`;

const MAJOR_HEADING_REGEX =
  /^(CHAPTER\s+[A-Z0-9]+|FOREWORD|INTRODUCTION|DEDICATION|ACKNOWLEDGMENTS|PREFACE|SUMMARY OF PART I|CONCLUSION TO THE BOOK|CLOSING PRAYER|BIBLIOGRAPHY)/i;

function paginateBookText(rawText, charsPerPage = 720) {
  if (!rawText || !rawText.trim()) return [];
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map(p => p.trim())
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
  const [loading, setLoading] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

  // Track which specific book IDs & song IDs have been paid for
  const [unlockedBookIds, setUnlockedBookIds] = useState([]);
  const [unlockedSongIds, setUnlockedSongIds] = useState([]);
  const [bookBookmarks, setBookBookmarks] = useState({});
  const [bookmarkToast, setBookmarkToast] = useState('');
  const [loadedBookTexts, setLoadedBookTexts] = useState({});

  // Reader Modal State (Books)
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageFlipAnim, setPageFlipAnim] = useState(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const pageSurfaceRef = useRef(null);

  // Music Player Modal State
  const [selectedSong, setSelectedSong] = useState(null);

  const defaultBooks = [
    {
      id: 'b1',
      title: 'A HERITAGE OF GOLD',
      author: 'Dr. Peter Ngotho Njoroge',
      price: '600',
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

  const defaultSongs = [
    {
      id: 'm1',
      title: 'Sacred Hymns Vol. 1',
      artist: 'Dr. Peter Ngotho Njoroge',
      price: '200',
      description: 'Inspiring choral and devotional audio collection (MP3/WAV).',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 'm2',
      title: 'Divine Grace - Full Album',
      artist: 'Dr. Peter Ngotho Njoroge',
      price: '500',
      description: 'Complete uplifting musical experience with soul-stirring melodies.',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
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
      const combinedBooks = localBooks.length > 0 ? [...localBooks, ...defaultBooks] : defaultBooks;
      setBooks(combinedBooks);

      const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
      if (savedPhone) {
        setMpesaReceiveNumber(savedPhone);
      }

      const savedUnlockedBooks = JSON.parse(localStorage.getItem('luminiousbooks_unlocked_books') || '[]');
      setUnlockedBookIds(savedUnlockedBooks);

      const savedUnlockedSongs = JSON.parse(localStorage.getItem('luminiousbooks_unlocked_songs') || '[]');
      setUnlockedSongIds(savedUnlockedSongs);

      const savedBookmarks = JSON.parse(localStorage.getItem('luminiousbooks_bookmarks') || '{}');
      setBookBookmarks(savedBookmarks);
    } catch (e) {
      setBooks(defaultBooks);
    }
    setLoading(false);
  }, []);

  const bookPages = useMemo(() => {
    if (!selectedBook) return [];
    const budget = isMobileScreen ? 420 : 720;
    const sourceText =
      loadedBookTexts[selectedBook.id] ||
      selectedBook.fullText ||
      selectedBook.summary ||
      '';
    return paginateBookText(sourceText, budget);
  }, [selectedBook, loadedBookTexts, isMobileScreen]);

  const chapterJumpOptions = useMemo(() => {
    const options = [{ label: 'Start / Cover Info', pageIndex: 0 }];
    bookPages.forEach((blocks, pageIdx) => {
      for (const block of blocks) {
        const firstLine = (block.split('\n')[0] || '').trim();
        if (MAJOR_HEADING_REGEX.test(firstLine)) {
          options.push({
            label: firstLine.length > 48 ? `${firstLine.slice(0, 45)}...` : firstLine,
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
      if (opt.pageIndex <= currentPageIndex) {
        matched = opt.pageIndex;
      }
    }
    return matched;
  }, [chapterJumpOptions, currentPageIndex]);

  const openBookReader = async (book) => {
    setSelectedBook(book);
    setCurrentPageIndex(0);
    setBookmarkToast('');
    if (pageSurfaceRef.current) {
      pageSurfaceRef.current.scrollTop = 0;
    }

    if (book.textUrl && !loadedBookTexts[book.id]) {
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
    }, 130);
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
      if (diffX > 0) {
        flipToPage(currentPageIndex + 1);
      } else {
        flipToPage(currentPageIndex - 1);
      }
    }
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

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
        .filter(item => item.fullText !== undefined || item.textUrl !== undefined || String(item.id).startsWith('b'))
        .map(item => item.id);
      const purchasedSongIds = cart
        .filter(item => item.description !== undefined && !item.fullText && !item.textUrl && !String(item.id).startsWith('b'))
        .map(item => item.id);

      const updatedBookIds = Array.from(new Set([...unlockedBookIds, ...purchasedBookIds]));
      const updatedSongIds = Array.from(new Set([...unlockedSongIds, ...purchasedSongIds]));

      setUnlockedBookIds(updatedBookIds);
      setUnlockedSongIds(updatedSongIds);

      try {
        localStorage.setItem('luminiousbooks_unlocked_books', JSON.stringify(updatedBookIds));
        localStorage.setItem('luminiousbooks_unlocked_songs', JSON.stringify(updatedSongIds));

        const savedSales = localStorage.getItem('luminiousbooks_sales');
        const salesData = savedSales ? JSON.parse(savedSales) : { totalSold: 0, totalRevenue: 0, salesList: [] };

        const newSalesList = cart.map(item => ({
          id: Date.now() + Math.random(),
          title: item.title,
          price: item.price,
          phone: phoneNumber,
          date: new Date().toLocaleDateString()
        }));

        const updatedSales = {
          totalSold: salesData.totalSold + cart.length,
          totalRevenue: salesData.totalRevenue + cartTotal,
          salesList: [...newSalesList, ...salesData.salesList]
        };

        localStorage.setItem('luminiousbooks_sales', JSON.stringify(updatedSales));
      } catch (err) {
        console.error(err);
      }

      setCart([]);
    }, 2000);
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

  const isBookUnlocked = (bookId) => unlockedBookIds.includes(bookId);
  const isSongUnlocked = (songId) => unlockedSongIds.includes(songId);

  const renderBookPageBlocks = (blocks) => {
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
              <div
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#92400e',
                  fontWeight: 700,
                  marginBottom: '0.16rem'
                }}
              >
                ✦ Luminous Edition ✦
              </div>
              <h4
                style={{
                  margin: 0,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.22rem',
                  lineHeight: 1.32,
                  color: '#1e1b18',
                  letterSpacing: '0.03em'
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
                  fontSize: '1.02rem',
                  lineHeight: 1.68,
                  color: '#292524',
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
              fontSize: '1.06rem',
              fontWeight: 700,
              color: '#78350f',
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
            margin: '0 0 0.75rem 0',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '1.02rem',
            lineHeight: 1.68,
            color: '#292524',
            whiteSpace: 'pre-line'
          }}
        >
          {block}
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
          padding: 0.9rem 1.25rem;
          overflow: hidden;
          min-height: 0;
        }

        .book-page-surface {
          flex: 1;
          min-height: 0;
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          background:
            radial-gradient(circle at top right, rgba(217, 172, 74, 0.14), transparent 45%),
            linear-gradient(to right, rgba(120, 83, 28, 0.09) 0%, rgba(253, 250, 242, 0.99) 3.5%, #fdfaf2 96.5%, rgba(120, 83, 28, 0.09) 100%);
          color: #292524;
          border-radius: 16px;
          padding: 1.5rem 2rem;
          box-shadow:
            inset 8px 0 14px -6px rgba(92, 64, 24, 0.24),
            0 16px 38px rgba(0, 0, 0, 0.45);
          border: 1px solid #e7dcc4;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transition: transform 0.13s ease, opacity 0.13s ease;
        }

        .book-page-flipping {
          opacity: 0.22;
          transform: translateX(12px) scale(0.992);
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
          .fullscreen-reader-shell { padding: 0.65rem 0.75rem; }
          .book-page-surface { padding: 1.15rem 1.1rem; border-radius: 12px; }
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
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>Read free summaries and unlock full-screen page-by-page reading after payment.</p>
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
                          {unlocked ? '🔓 Unlocked' : `KES ${book.price}`}
                        </span>
                        <button
                          onClick={() => openBookReader(book)}
                          style={{ backgroundColor: unlocked ? '#059669' : '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                          {unlocked ? '📖 Open Book' : '📖 Read Summary'}
                        </button>
                      </div>
                      {!unlocked && (
                        <button
                          onClick={() => addToCart(book)}
                          style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                        >
                          + Add to Cart (KES {book.price})
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
                          {unlocked ? '🔓 Unlocked' : `KES ${track.price}`}
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
                  <span>Total Amount:</span>
                  <span style={{ color: '#34d399' }}>KES {cartTotal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FULL-SCREEN PAGE-FLIP BOOK READER */}
      {selectedBook && (
        <div
          className="fullscreen-reader-shell"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '1080px',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(217, 172, 74, 0.25)',
              paddingBottom: '0.6rem',
              flexShrink: 0
            }}
          >
            <div style={{ minWidth: 0, flex: '1 1 200px' }}>
              <span style={{ fontSize: '0.7rem', color: isBookUnlocked(selectedBook.id) ? '#fbbf24' : '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, display: 'block' }}>
                {isBookUnlocked(selectedBook.id) ? '✦ Full-Screen Book Reader ✦' : '📖 Free Summary & Preview'}
              </span>
              <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.25rem', color: '#fef3c7', fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedBook.title}
              </h3>
            </div>

            {isBookUnlocked(selectedBook.id) && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', flex: '0 1 auto' }}>
                <button
                  type="button"
                  onClick={saveBookmarkForCurrentPage}
                  style={{
                    backgroundColor: savedBookmarkPageIndex === currentPageIndex ? '#047857' : '#1e293b',
                    color: '#fef3c7',
                    border: '1px solid rgba(217, 172, 74, 0.45)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.7rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {bookmarkToast || `🔖 Bookmark p.${currentPageIndex + 1}`}
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
                        padding: '0.45rem 0.7rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Go to Bookmark (p.{savedBookmarkPageIndex + 1})
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
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ✕ Clear
                    </button>
                  </>
                )}

                {chapterJumpOptions.length > 0 && (
                  <>
                    <label
                      htmlFor="chapter-jump-select"
                      style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      Chapter:
                    </label>
                    <select
                      id="chapter-jump-select"
                      aria-label="Jump to chapter or section"
                      value={activeChapterPageIndex}
                      onChange={(e) => flipToPage(Number(e.target.value))}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#fef3c7',
                        border: '1px solid rgba(217, 172, 74, 0.45)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.85rem',
                        maxWidth: '220px',
                        cursor: 'pointer'
                      }}
                    >
                      {chapterJumpOptions.map((opt) => (
                        <option key={`${opt.label}-${opt.pageIndex}`} value={opt.pageIndex}>
                          {opt.label} (p.{opt.pageIndex + 1})
                        </option>
                      ))}
                    </select>
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
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              ✕ Close Book
            </button>
          </div>

          {/* Reader Content Area */}
          {!isBookUnlocked(selectedBook.id) ? (
            <div style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '14px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 0.6rem 0', color: '#38bdf8', fontSize: '1.1rem' }}>Book Summary</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.8', margin: 0, fontSize: '1.05rem' }}>{selectedBook.summary}</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1.75rem', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '14px', border: '1px dashed #fbbf24' }}>
                <p style={{ color: '#e2e8f0', margin: '0 0 1rem 0', fontSize: '1rem' }}>Want full-screen page-by-page access to the entire book?</p>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    addToCart(selectedBook);
                    setCheckoutOpen(true);
                  }}
                  style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.85rem 1.65rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                >
                  Pay & Unlock Full Book (KES {selectedBook.price}) 💳
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={pageSurfaceRef}
                className={`book-page-surface ${pageFlipAnim ? 'book-page-flipping' : ''}`}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      color: '#92400e',
                      borderBottom: '1px solid rgba(146, 64, 14, 0.18)',
                      paddingBottom: '0.4rem',
                      marginBottom: '0.9rem',
                      fontStyle: 'italic'
                    }}
                  >
                    <span>{selectedBook.title}</span>
                    <span>{selectedBook.author || 'Dr. Peter Ngotho Njoroge'}</span>
                  </div>

                  {renderBookPageBlocks(bookPages[currentPageIndex] || [])}
                </div>

                <div
                  style={{
                    paddingTop: '0.5rem',
                    marginTop: '0.75rem',
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

              {/* Bottom Flip Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '1080px',
                  margin: '0.75rem auto 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(217, 172, 74, 0.28)',
                  flexShrink: 0
                }}
              >
                <button
                  onClick={() => flipToPage(currentPageIndex - 1)}
                  disabled={currentPageIndex === 0}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: currentPageIndex === 0 ? '#1e293b' : '#b45309',
                    color: currentPageIndex === 0 ? '#64748b' : '#fff',
                    fontWeight: 'bold',
                    cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.92rem'
                  }}
                >
                  ← Prev Page
                </button>

                <span style={{ fontSize: '0.9rem', color: '#fde68a', fontWeight: 600 }}>
                  Page {currentPageIndex + 1} / {bookPages.length}
                </span>

                <button
                  onClick={() => flipToPage(currentPageIndex + 1)}
                  disabled={currentPageIndex >= bookPages.length - 1}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: currentPageIndex >= bookPages.length - 1 ? '#1e293b' : '#d97706',
                    color: currentPageIndex >= bookPages.length - 1 ? '#64748b' : '#090d16',
                    fontWeight: 'bold',
                    cursor: currentPageIndex >= bookPages.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.92rem'
                  }}
                >
                  Next Page →
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
                      <source src={selectedSong.previewAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'} type="audio/mpeg" />
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
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📲 M-Pesa Send Money Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.0rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Items in Cart: {cart.length}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Total Due: KES {cartTotal}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Money To (Dr. Peter Ngotho Njoroge):</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your M-Pesa Phone Number (For Confirmation)</label>
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
                    {paying ? 'Processing Order...' : `Confirm KES ${cartTotal} Sent`}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.3rem', color: '#34d399', margin: '0 0 0.5rem 0' }}>Order Confirmed!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>Thank you! Your full book and audio access has been unlocked. Open the book to start flipping through the pages.</p>
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
