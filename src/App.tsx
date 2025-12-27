import React, { useEffect, useState } from 'react';
import socketService from './services/socketService';
import { GameProvider } from './contexts/GameContext';
import PlayerView from './components/player/PlayerView';
import AdminDashboard from './components/admin/AdminDashboard';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // 1. Connect to Backend
    // Use env variable if available, otherwise localhost
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    socketService.connect(url);

    // 2. Check if URL ends with "/admin"
    if (window.location.pathname === '/admin') {
      setIsAdminMode(true);
    }
  }, []);

  return (
    <GameProvider>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        {isAdminMode ? <AdminDashboard /> : <PlayerView />}
      </div>
    </GameProvider>
  );
};

export default App;