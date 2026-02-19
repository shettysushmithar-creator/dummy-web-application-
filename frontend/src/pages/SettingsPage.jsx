export default function SettingsPage() {
    return (
        <div className="settings-page">
            <div className="settings-header">
                <h2>⚙️ Settings</h2>
                <p className="settings-subtitle">Manage your CRM configuration</p>
            </div>

            {/* Business Profile */}
            <div className="settings-card">
                <h3 className="settings-card-title">🏢 Business Profile</h3>
                <div className="settings-row">
                    <label>Business Name</label>
                    <input type="text" defaultValue="Shetty Photography" className="settings-input" />
                </div>
                <div className="settings-row">
                    <label>Email</label>
                    <input type="email" defaultValue="shetty@business.com" className="settings-input" />
                </div>
                <div className="settings-row">
                    <label>Phone</label>
                    <input type="text" defaultValue="+91 98765 43210" className="settings-input" />
                </div>
                <button className="settings-save-btn">Save Changes</button>
            </div>

            {/* Platform Connections */}
            <div className="settings-card">
                <h3 className="settings-card-title">🔗 Platform Connections</h3>
                <div className="settings-platform-row">
                    <span className="settings-platform-label">
                        <span className="platform-dot wa">WhatsApp</span>
                    </span>
                    <span className="settings-status connected">● Connected</span>
                </div>
                <div className="settings-platform-row">
                    <span className="settings-platform-label">
                        <span className="platform-dot ig">Instagram</span>
                    </span>
                    <span className="settings-status connected">● Connected</span>
                </div>
                <div className="settings-platform-row">
                    <span className="settings-platform-label">
                        <span className="platform-dot fb">Facebook</span>
                    </span>
                    <span className="settings-status connected">● Connected</span>
                </div>
            </div>

            {/* Webhook Info */}
            <div className="settings-card">
                <h3 className="settings-card-title">🌐 Webhook Configuration</h3>
                <div className="settings-row">
                    <label>Webhook URL</label>
                    <div className="settings-code">/api/webhook</div>
                </div>
                <div className="settings-row">
                    <label>Verify Token</label>
                    <div className="settings-code">small_business</div>
                </div>
                <div className="settings-row">
                    <label>Server Port</label>
                    <div className="settings-code">8000</div>
                </div>
            </div>

            {/* About */}
            <div className="settings-card">
                <h3 className="settings-card-title">ℹ️ About</h3>
                <div className="settings-about-row"><span>Version</span><span>1.0.0</span></div>
                <div className="settings-about-row"><span>Backend</span><span>Node.js + Express</span></div>
                <div className="settings-about-row"><span>Database</span><span>PostgreSQL (Supabase)</span></div>
                <div className="settings-about-row"><span>Channels</span><span>WhatsApp · Instagram · Facebook</span></div>
            </div>
        </div>
    );
}
