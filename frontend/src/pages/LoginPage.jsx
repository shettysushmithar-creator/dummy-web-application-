import { useState } from 'react';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            onLogin();
        } else {
            setError('Please enter your email and password.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                {/* Logo / Brand */}
                <div className="login-brand">
                    <div className="login-logo">💬</div>
                    <h1 className="login-title">Meta AI CRM</h1>
                    <p className="login-subtitle">Sign in to your unified inbox</p>
                </div>

                {/* Platform badges */}
                <div className="login-platforms">
                    <span className="platform-dot wa">WhatsApp</span>
                    <span className="platform-dot fb">Messenger</span>
                    <span className="platform-dot ig">Instagram</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}
                    <div className="login-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@business.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Sign In →
                    </button>
                </form>

                <p className="login-footer">Powered by Meta Webhooks</p>
            </div>
        </div>
    );
}
