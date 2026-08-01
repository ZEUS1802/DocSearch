import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://docsearch-2wfu.onrender.com';;

function UploadDocument({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage('');

        try {
            const response = await axios.post(`${API_BASE}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(`Uploaded: ${response.data.num_chunks} chunks created`);
            onUploadSuccess();
        } catch (error) {
            setMessage('Upload failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="upload-row">
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {message && (
                <p className={`status-message ${message.startsWith('Upload failed') ? 'error' : ''}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default UploadDocument;