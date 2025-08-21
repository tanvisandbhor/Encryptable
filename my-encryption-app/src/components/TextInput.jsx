// components/TextInput.js
import React from 'react';

export default function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label><br/>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} />
    </div>
  );
}
