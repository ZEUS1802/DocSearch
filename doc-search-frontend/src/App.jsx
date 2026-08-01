import { useState, useEffect } from 'react';
import UploadDocument from './UploadDocument';
import SearchDocuments from './SearchDocuments';
import Home from './Home';
import UnderTheHood from './UnderTheHood';
import './App.css';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [view, setView] = useState('home');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <>
            <nav className="navbar">
                <div className="nav-logo">
                    DocSearch<span className="dot">.</span>
                </div>
                <div className="nav-links">
                    <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
                        Home
                    </button>
                    <button className={`nav-link ${view === 'app' ? 'active' : ''}`} onClick={() => setView('app')}>
                        Search
                    </button>
                    <button className={`nav-link ${view === 'tech' ? 'active' : ''}`} onClick={() => setView('tech')}>
                        Under the hood
                    </button>
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'light' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {view === 'home' && <Home onTryIt={() => setView('app')} />}

            {view === 'tech' && <UnderTheHood />}

            {view === 'app' && (
                <div className="app-container">
                    <h1 className="app-title serif">Document Search</h1>
                    <p className="app-subtitle">Upload files, then search them by meaning.</p>

                    <div className="card">
                        <div className="card-title">Upload a document</div>
                        <UploadDocument onUploadSuccess={() => setRefreshKey(refreshKey + 1)} />
                    </div>

                    <div className="card">
                        <div className="card-title">Search</div>
                        <SearchDocuments key={refreshKey} />
                    </div>
                </div>
            )}
        </>
    );
}

export default App;