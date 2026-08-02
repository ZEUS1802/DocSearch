import { useState } from 'react';
import axios from 'axios';
import DocumentFilter from './DocumentFilter';

const API_BASE = 'https://docsearch-2wfu.onrender.com';

function renderWithHighlight(text, highlight) {
    if (!highlight || !text.includes(highlight)) {
        return <span>{text}</span>;
    }
    const index = text.indexOf(highlight);
    const before = text.slice(0, index);
    const after = text.slice(index + highlight.length);
    return (
        <span>
            {before}
            <mark className="highlight-mark">{highlight}</mark>
            {after}
        </span>
    );
}

function SearchDocuments() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearching(true);
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                params: {
                    query,
                    top_k: 5,
                    ...(selectedDoc && { filename: selectedDoc }),
                },
            });
            setResults(response.data.results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div>
            <DocumentFilter selected={selectedDoc} onChange={setSelectedDoc} />

            <div className="search-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. how do I count things in Japanese"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={searching}>
                    {searching ? 'Searching...' : 'Search'}
                </button>
            </div>

            <div className="results-list">
                {results.map((result, index) => {
                    const isExpanded = expandedIndex === index;
                    const displayText = isExpanded
                        ? result.text
                        : result.text.slice(0, 300) + (result.text.length > 300 ? '...' : '');

                    return (
                        <div key={index} className="result-card">
                            <div className="result-meta">
                                <span className="result-filename">{result.filename} · chunk {result.chunk_index}</span>
                                <span className="result-tag">DIST {result.distance.toFixed(2)}</span>
                            </div>
                            <p className="result-text">
                                {renderWithHighlight(displayText, result.highlight)}
                            </p>
                            {result.text.length > 300 && (
                                <button
                                    className="expand-btn"
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                >
                                    {isExpanded ? 'Show less' : 'Show more'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SearchDocuments;