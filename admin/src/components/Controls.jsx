import React from "react";
import {BookOpen} from "lucide-react";
export function Select({ label, value, onChange, options }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {!options.length && <option value="">No data yet</option>}
        {options.map(([v, t]) => (
          <option value={v} key={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Empty({ title, text }) {
  return (
    <div className="empty">
      <BookOpen size={30} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function Citation({ data, id }) {
  const s = data.sources.find((s) => s.key === id);
  return s ? (
    <a href={s.url} target="_blank" rel="noreferrer">
      {s.title}
    </a>
  ) : (
    <span>Source unavailable: {id}</span>
  );
}
