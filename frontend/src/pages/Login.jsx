import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Mail, Lock, ChevronRight, Rocket, User } from 'lucide-react';
import '../Styles/Login.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const baseUrl = "http://localhost:8000";
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const response = await axios.post(`${baseUrl}${endpoint}`, payload);

            if (isLogin) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userName', response.data.user.name);
                localStorage.setItem('userEmail', response.data.user.email);
                navigate('/');
            } else {
                setIsLogin(true);
                alert("Account created successfully! Please sign in.");
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className="home-container login-page">
            <nav className="home-navbar">
                <div className="nav-left">
                    <div className="brand-wrapper" onClick={() => navigate('/')}>
                        <Layout className="brand-icon" size={24} />
                        <h1 className="brand-name">ATS <span className="brand-accent">Launchpad</span></h1>
                    </div>
                </div>
            </nav>

            <div className="login-content">
                <div className="login-card-wrapper">
                    <div className="hero-preview login-card">
                        <div className="login-header">
                            <Rocket className="brand-icon" size={32} />
                            <h2>{isLogin ? 'Welcome' : 'Create'} <span className="brand-accent">{isLogin ? 'Back' : 'Account'}</span></h2>
                            <p className="preview-label">
                                {isLogin ? 'Enter details to access dashboard' : 'Fill in the details to get started'}
                            </p>
                        </div>

                        {error && <div className="error-box">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form">
                            {!isLogin && (
                                <div className="input-group">
                                    <label><User size={16} /> Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label><Lock size={16} /> Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary login-btn">
                                {isLogin ? 'Sign In' : 'Sign Up'} <ChevronRight size={18} />
                            </button>
                        </form>

                        <div className="login-footer">
                            <p className="preview-label">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    className="toggle-btn-link"
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        font: 'inherit',
                                        cursor: 'pointer',
                                        color: '#818cf8',
                                        fontWeight: '600',
                                        marginLeft: '5px'
                                    }}
                                >
                                    {isLogin ? ' Create Account' : ' Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;