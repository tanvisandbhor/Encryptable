// components/ResultDisplay.js
import React from 'react';

export default function ResultDisplay({ result }) {
  return (
    <div>
      <label>Result:</label>
      <textarea readOnly value={result} rows={4} />
    </div>
  );
}
