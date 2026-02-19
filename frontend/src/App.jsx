import { useState, useEffect } from 'react';
import { getMessages } from './api';
import Sidebar from './components/Sidebar';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePage, setActivePage] = useState('inbox'); // 'inbox' or 'settings'

  useEffect(() => {
    if (!isLoggedIn) return;

    // Poll for new messages every 3 seconds
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="unified-inbox">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={(val) => { setActiveFilter(val); setActivePage('inbox'); }}
        activePage={activePage}
        onPageChange={setActivePage}
      />
      {activePage === 'settings' ? (
        <SettingsPage />
      ) : (
        <>
          <ConversationList
            messages={messages}
            onSelect={setSelectedConv}
            selectedId={selectedConv?.id}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <ChatWindow conversation={selectedConv} />
        </>
      )}
    </div>
  );
}
