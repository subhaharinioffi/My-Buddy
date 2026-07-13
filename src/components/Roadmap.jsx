import React, { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, ExternalLink, Check, ChevronDown, ChevronUp, CheckCircle, Trophy } from 'lucide-react';
import { useNotifications } from './NotificationSystem';

const PREDEFINED_ROADMAPS = {
  react: {
    title: "React.js Developer Path",
    nodes: [
      {
        id: 'r1',
        title: "React Basics & Ecosystem",
        description: "Understand the core concepts of React, single page applications (SPAs), JSX syntax, and Vite setup.",
        links: [
          { name: "Vite + React Getting Started Guide", url: "https://vite.dev" },
          { name: "Official React JSX Docs", url: "https://react.dev" }
        ],
        subtasks: [
          { id: 'rs1', text: "Understand React DOM vs Virtual DOM", completed: false },
          { id: 'rs2', text: "Create a new project using Vite CLI", completed: false },
          { id: 'rs3', text: "Practice rendering dynamic lists inside JSX", completed: false }
        ]
      },
      {
        id: 'r2',
        title: "Components & Props",
        description: "Master component-driven design, functional components, nesting elements, and data flow via attributes (props).",
        links: [
          { name: "Understanding Props - React.dev", url: "https://react.dev" },
          { name: "Thinking in React Components", url: "https://react.dev" }
        ],
        subtasks: [
          { id: 'rs4', text: "Create a reusable Card and Button component", completed: false },
          { id: 'rs5', text: "Pass dynamic text, numbers, and functions as Props", completed: false },
          { id: 'rs6', text: "Learn the rules of pure components", completed: false }
        ]
      },
      {
        id: 'r3',
        title: "State & Hooks (useState, useEffect)",
        description: "Manage component memory and handle lifecycle events. Learn when and how state renders components.",
        links: [
          { name: "React State & Hooks Complete Guide", url: "https://react.dev" },
          { name: "UseEffect Lifecycle Reference", url: "https://react.dev" }
        ],
        subtasks: [
          { id: 'rs7', text: "Build an interactive counter with useState", completed: false },
          { id: 'rs8', text: "Fetch dummy API data inside useEffect hook", completed: false },
          { id: 'rs9', text: "Clean up event listeners to prevent memory leaks", completed: false }
        ]
      },
      {
        id: 'r4',
        title: "React Routing (React Router)",
        description: "Handle pages and client-side routing within single page apps. Connect multiple view screens.",
        links: [
          { name: "React Router V6 Official Tutorial", url: "https://reactrouter.com" }
        ],
        subtasks: [
          { id: 'rs10', text: "Install React Router DOM package", completed: false },
          { id: 'rs11', text: "Create pages: Home, Dashboard, and Settings", completed: false },
          { id: 'rs12', text: "Implement navigation using <Link> tag routes", completed: false }
        ]
      },
      {
        id: 'r5',
        title: "Context API & Global State Management",
        description: "Avoid prop-drilling by creating global stores of data readable by any nested component.",
        links: [
          { name: "Passing Data Deeply with Context", url: "https://react.dev" }
        ],
        subtasks: [
          { id: 'rs13', text: "Initialize a ThemeContext for Dark/Light toggle", completed: false },
          { id: 'rs14', text: "Integrate useContext hook inside custom cards", completed: false },
          { id: 'rs15', text: "Refactor nested components to consume context state", completed: false }
        ]
      }
    ]
  },
  uiux: {
    title: "UI/UX Design Essentials",
    nodes: [
      {
        id: 'u1',
        title: "Design Thinking & Research",
        description: "Learn how to empathize with users, conduct interviews, and define problem statements.",
        links: [
          { name: "Interaction Design Foundation: What is Design Thinking?", url: "https://www.interaction-design.org" }
        ],
        subtasks: [
          { id: 'us1', text: "Conduct user interviews with 3 potential customers", completed: false },
          { id: 'us2', text: "Create user personas detailing needs and frustrations", completed: false },
          { id: 'us3', text: "Map a user journey from landing page to check out", completed: false }
        ]
      },
      {
        id: 'u2',
        title: "Information Architecture & Wireframing",
        description: "Organize layout items logically, creating flowcharts and skeletal structural wireframes.",
        links: [
          { name: "Figma Wireframing Basics Tutorial", url: "https://figma.com" }
        ],
        subtasks: [
          { id: 'us4', text: "Create a paper/lo-fi prototype sketch", completed: false },
          { id: 'us5', text: "Design a digital wireframe in Figma", completed: false },
          { id: 'us6', text: "Establish a clear layout grid system", completed: false }
        ]
      },
      {
        id: 'u3',
        title: "Visual Design & Typography",
        description: "Master colors, typography, sizing proportions, alignments, and visual hierarchy principles.",
        links: [
          { name: "Refactoring UI book summaries", url: "https://refactoringui.com" }
        ],
        subtasks: [
          { id: 'us7', text: "Select a harmonious color palette (60-30-10 rule)", completed: false },
          { id: 'us8', text: "Define typographic scale for Headings, Body, Captions", completed: false },
          { id: 'us9', text: "Align card grids with consistent spacing tokens", completed: false }
        ]
      },
      {
        id: 'u4',
        title: "High-Fidelity Prototyping (Figma)",
        description: "Transform wireframes into premium, interactive web mockups with realistic flows.",
        links: [
          { name: "Figma Smart Animate Advanced Tutorial", url: "https://figma.com" }
        ],
        subtasks: [
          { id: 'us10', text: "Design 4 complete page views with full assets", completed: false },
          { id: 'us11', text: "Link hover interactions and page transitions", completed: false },
          { id: 'us12', text: "Build dynamic component variants for buttons", completed: false }
        ]
      },
      {
        id: 'u5',
        title: "User Testing & Iteration",
        description: "Put your working prototype in front of real users, record friction points, and refine designs.",
        links: [
          { name: "Nielsen Norman Group: How to Usability Test", url: "https://www.nngroup.com" }
        ],
        subtasks: [
          { id: 'us13', text: "Run a cognitive walk-through test with 2 users", completed: false },
          { id: 'us14', text: "Document usability issues on a Kanban board", completed: false },
          { id: 'us15', text: "Implement visual changes based on feedback", completed: false }
        ]
      }
    ]
  }
};

export default function Roadmap({ stats, updateStats }) {
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoadmap, setActiveRoadmap] = useState(PREDEFINED_ROADMAPS.react);
  const [expandedNodeId, setExpandedNodeId] = useState('r1');
  const [customKey, setCustomKey] = useState(0);

  // Search submit - custom generating roadmaps
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    if (query.includes('react') || query.includes('js') || query.includes('web')) {
      setActiveRoadmap(PREDEFINED_ROADMAPS.react);
      setExpandedNodeId('r1');
      addNotification("React roadmap loaded! 🎯", "Buddy loaded the official React Developer map.", "focus");
    } else if (query.includes('design') || query.includes('ui') || query.includes('ux') || query.includes('figma')) {
      setActiveRoadmap(PREDEFINED_ROADMAPS.uiux);
      setExpandedNodeId('u1');
      addNotification("Design roadmap loaded! 🎨", "Figma and UX planning tools are ready.", "focus");
    } else {
      // Dynamic Mock Roadmap Generator
      const capitalizedTopic = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
      const generated = {
        title: `${capitalizedTopic} Explorer Roadmap`,
        nodes: [
          {
            id: 'c1',
            title: `Foundations of ${capitalizedTopic}`,
            description: `Understand the absolute basics, vocabulary, history, and basic configurations of ${capitalizedTopic}.`,
            links: [{ name: `Introduction to ${capitalizedTopic}`, url: "#" }],
            subtasks: [
              { id: 'cs1', text: "Learn core terms and vocabulary definitions", completed: false },
              { id: 'cs2', text: "Set up target development/reading tools", completed: false },
              { id: 'cs3', text: "Write or read a summary of foundational concepts", completed: false }
            ]
          },
          {
            id: 'c2',
            title: `Core Principles & Rules`,
            description: `Master the essential grammar, equations, rules, or workflows defining ${capitalizedTopic}.`,
            links: [{ name: `Deep Dive into ${capitalizedTopic} Principles`, url: "#" }],
            subtasks: [
              { id: 'cs4', text: "Document the key mechanics or core formulas", completed: false },
              { id: 'cs5', text: "Complete 3 simple beginner exercises", completed: false },
              { id: 'cs6', text: "Check your understanding with a mock exam/quiz", completed: false }
            ]
          },
          {
            id: 'c3',
            title: `Intermediate Workflows`,
            description: `Build structures combining foundational and core rules together into real-world applications.`,
            links: [{ name: `Applying ${capitalizedTopic} to Real Projects`, url: "#" }],
            subtasks: [
              { id: 'cs7', text: "Build a medium-sized mock project", completed: false },
              { id: 'cs8', text: "Resolve bugs or structural issues in your work", completed: false },
              { id: 'cs9', text: "Peer-review or read code/articles on advanced practices", completed: false }
            ]
          },
          {
            id: 'c4',
            title: `Testing, Debugging & Refinement`,
            description: `Examine your work, optimize efficiency, clean up code/writing, and address performance problems.`,
            links: [{ name: `Refining ${capitalizedTopic} Workflows`, url: "#" }],
            subtasks: [
              { id: 'cs10', text: "Measure efficiency and benchmark benchmarks", completed: false },
              { id: 'cs11', text: "Find and fix 3 hidden issues/errors", completed: false },
              { id: 'cs12', text: "Apply performance formatting rules", completed: false }
            ]
          },
          {
            id: 'c5',
            title: `Advanced Frameworks & Mastery`,
            description: `Deploy your projects, explore bleeding-edge concepts, and connect with communities in ${capitalizedTopic}.`,
            links: [{ name: `Advanced ${capitalizedTopic} Resources`, url: "#" }],
            subtasks: [
              { id: 'cs13', text: "Deploy your project or write a published article", completed: false },
              { id: 'cs14', text: "Learn 1 advanced sub-topic or third-party tool", completed: false },
              { id: 'cs15', text: "Plan your next learning milestone", completed: false }
            ]
          }
        ]
      };
      setActiveRoadmap(generated);
      setExpandedNodeId('c1');
      addNotification(`Generated custom roadmap! 🤖`, `Buddy created a custom learning path for '${capitalizedTopic}'.`, "motivation");
    }
  };

  // Toggle subtask completion inside roadmap state
  const toggleSubtask = (nodeId, subtaskId) => {
    const updatedNodes = activeRoadmap.nodes.map(node => {
      if (node.id !== nodeId) return node;
      
      const updatedSubtasks = node.subtasks.map(sub => {
        if (sub.id !== subtaskId) return sub;
        
        const nextState = !sub.completed;
        
        // Notify user about subtask completion (Swiggy style!)
        if (nextState) {
          const congratulations = [
            `Mouthful of knowledge! 😋 You completed a task in '${node.title}'.`,
            `Ding! Task done! 🍕 Delivered straight to your memory palace!`,
            `Boom! 💥 Task complete. You are cooking today, Chef!`,
            `Task completed! 🧗 Your brain cells are getting stronger!`
          ];
          const randomGreet = congratulations[Math.floor(Math.random() * congratulations.length)];
          addNotification("Task Completed! ✅", randomGreet, "focus");
          updateStats({
            ...stats,
            studyTime: stats.studyTime + 5 // award 5 mins per task
          });
        }
        
        return { ...sub, completed: nextState };
      });

      // Check if this action completes the entire Node
      const allDoneBefore = node.subtasks.every(s => s.completed);
      const allDoneAfter = updatedSubtasks.every(s => s.completed);

      if (!allDoneBefore && allDoneAfter) {
        // Node just finished! Trigger massive success celebration
        setTimeout(() => {
          if (window.confetti) {
            window.confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
        }, 100);

        addNotification(
          "Node Mastered! 🏆", 
          `Congratulations! You've conquered the entire '${node.title}' module! Buddy is proud.`, 
          "trophy"
        );
        
        updateStats({
          ...stats,
          tasksCompleted: stats.tasksCompleted + 1,
          studyTime: stats.studyTime + 15 // bonus time
        });
      } else if (allDoneBefore && !allDoneAfter) {
        // Node was complete, but user unchecked a task
        updateStats({
          ...stats,
          tasksCompleted: Math.max(0, stats.tasksCompleted - 1)
        });
      }

      return { ...node, subtasks: updatedSubtasks };
    });

    setActiveRoadmap({
      ...activeRoadmap,
      nodes: updatedNodes
    });
  };

  // Calculate overall roadmap progress
  const totalTasks = activeRoadmap.nodes.reduce((acc, curr) => acc + curr.subtasks.length, 0);
  const completedTasks = activeRoadmap.nodes.reduce((acc, curr) => acc + curr.subtasks.filter(s => s.completed).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* LEFT COLUMN: THE VISUAL ROADMAP TREE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Search / Topic Generator */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '14px' }}>
            What do you want to learn today?
          </h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="e.g. React.js, Figma, Python, Data Science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(99, 102, 241, 0.04)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '14px 16px 14px 44px',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-indigo)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '12px 20px', borderRadius: '12px' }}>
              Generate
            </button>
          </form>
        </div>

        {/* Roadmap Display */}
        <div className="glass-card" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
            <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)', padding: '4px 10px', borderRadius: '10px', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Learning Path
            </span>
            <h2 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 800, fontSize: '1.45rem', color: 'var(--text-primary)', marginTop: '8px' }}>
              {activeRoadmap.title}
            </h2>
          </div>

          {/* Node Connections Container */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '20px', marginTop: '10px' }}>
            
            {/* The vertical connection line */}
            <div style={{
              position: 'absolute',
              left: '32px',
              top: '24px',
              bottom: '24px',
              width: '3px',
              background: `linear-gradient(to bottom, var(--accent-indigo) ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}%)`,
              zIndex: 1,
              boxShadow: progressPercent > 0 ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'var(--transition-smooth)'
            }} />

            {/* Render Nodes */}
            {activeRoadmap.nodes.map((node, index) => {
              const isExpanded = expandedNodeId === node.id;
              const completedCount = node.subtasks.filter(s => s.completed).length;
              const nodeTotal = node.subtasks.length;
              const isNodeComplete = completedCount === nodeTotal;
              const percent = nodeTotal > 0 ? Math.round((completedCount / nodeTotal) * 100) : 0;

              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                  {/* Node Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Circle Node Icon Button */}
                    <button
                      onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isNodeComplete ? 'var(--accent-emerald)' : percent > 0 ? 'rgba(99, 102, 241, 0.2)' : 'var(--card-bg)',
                        border: '3px solid',
                        borderColor: isNodeComplete ? '#a7f3d0' : percent > 0 ? 'var(--accent-indigo)' : 'var(--card-border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isNodeComplete ? '0 0 10px var(--accent-emerald)' : percent > 0 ? '0 0 10px var(--accent-indigo-glow)' : 'none',
                        transition: 'var(--transition-smooth)',
                        flexShrink: 0
                      }}
                    >
                      {isNodeComplete && <Check size={14} style={{ color: '#064e3b', strokeWidth: 4 }} />}
                    </button>

                    {/* Node Title Details */}
                    <div
                      onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                      style={{ flex: 1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <h4 style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: isNodeComplete ? 'var(--accent-emerald)' : 'var(--text-primary)',
                          fontFamily: 'var(--font-family-title)',
                          transition: 'var(--transition-smooth)'
                        }}>
                          {index + 1}. {node.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {completedCount} / {nodeTotal} subtasks completed ({percent}%)
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                  {/* Node Body Details (Collapsible Drawer) */}
                  {isExpanded && (
                    <div style={{
                      marginLeft: '42px',
                      padding: '16px 20px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '12px',
                      marginTop: '12px',
                      animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      overflow: 'hidden'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {node.description}
                      </p>

                      {/* Sub-checklist tasks */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 650, textTransform: 'uppercase' }}>Checklist Checklist</span>
                        {node.subtasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleSubtask(node.id, task.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              padding: '6px 0',
                              fontSize: '0.85rem',
                              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            <div style={{
                              width: '18px',
                              height: '18px',
                              border: '1.5px solid',
                              borderColor: task.completed ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '4px',
                              background: task.completed ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'var(--transition-smooth)',
                              flexShrink: 0
                            }}>
                              {task.completed && <Check size={12} style={{ color: 'var(--accent-emerald)', strokeWidth: 3 }} />}
                            </div>
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Resource External Links */}
                      {node.links.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 650, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Recommended Resources</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {node.links.map((link, lIndex) => (
                              <a
                                key={lIndex}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  color: 'var(--accent-indigo)',
                                  fontSize: '0.8rem',
                                  textDecoration: 'underline'
                                }}
                              >
                                {link.name} <ExternalLink size={10} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: OVERALL STATISTICS & MOTIVATION CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* PROGRESS OVERVIEW */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', alignSelf: 'flex-start' }}>
            Roadmap Progress
          </h3>

          {/* SVG Progress Ring */}
          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '14px 0' }}>
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="15.915"
                fill="transparent"
                stroke="var(--card-border)"
                strokeWidth="3.5"
              />
              <circle
                cx="20"
                cy="20"
                r="15.915"
                fill="transparent"
                stroke="var(--accent-indigo)"
                strokeWidth="3.5"
                strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                strokeDashoffset="25"
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.5s ease',
                  filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.4))'
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
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)' }}>
                {progressPercent}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>
            You've completed <strong>{completedTasks}</strong> out of <strong>{totalTasks}</strong> subtasks on this learning path. Keep going, buddy!
          </p>
        </div>

        {/* STUDY COMPANION BOARD */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--card-bg) 100%)',
          borderColor: 'var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
            <Trophy size={20} />
            <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Companion Milestones
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: progressPercent >= 20 ? 1 : 0.5 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: progressPercent >= 20 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: progressPercent >= 20 ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}>
                🌱
              </div>
              <div>
                <div style={{ fontWeight: 650, fontSize: '0.82rem', color: 'var(--text-primary)' }}>Novice Bud (20%)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>First steps onto the path</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: progressPercent >= 60 ? 1 : 0.5 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: progressPercent >= 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: progressPercent >= 60 ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}>
                🌿
              </div>
              <div>
                <div style={{ fontWeight: 650, fontSize: '0.82rem', color: 'var(--text-primary)' }}>Competent Scholar (60%)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>More than half way done</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: progressPercent === 100 ? 1 : 0.5 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: progressPercent === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: progressPercent === 100 ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}>
                🌳
              </div>
              <div>
                <div style={{ fontWeight: 650, fontSize: '0.82rem', color: 'var(--text-primary)' }}>Full Mastery (100%)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completed the subject!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global slide Down Animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
      `}</style>
    </div>
  );
}
