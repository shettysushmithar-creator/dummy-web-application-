import { useState } from 'react';
import { sendMessage, sendReply } from '../api';

export default function ChatWindow({ conversation }) {
    const [newMessage, setNewMessage] = useState('');

    if (!conversation) {
        return (
            <div className="chat-window" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888', height: '100%' }}>
                Select a conversation to start chatting
            </div>
        );
    }

    const getPlatformBadge = (type) => {
        switch (type) {
            case 'facebook': return { label: '💬 Facebook Messenger', color: '#0084FF' };
            case 'whatsapp': return { label: '📱 WhatsApp', color: '#25D366' };
            case 'instagram': return { label: '📸 Instagram', color: '#E1306C' };
            default: return { label: '💬 Messaging', color: '#6B7280' };
        }
    };

    const badge = getPlatformBadge(conversation.type);

    const handleSend = async (e) => {
        if (e.key === 'Enter' && newMessage.trim()) {
            try {
                if (conversation.type === 'facebook') {
                    // Facebook: send via Graph API
                    await sendReply('facebook', conversation.id, newMessage);
                } else {
                    // WhatsApp / Instagram: existing path (untouched)
                    await sendMessage({
                        name: conversation.name,
                        from: conversation.id,
                        text: newMessage
                    });
                }
                setNewMessage('');
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        }
    };

    return (
        <div className="chat-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="chat-header" style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>{conversation.name}</h3>
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'white',
                        background: badge.color,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginTop: '4px'
                    }}>
                        {badge.label}
                    </span>
                </div>
                <button
                    onClick={() => alert(`Marking ${conversation.type} conversation as resolved.`)}
                    style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Resolve
                </button>
            </div>

            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {conversation.messages.sort((a, b) => a.timestamp - b.timestamp).map((msg, idx) => (
                    <div key={idx} className={`message ${msg.from === 'local-user' ? 'sent' : 'received'}`} style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        alignSelf: msg.from === 'local-user' ? 'flex-end' : 'flex-start',
                        background: msg.from === 'local-user' ? badge.color : '#f1f1f1',
                        color: msg.from === 'local-user' ? 'white' : 'black'
                    }}>
                        {msg.text}
                        <div className="message-meta" style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                            {new Date(msg.timestamp * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input-area" style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleSend}
                    placeholder={`Reply on ${badge.label}...`}
                    style={{ width: '100%', padding: '12px', border: `1px solid ${badge.color}`, borderRadius: '8px', outline: 'none' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '8px', textAlign: 'center' }}>
                    Sent via Meta API Connect
                </p>
            </div>
        </div>
    );
}
