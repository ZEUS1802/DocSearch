import { useState } from 'react';
import axios from 'axios';
import DocumentFilter from './DocumentFilter';

const API_BASE = 'http://127.0.0.1:8000';

function SearchDocuments() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

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
                {results.map((result, index) => (
                    <div key={index} className="result-card">
                        <div className="result-meta">
                            <span className="result-filename">{result.filename} · chunk {result.chunk_index}</span>
                            <span className="result-tag">DIST {result.distance.toFixed(2)}</span>
                        </div>
                        <p className="result-text">{result.text.slice(0, 300)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchDocuments;