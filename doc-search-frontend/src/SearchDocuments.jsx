import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

function SearchDocuments() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearching(true);
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                params: { query, top_k: 5 },
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
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your documents..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
            </button>

            <div>
                {results.map((result, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                        <p><strong>{result.filename}</strong> (chunk {result.chunk_index}, distance: {result.distance.toFixed(3)})</p>
                        <p>{result.text.slice(0, 300)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchDocuments;