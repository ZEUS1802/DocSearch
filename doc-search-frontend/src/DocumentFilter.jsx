import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

function DocumentFilter({ selected, onChange }) {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/documents`)
            .then(res => setDocuments(res.data.documents))
            .catch(err => console.error('Failed to load documents:', err));
    }, []);

    return (
        <select
            className="doc-filter"
            value={selected || ''}
            onChange={(e) => onChange(e.target.value || null)}
        >
            <option value="">All documents</option>
            {documents.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
            ))}
        </select>
    );
}

export default DocumentFilter;