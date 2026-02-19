import { useState } from 'react';

export default function ConversationList({ messages, onSelect, selectedId, activeFilter, onFilterChange }) {

    // Group messages by 'from' (phone number/user ID) to create conversation threads
    const conversations = Object.values(messages.reduce((acc, msg) => {
        if (!acc[msg.from]) {
            acc[msg.from] = {
                id: msg.from,
                name: msg.name || msg.from,
                lastMessage: msg.text,
                timestamp: msg.timestamp,
                type: msg.type || 'local',
                messages: []
            };
        }
        acc[msg.from].messages.push(msg);
        return acc;
    }, {}));

    // Sorting: Most recent first
    conversations.sort((a, b) => b.timestamp - a.timestamp);

    // Filter by active tab
    const filtered = activeFilter === 'all'
        ? conversations
        : conversations.filter(c => c.type === activeFilter);

    const getBadgeStyle = (type) => {
        switch (type) {
            case 'whatsapp': return { backgroundColor: '#25D366', color: 'white' };
            case 'facebook': return { backgroundColor: '#0084FF', color: 'white' };
            case 'instagram': return { backgroundColor: '#E1306C', color: 'white' };
            default: return { backgroundColor: '#6B7280', color: 'white' };
        }
    };

    const getPlatformLabel = (type) => {
        switch (type) {
            case 'whatsapp': return 'WA';
            case 'facebook': return 'FB';
            case 'instagram': return 'IG';
            default: return 'CRM';
        }
    };

    const tabs = [
        { label: 'All', value: 'all' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Messenger', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
    ];

    return (
        <div className="conversation-list-panel">
            <div className="list-header">
                <h2>Unified Inbox</h2>
                <input type="text" placeholder="Search conversations..." className="search-bar" />
            </div>
            <div className="filter-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab.value}
                        className={`tab ${activeFilter === tab.value ? 'active' : ''}`}
                        onClick={() => onFilterChange(tab.value)}
                        style={{ cursor: 'pointer' }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="conversations-scroll">
                {filtered.map(conv => (
                    <div
                        key={conv.id}
                        className={`conversation-card ${selectedId === conv.id ? 'active' : ''}`}
                        onClick={() => onSelect(conv)}
                    >
                        <div className="card-header">
                            <span className="customer-name">{conv.name}</span>
                            <span className="timestamp">
                                {new Date(conv.timestamp * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span className="badge" style={{
                                ...getBadgeStyle(conv.type),
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {getPlatformLabel(conv.type)}
                            </span>
                            <span className="last-message" style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '0.85rem',
                                color: '#666'
                            }}>
                                {conv.lastMessage}
                            </span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                        No conversations yet.<br />Waiting for messages...
                    </div>
                )}
            </div>
        </div>
    );
}

