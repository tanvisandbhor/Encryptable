import React, { useState } from 'react';

const allowedMimeTypes = [
  'text/plain',
  'application/json',
  'application/xml',
  'text/csv',
  // add more MIME types if needed
];

const maxSizeMB = 5; // max file size limit

export default function FileUpload({ onFileRead }) {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Validate MIME type
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a .txt or text file.');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB} MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onFileRead(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="form-label">Upload Text File (Max {maxSizeMB}MB, plain text only):</label>
      <input
        id="file-input"
        type="file"
        accept=".txt,text/plain,application/json,application/xml,text/csv"
        onChange={handleFileChange}
      />
      {error && <p className="file-error">{error}</p>}
    </div>
  );
}
