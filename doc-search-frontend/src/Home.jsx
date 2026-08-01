function Home({ onTryIt }) {
    return (
        <>
            <section className="hero">
                <div className="hero-date serif">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h1 className="hero-title">
                    It's not keyword search.<br />
                    It's search that understands <em>what you mean</em>.
                </h1>
                <p className="hero-subtitle">
                    Upload a PDF or DOCX, ask in your own words, and find the passage you're
                    thinking of — even if you don't remember the exact term it uses.
                </p>
                <div className="hero-cta">
                    <button className="btn-primary" onClick={onTryIt}>
                        Try it now →
                    </button>
                </div>
            </section>

            <section className="how-it-works">
                <div className="step-card">
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="step-title">Upload your documents</div>
                    <div className="step-text">Add any PDF or DOCX file — a report, a textbook, your notes.</div>
                </div>

                <div className="step-card">
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                    </svg>
                    <div className="step-title">Ask in plain language</div>
                    <div className="step-text">Describe what you're looking for — you don't need the exact wording.</div>
                </div>

                <div className="step-card">
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
                    </svg>
                    <div className="step-title">Find the right passage</div>
                    <div className="step-text">Get back the actual matching text, ranked by relevance — not just a link.</div>
                </div>
            </section>
        </>
    );
}

export default Home;