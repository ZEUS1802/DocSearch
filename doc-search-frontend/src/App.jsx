import { useState } from 'react';
import UploadDocument from './UploadDocument';
import SearchDocuments from './SearchDocuments';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h1>Document Search</h1>
            <UploadDocument onUploadSuccess={() => setRefreshKey(refreshKey + 1)} />
            <hr />
            <SearchDocuments key={refreshKey} />
        </div>
    );
}

export default App;