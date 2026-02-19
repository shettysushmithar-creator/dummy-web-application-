import { useState } from 'react';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className="login-password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    // Eye-off icon (hide)
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    // Eye icon (show)
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
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
