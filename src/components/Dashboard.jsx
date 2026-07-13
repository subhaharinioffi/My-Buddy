import React, { useState } from 'react';
import { 
  Flame, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Lightbulb,
  Compass,
  Zap
} from 'lucide-react';

const TIPS = [
  {
    title: "Feynman Technique",
    text: "Try explaining what you studied in simple terms to an imaginary 10-year old. If you get stuck, that's your learning gap!"
  },
  {
    title: "Active Recall",
    text: "Don't just re-read notes. Close the book and write down everything you remember. It forces your brain to retrieve info, building stronger neural connections."
  },
  {
    title: "Pomodoro Intervals",
    text: "Study for 25 mins, then take a 5 min break. Repeat 4 times, then take a longer break. It keeps fatigue at bay and maintains high focus."
  },
  {
    title: "Spaced Repetition",
    text: "Review topic intervals: Day 1, Day 3, Day 7, Day 14. This stops knowledge from sliding down the 'forgetting curve'."
  }
];

export default function Dashboard({ user, stats, setActiveTab, upcomingTasks, toggleTask }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodResponse, setMoodResponse] = useState('');
  const [tipIndex, setTipIndex] = useState(0);

  const handleMoodSelect = (mood, reaction, comment) => {
    setSelectedMood(mood);
    setMoodResponse(comment);
  };

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  const moods = [
    { emoji: '🧗', label: 'Energetic', comment: "Power overflow! ⚡ Let's tackle your hardest study nodes today. You've got the energy to crush it!" },
    { emoji: '🧘', label: 'Focused', comment: "Perfect alignment! 🎯 Open up the Study Planner, fire up the Pomodoro, and enter the flow state." },
    { emoji: '🥱', label: 'Tired', comment: "Low battery? 🔌 That's okay! Don't push too hard. Read a light article or watch a short tutorial today." },
    { emoji: '🫠', label: 'Overwhelmed', comment: "Breathe in, breathe out. 🌬️ Let's do just ONE tiny sub-task. You don't have to climb the whole mountain at once." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
      {/* GREETING HERO SECTION */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decorative */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(99, 102, 241, 0.25)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            <Sparkles size={14} /> Ready, Set, Learn
          </div>
          <h1 style={{ fontFamily: 'var(--font-family-title)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Hey {user.username}! Let's make progress.
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Your buddy has prepared a customized path for your study session. Pick your mood below to get started, or review your tracker statistics.
          </p>
        </div>
      </div>

      {/* METRICS STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* STAT 1: STREAK */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)'
          }}>
            <Flame size={24} style={{ filter: 'drop-shadow(0 0 4px var(--accent-rose))' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Study Streak</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
              {stats.streak} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>days</span>
            </div>
          </div>
        </div>

        {/* STAT 2: TASKS */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)'
          }}>
            <CheckCircle size={24} style={{ filter: 'drop-shadow(0 0 4px var(--accent-emerald))' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tasks Completed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
              {stats.tasksCompleted} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>nodes</span>
            </div>
          </div>
        </div>

        {/* STAT 3: FOCUS TIME */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <Clock size={24} style={{ filter: 'drop-shadow(0 0 4px var(--accent-indigo))' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Focus Study Time</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
              {stats.studyTime} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOOD CHECK-IN & TIP SECTION */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: '20px'
      }}>
        {/* MOOD METER */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            Daily Mood Check-in
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Be honest about your current state. Buddy will tailor advice for you!
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m.label, m.emoji, m.comment)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: selectedMood === m.label ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedMood === m.label ? '1px solid var(--accent-indigo)' : '1px solid var(--card-border)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: selectedMood === m.label ? '#fff' : 'var(--text-secondary)',
                  transition: 'var(--transition-smooth)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  if (selectedMood !== m.label) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMood !== m.label) {
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '10px',
              animation: 'fadeIn 0.3s ease',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              {/* Mini Buddy Emoji Reaction */}
              <div style={{
                fontSize: '2rem',
                background: 'rgba(99, 102, 241, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Buddy's Recommendation:
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {moodResponse}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TIP OF THE DAY CARD */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--card-bg) 100%)',
          borderColor: 'rgba(245, 158, 11, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', marginBottom: '14px' }}>
              <Lightbulb size={20} />
              <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Study Tip of the Day
              </h3>
            </div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 650, fontSize: '0.95rem', marginBottom: '6px' }}>
              {TIPS[tipIndex].title}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              {TIPS[tipIndex].text}
            </p>
          </div>

          <button
            onClick={nextTip}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              alignSelf: 'flex-end',
              marginTop: '16px',
              borderRadius: '8px',
              borderColor: 'rgba(245, 158, 11, 0.25)',
              background: 'rgba(245, 158, 11, 0.05)'
            }}
          >
            Show Next Tip
          </button>
        </div>
      </div>

      {/* WORK / ACTION TILES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* UPCOMING PLANNER TASKS */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Priority Planner Queue
            </h3>
            <button
              onClick={() => setActiveTab('planner')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-indigo)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              Go to Planner <ArrowRight size={12} />
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <CheckCircle size={24} style={{ marginBottom: '8px', strokeWidth: 1.5 }} />
              <p style={{ fontSize: '0.82rem' }}>No pending tasks! Add them in the planner to organize your day.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => toggleTask(task.id)}
                      style={{
                        background: 'transparent',
                        border: '1.5px solid var(--accent-indigo)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {task.completed && <span style={{ width: '10px', height: '10px', background: 'var(--accent-indigo)', borderRadius: '1.5px' }} />}
                    </button>
                    <span style={{
                      fontSize: '0.85rem',
                      color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-muted)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {task.duration} mins
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACCESS ACTIONS */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Jump directly into active study modes recommended by Buddy.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('planner')}
              className="btn-primary"
              style={{ padding: '14px', width: '100%', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={18} />
                <span>Start Focus Pomodoro</span>
              </div>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className="btn-secondary"
              style={{ padding: '14px', width: '100%', justifyContent: 'space-between', borderColor: 'rgba(99, 102, 241, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-indigo)' }}>
                <Compass size={18} />
                <span style={{ color: 'var(--text-primary)' }}>Open Study Roadmap</span>
              </div>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
