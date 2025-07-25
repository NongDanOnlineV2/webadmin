import React from 'react'

const Pagination = ({ page, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        className={`px-3 py-1 border rounded ${page === 1 ? 'text-gray-400 border-gray-300' : 'text-black border-black hover:bg-black-50'}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        &laquo;
      </button>
      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-1 text-green-600">...</span>
        ) : (
          <button
            key={`page-${p}`}
            className={`px-3 py-1 border rounded ${p === page ? 'bg-black text-white' : 'text-white-600 border-black hover:bg-black-50'}`}
            disabled={p === page}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        className={`px-3 py-1 border rounded ${page === totalPages ? 'text-gray-400 border-gray-300' : 'text-black border-black hover:bg-black-50'}`}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination