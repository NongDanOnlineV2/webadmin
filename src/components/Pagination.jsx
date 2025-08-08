import React from 'react';

export default function Pagination({ current, total, onChange }) {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        Math.abs(i - current) <= 2
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== '...'
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  if (total <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-1">
      <button
        onClick={() => onChange(1)}
        disabled={current === 1}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        &laquo;
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-2 py-1">...</span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(p)}
            className={`px-3 py-1 border rounded ${
              current === p ? 'bg-black text-white' : ''
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(total)}
        disabled={current === total}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
}
