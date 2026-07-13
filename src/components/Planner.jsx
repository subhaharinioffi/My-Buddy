import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Zap, 
  AlertCircle,
  Volume2,
  Sparkles
} from 'lucide-react';
import { useNotifications } from './NotificationSystem';

export default function Planner({ 
  tasks, 
  addTask, 
  deleteTask, 
  toggleTask, 
  stats, 
  updateStats 
}) {
  const { addNotification } = useNotifications();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDuration, setTaskDuration] = useState(25);
  const [taskSubject, setTaskSubject] = useState('React');

  // Pomodoro states
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const initialDurationRef = useRef(25);
  const timerRef = useRef(null);

  // Sync selected task duration to timer
  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);
    setTimerMinutes(task.duration);
    setTimerSeconds(0);
    setIsActive(false);
    setIsBreak(false);
    initialDurationRef.current = task.duration;
  };

  // Timer Tick Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((prev) => prev - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes > 0) {
            setTimerMinutes((prev) => prev - 1);
            setTimerSeconds(59);
          } else {
            // Timer Finished!
            handleTimerComplete();
          }
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timerMinutes, timerSeconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);

    // Play synthesized beep
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log("AudioContext failed to run on user action restriction");
    }

    // Explode confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (!isBreak) {
      // Finished a focus session
      addNotification(
        "Timer Complete! 🍕", 
        "Ding! Focus session cooked and ready. Take a well-deserved 5-min stretch break!", 
        "focus"
      );

      // Add to study time stat
      updateStats({
        ...stats,
        studyTime: stats.studyTime + initialDurationRef.current
      });

      // Complete selected task if any
      if (selectedTaskId) {
        toggleTask(selectedTaskId);
        setSelectedTaskId(null);
      }

      // Switch to break
      setIsBreak(true);
      setTimerMinutes(5);
      setTimerSeconds(0);
      initialDurationRef.current = 5;
    } else {
      // Finished break session
      addNotification(
        "Break's Over! 🚀", 
        "Back to the grind! Your brain cells have finished refueling.", 
        "motivation"
      );
      setIsBreak(false);
      setTimerMinutes(25);
      setTimerSeconds(0);
      initialDurationRef.current = 25;
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimerMinutes(isBreak ? 5 : initialDurationRef.current);
    setTimerSeconds(0);
  };

  // Skip / Fast Forward Timer for testing
  const skipTimer = () => {
    setTimerMinutes(0);
    setTimerSeconds(2);
    setIsActive(true);
    addNotification("Fast forwarding timer ⏱️", "Skipping to final seconds for demo purposes.", "focus");
  };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      duration: parseInt(taskDuration),
      subject: taskSubject
    });
    setTaskTitle('');
    addNotification("Task Scheduled! 📝", `Added '${taskTitle}' to planner queue.`, "motivation");
  };

  // AI Planner States & Logic
  const [aiQuery, setAiQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [thinkingMessage, setThinkingMessage] = useState('Analyzing study workload...');

  const handleAiRequest = (promptText) => {
    if (isThinking) return;
    setIsThinking(true);
    setAiSuggestions(null);
    setAiQuery(promptText);

    const phases = [
      "Analyzing study workload... 🧠",
      "Deconstructing subtasks & milestones... 🏗️",
      "Optimizing Pomodoro intervals... ⏱️",
      "Verifying cognitive retention buffers... 🤖"
    ];

    let currentPhase = 0;
    setThinkingMessage(phases[currentPhase]);

    const interval = setInterval(() => {
      currentPhase += 1;
      if (currentPhase < phases.length) {
        setThinkingMessage(phases[currentPhase]);
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setIsThinking(false);

      const text = promptText.toLowerCase();
      let suggestions = [];

      if (text.includes("react")) {
        suggestions = [
          { title: "Review React Component Lifecycle & Hooks", duration: 25, subject: "React" },
          { title: "Refactor standard inputs to use custom hooks", duration: 45, subject: "React" },
          { title: "Debug and build UI element states", duration: 25, subject: "React" }
        ];
      } else if (text.includes("figma") || text.includes("ui") || text.includes("ux")) {
        suggestions = [
          { title: "Map user persona & interactive flow drafts", duration: 15, subject: "UI UX" },
          { title: "Design wireframe grids in Figma workspace", duration: 45, subject: "UI UX" },
          { title: "Test micro-interactions & button spacing", duration: 25, subject: "UI UX" }
        ];
      } else if (text.includes("python") || text.includes("loop")) {
        suggestions = [
          { title: "Read nested loops & comprehension syntax", duration: 15, subject: "Python" },
          { title: "Complete 3 looping practice exercises", duration: 45, subject: "Python" },
          { title: "Analyze time complexity of loops", duration: 25, subject: "Python" }
        ];
      } else if (text.includes("science")) {
        suggestions = [
          { title: "Study molecular chemistry principles", duration: 25, subject: "Science" },
          { title: "Draw formulas and calculate equations", duration: 45, subject: "Science" },
          { title: "Consolidate learning into review notes", duration: 15, subject: "Science" }
        ];
      } else {
        const topicName = promptText.length > 30 ? promptText.substring(0, 30) + "..." : promptText;
        suggestions = [
          { title: `Read & research resources for: ${topicName}`, duration: 25, subject: "Productivity" },
          { title: `Implement hands-on practice for: ${topicName}`, duration: 45, subject: "Productivity" },
          { title: `Buddy review & notes cleanup`, duration: 15, subject: "Productivity" }
        ];
      }

      setAiSuggestions(suggestions);
      addNotification("AI Generation Complete! 🤖", "Buddy prepared a customized schedule for your session.", "motivation");
    }, 1800);
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    handleAiRequest(aiQuery);
  };

  const addAllAiTasks = () => {
    if (!aiSuggestions || aiSuggestions.length === 0) return;
    aiSuggestions.forEach((t) => {
      addTask({
        title: t.title,
        duration: t.duration,
        subject: t.subject
      });
    });
    addNotification("Queue Populated! 📥", `Imported ${aiSuggestions.length} tasks suggested by Buddy AI.`, "motivation");
    setAiSuggestions(null);
    setAiQuery('');
  };

  // Calculation for timer SVG progress ring
  const totalSeconds = initialDurationRef.current * 60;
  const remainingSeconds = (timerMinutes * 60) + timerSeconds;
  const strokePercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* LEFT COLUMN: FOCUS TIMER & POMODORO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TIMER CONTAINER */}
        <div className={`glass-card ${focusMode ? 'focus-overlay' : ''}`} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 30px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.5s ease',
          zIndex: focusMode ? 9999 : 10,
          background: focusMode ? '#070a13' : 'rgba(31, 41, 55, 0.45)'
        }}>
          {focusMode && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(3, 7, 18, 0.95) 100%)',
              animation: 'pulseGlow 10s infinite alternate',
              zIndex: -1
            }} />
          )}

          {/* Toggle Full-screen Focus Mode */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--card-border)',
              padding: '8px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <span style={{
            fontSize: '0.78rem',
            background: isBreak ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
            color: isBreak ? 'var(--accent-emerald)' : 'var(--accent-indigo)',
            padding: '4px 12px',
            borderRadius: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px'
          }}>
            {isBreak ? '☕ Break Session' : '🎯 Work Session'}
          </span>

          {/* Circular SVG Countdown Progress */}
          <div style={{
            position: 'relative',
            width: '220px',
            height: '220px',
            margin: '20px 0',
            animation: isActive ? 'rippleEffect 2s infinite' : 'none',
            borderRadius: '50%'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="2.5"
              />
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="transparent"
                stroke={isBreak ? 'var(--accent-emerald)' : 'var(--accent-indigo)'}
                strokeWidth="2.5"
                strokeDasharray={`${strokePercent} ${100 - strokePercent}`}
                strokeDashoffset="25"
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
                style={{
                  transition: 'stroke-dasharray 0.3s linear',
                  filter: `drop-shadow(0 0 8px ${isBreak ? 'var(--accent-emerald)' : 'var(--accent-indigo)'})`
                }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '3.25rem',
                fontWeight: 800,
                fontFamily: 'var(--font-family-title)',
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-1px'
              }}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Remaining
              </span>
            </div>
          </div>

          {/* Calming text in focus mode */}
          {focusMode && (
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              marginTop: '10px',
              marginBottom: '20px',
              animation: 'pulseGlow 3s infinite alternate'
            }}>
              "Inhale focus, exhale distractions..."
            </p>
          )}

          {/* TIMER CONTROLS */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '20px', alignItems: 'center' }}>
            <button
              onClick={toggleTimer}
              className="btn-primary"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isBreak ? '0 0 20px rgba(16, 185, 129, 0.4)' : '0 0 20px rgba(99, 102, 241, 0.4)',
                background: isBreak ? 'linear-gradient(135deg, var(--accent-emerald), var(--accent-violet))' : 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))'
              }}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
            </button>

            <button
              onClick={resetTimer}
              className="btn-secondary"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={18} />
            </button>

            {/* DEMO / FAST FORWARD BUTTON */}
            <button
              onClick={skipTimer}
              style={{
                fontSize: '0.72rem',
                padding: '6px 12px',
                borderColor: 'rgba(244, 63, 94, 0.25)',
                background: 'rgba(244, 63, 94, 0.05)',
                color: '#fda4af',
                borderRadius: '8px'
              }}
            >
              Fast Forward
            </button>
          </div>
        </div>

        {/* AI STUDY PLAN ASSISTANT */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)' }}>
            <Sparkles size={20} />
            <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Buddy AI Planner Assistant
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>
            Struggling to plan your session? Tell Buddy what you want to study, and the AI will construct a focused schedule.
          </p>

          {/* Quick suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button 
              onClick={() => handleAiRequest('React deep-dive breakdown')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', opacity: isThinking ? 0.5 : 1 }}
              disabled={isThinking}
            >
              💡 React 1.5 hr block
            </button>
            <button 
              onClick={() => handleAiRequest('Figma UI/UX wireframing checklist')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', opacity: isThinking ? 0.5 : 1 }}
              disabled={isThinking}
            >
              💡 Figma UI/UX wireframe
            </button>
            <button 
              onClick={() => handleAiRequest('Python Loops optimization practice')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', opacity: isThinking ? 0.5 : 1 }}
              disabled={isThinking}
            >
              💡 Python Loops practice
            </button>
          </div>

          {/* Input field */}
          <form onSubmit={handleAiSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              placeholder="Ask Buddy's AI to plan e.g. Study Java API for 2 hours..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="input-field"
              style={{ padding: '10px 14px', fontSize: '0.88rem', margin: 0 }}
              disabled={isThinking}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '10px 16px', borderRadius: '12px', opacity: isThinking ? 0.6 : 1, flexShrink: 0 }}
              disabled={isThinking}
            >
              Ask
            </button>
          </form>

          {/* AI Thinking Indicator */}
          {isThinking && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div className="shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 650 }}>{thinkingMessage}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-indigo)', animation: 'typingPulse 0.6s infinite' }} />
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-indigo)', animation: 'typingPulse 0.6s infinite 0.2s' }} />
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-indigo)', animation: 'typingPulse 0.6s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}

          {/* AI Results Display */}
          {aiSuggestions && aiSuggestions.length > 0 && !isThinking && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid var(--accent-indigo)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 AI Suggested Breakdown:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {aiSuggestions.map((t, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.title}</div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.subject}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                      {t.duration}m
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={addAllAiTasks}
                className="btn-primary" 
                style={{ padding: '10px 12px', fontSize: '0.82rem', justifyContent: 'center', marginTop: '4px' }}
              >
                📥 Add all AI tasks to Planner Queue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: TASK MANAGER SCHEDULER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* ADD TASK CARD */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Schedule New Study Task
          </h3>
          <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="input-field"
                placeholder=" "
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{ padding: '10px 14px' }}
              />
              <label className="input-label" style={{ top: '10px' }}>Task Name</label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Duration select */}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Duration</label>
                <select
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'rgba(99, 102, 241, 0.04)',
                    border: '1px solid var(--card-border)',
                    padding: '10px',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value={15}>15 Mins (Quick)</option>
                  <option value={25}>25 Mins (Standard)</option>
                  <option value={45}>45 Mins (Deep Focus)</option>
                  <option value={60}>60 Mins (Intense)</option>
                </select>
              </div>

              {/* Subject Category */}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Subject</label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(99, 102, 241, 0.04)',
                    border: '1px solid var(--card-border)',
                    padding: '10px',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="React">React</option>
                  <option value="UI UX">UI UX</option>
                  <option value="Python">Python</option>
                  <option value="Science">Science</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px', justifyContent: 'center' }}>
              <Plus size={16} /> Schedule Task
            </button>
          </form>
        </div>

        {/* TASK QUEUE LIST */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            My Planner Queue
          </h3>

          {/* Work Progress Tracker */}
          {tasks.length > 0 && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🎯 Today's Focus Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>
                  {tasks.filter(t => t.completed).length}/{tasks.length} Done ({tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-violet))',
                  borderRadius: '4px',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          )}

          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Clock size={30} style={{ marginBottom: '10px', strokeWidth: 1.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No tasks scheduled! Your queue is clean.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '260px' }}>
              {tasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-indigo)' : 'var(--card-border)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
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
                        {task.completed && <Check size={12} style={{ color: 'var(--accent-indigo)', strokeWidth: 3 }} />}
                      </button>
                      <div>
                        <div style={{
                          fontSize: '0.88rem',
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          fontWeight: 600
                        }}>
                          {task.title}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {task.subject}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-secondary)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {task.duration} mins
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Focus Fullscreen CSS Overrides */}
      <style>{`
        .focus-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          border-radius: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999 !important;
          padding: 40px !important;
        }
      `}</style>
    </div>
  );
}
