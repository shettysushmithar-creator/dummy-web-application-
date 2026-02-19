import { useState, useEffect } from 'react';
import { getMessages } from './api';
import Sidebar from './components/Sidebar';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import LoginPage from './pages/LoginPage';
import './index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

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
      <Sidebar />
      <ConversationList
        messages={messages}
        onSelect={setSelectedConv}
        selectedId={selectedConv?.id}
      />
      <ChatWindow conversation={selectedConv} />
    </div>
  );
}
