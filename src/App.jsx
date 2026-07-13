import React, { useState } from 'react';
import IntroSplash from './components/IntroSplash';
import AuthScreen from './components/AuthScreen';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Planner from './components/Planner';
import Updates from './components/Updates';
import { NotificationProvider } from './components/NotificationSystem';

function MainApp() {
  const [screen, setScreen] = useState('splash'); // splash, auth, app
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Study Metrics
  const [stats, setStats] = useState({
    streak: 3, // Start with a small encouraging streak!
    tasksCompleted: 0,
    studyTime: 15 // Starts with a small pre-recorded study time
  });

  // Planner Tasks State
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Review React JSX Syntax ⚛️', duration: 15, subject: 'React', completed: false },
    { id: 't2', title: 'Design Figma Wireframes 📐', duration: 45, subject: 'UI UX', completed: false },
    { id: 't3', title: 'Read Pomodoro Science Guide ⏱️', duration: 25, subject: 'Productivity', completed: false }
  ]);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setScreen('app');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('auth');
    setActiveTab('dashboard');
  };

  const addTask = (newTask) => {
    const task = {
      id: String(Date.now()),
      ...newTask,
      completed: false
    };
    setTasks((prev) => [...prev, task]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const upcomingTasks = tasks.filter((t) => !t.completed);

  return (
    <>
      {screen === 'splash' && (
        <IntroSplash onComplete={() => setScreen('auth')} />
      )}

      {screen === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}

      {screen === 'app' && user && (
        <AppShell 
          user={user} 
          onLogout={handleLogout} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          stats={stats}
        >
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              stats={stats} 
              setActiveTab={setActiveTab} 
              upcomingTasks={upcomingTasks}
              toggleTask={toggleTask}
            />
          )}

          {activeTab === 'roadmap' && (
            <Roadmap 
              stats={stats}
              updateStats={setStats}
            />
          )}

          {activeTab === 'planner' && (
            <Planner 
              tasks={tasks}
              addTask={addTask}
              deleteTask={deleteTask}
              toggleTask={toggleTask}
              stats={stats}
              updateStats={setStats}
            />
          )}

          {activeTab === 'updates' && (
            <Updates />
          )}
        </AppShell>
      )}
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <MainApp />
    </NotificationProvider>
  );
}
