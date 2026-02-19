export default function Sidebar({ activeFilter, onFilterChange, activePage, onPageChange }) {
    const navItems = [
        { label: 'Unified Inbox', icon: '📊', value: 'all' },
        { label: 'WhatsApp', icon: '💬', value: 'whatsapp' },
        { label: 'Instagram', icon: '📸', value: 'instagram' },
        { label: 'Facebook', icon: '👥', value: 'facebook' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">Meta AI CRM</div>

            {navItems.map(item => (
                <div
                    key={item.value}
                    className={`nav-item ${activePage !== 'settings' && activeFilter === item.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(item.value)}
                    style={{ cursor: 'pointer' }}
                >
                    {item.icon} {item.label}
                </div>
            ))}

            <div style={{ marginTop: 'auto' }}>
                <div
                    className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
                    onClick={() => onPageChange('settings')}
                    style={{ cursor: 'pointer' }}
                >
                    ⚙️ Settings
                </div>
            </div>
        </div>
    );
}
