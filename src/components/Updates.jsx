import React, { useState } from 'react';
import { Newspaper, Bookmark, CheckCircle, ExternalLink, Sparkles, Filter, Star } from 'lucide-react';
import { useNotifications } from './NotificationSystem';

const CURATED_NEWS = [
  {
    id: 'n1',
    category: 'Tech News',
    title: 'Vite 6 is Out: Turbocharging Frontend Devs ⚡',
    summary: 'The latest major release of Vite introduces environment API support, enhanced CSS builds, and blazing fast hot-module replacement (HMR) times. A must-upgrade for React developers!',
    image: '/assets/vite_developer.png',
    readTime: '3 min read',
    source: 'TechCrunch',
    url: 'https://vite.dev',
    starred: false,
    read: false
  },
  {
    id: 'n2',
    category: 'Study Hacks',
    title: 'The Pomodoro Technique: Science of 25-Minute Focus Cycles ⏱️',
    summary: 'Research proves that dividing work into short intervals backed by mini breaks matches our brains natural attention span. Spans of 25 minutes prevent cognitive fatigue and help lock focus.',
    image: '/assets/pomodoro_science.png',
    readTime: '5 min read',
    source: 'ScienceDaily',
    url: 'https://wikipedia.org/wiki/Pomodoro_Technique',
    starred: false,
    read: false
  },
  {
    id: 'n3',
    category: 'Productivity',
    title: 'How Ambient Audio & Pink Noise Can Double Coding Focus 🎧',
    summary: 'A new neurological study reveals that steady, low-frequency sounds (like rainfall or pink noise) masks distracting spikes in background noise, keeping developer brains in high alpha-wave states.',
    image: '/assets/ambient_focus.png',
    readTime: '4 min read',
    source: 'Nature Neuroscience',
    url: 'https://wikipedia.org/wiki/Pink_noise',
    starred: false,
    read: false
  },
  {
    id: 'n4',
    category: 'Tech News',
    title: 'React Server Components (RSC): What Beginners Next to Know ⚛️',
    summary: 'React is shifting from pure client rendering to hybrid server-client paradigms. Understanding server component architectures is becoming a key requirement for modern frontend engineers.',
    image: '/assets/react_architecture.png',
    readTime: '6 min read',
    source: 'React Blog',
    url: 'https://react.dev',
    starred: false,
    read: false
  },
  {
    id: 'n5',
    category: 'Productivity',
    title: 'Why Sleeping After Study Sessions Consolidates Memory 😴',
    summary: 'Studies show that deep sleep (particularly REM stages) is when the brain replays and chemically stamps newly acquired skills from short-term hippocampus buffers into long-term cortex storage.',
    image: '/assets/sleep_consolidation.png',
    readTime: '4 min read',
    source: 'Stanford Medicine',
    url: 'https://wikipedia.org/wiki/Sleep_and_learning',
    starred: false,
    read: false
  }
];

export default function Updates() {
  const { addNotification } = useNotifications();
  const [articles, setArticles] = useState(CURATED_NEWS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const toggleBookmark = (id) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== id) return art;
        const nextState = !art.starred;
        if (nextState) {
          addNotification("Article Bookmarked! ⭐️", `Added '${art.title}' to your favorites.`, "motivation");
        }
        return { ...art, starred: nextState };
      })
    );
  };

  const toggleRead = (id) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== id) return art;
        const nextState = !art.read;
        if (nextState) {
          addNotification("Article Read! 📚", `Knowledge absorbed! +1 learning points.`, "focus");
        }
        return { ...art, read: nextState };
      })
    );
  };

  const categories = ['All', 'Tech News', 'Study Hacks', 'Productivity'];

  const filteredArticles = articles.filter((art) => {
    const categoryMatch = activeCategory === 'All' || art.category === activeCategory;
    const bookmarkMatch = !showBookmarksOnly || art.starred;
    return categoryMatch && bookmarkMatch;
  });

  const readCount = articles.filter(a => a.read).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* LEFT COLUMN: THE NEWS FEED GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* FILTERS NAVBAR */}
        <div className="glass-card" style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--accent-indigo)' : 'var(--card-border)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: activeCategory === cat ? 600 : 500,
                  transition: 'var(--transition-smooth)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: showBookmarksOnly ? 'rgba(245,158,11,0.1)' : 'transparent',
              color: showBookmarksOnly ? 'var(--accent-amber)' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: showBookmarksOnly ? 'var(--accent-amber)' : 'var(--card-border)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'var(--transition-smooth)'
            }}
          >
            <Bookmark size={14} fill={showBookmarksOnly ? 'var(--accent-amber)' : 'none'} />
            Bookmarks Only
          </button>
        </div>

        {/* FEED LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredArticles.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Newspaper size={36} style={{ marginBottom: '12px', strokeWidth: 1.5 }} />
              <p>No articles found matching filters. Star articles to show bookmarks!</p>
            </div>
          ) : (
            filteredArticles.map((art) => (
              <article
                key={art.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: art.read ? 0.7 : 1,
                  background: 'var(--card-bg)',
                  borderLeft: art.starred ? '4px solid var(--accent-amber)' : '1px solid var(--card-border)'
                }}
              >
                {/* Header Tag Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: 600
                    }}>
                      {art.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      • {art.readTime}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Bookmark star */}
                    <button
                      onClick={() => toggleBookmark(art.id)}
                      style={{ background: 'transparent', border: 'none', color: art.starred ? 'var(--accent-amber)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Star size={16} fill={art.starred ? 'var(--accent-amber)' : 'none'} />
                    </button>
                    {/* Read check */}
                    <button
                      onClick={() => toggleRead(art.id)}
                      style={{ background: 'transparent', border: 'none', color: art.read ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '4px' }}
                    >
                      <CheckCircle size={16} fill={art.read ? 'rgba(16,185,129,0.1)' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Article Card Image */}
                {art.image && (
                  <div style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                )}

                {/* Body Content */}
                <h3 style={{
                  fontFamily: 'var(--font-family-title)',
                  fontWeight: 750,
                  fontSize: '1.15rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3
                }}>
                  {art.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  {art.summary}
                </p>

                {/* Footer link */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '6px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  paddingTop: '10px'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Published by <strong>{art.source}</strong>
                  </span>
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent-indigo)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'underline'
                    }}
                  >
                    Read Source <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: KNOWLEDGE STATS & READING SUMMARY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* READING METRICS CARD */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Updates Reading Tracker
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.4 }}>
            Buddy tracks the topics you read to recommend new concepts. Active reading expands the mind!
          </p>

          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid var(--card-border)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-title)' }}>
                {readCount}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Articles Read</span>
            </div>
            <div style={{ width: '1px', background: 'var(--card-border)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-title)' }}>
                {articles.filter(a => a.starred).length}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bookmarks</span>
            </div>
          </div>
        </div>

        {/* STUDY TIP BOARD */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, var(--card-bg) 100%)',
          borderColor: 'var(--card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', marginBottom: '14px' }}>
            <Sparkles size={20} />
            <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Buddy Recommendation
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            "Make it a habit to read at least 1 tech news piece and 1 study guide article every morning. Knowledge compounds just like money! 📈"
          </p>
        </div>
      </div>
    </div>
  );
}
