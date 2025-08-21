import React from 'react';

export default function KeyInput({ value, onChange, type }) {
  return (
    <div>
      <label>Key / Shift</label><br/>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}  // Keep as string here
      />
    </div>
  );
}
