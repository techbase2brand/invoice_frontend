import React from 'react';

const Pagination = ({ currentPage, totalPages, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageSelect = (pageNumber) => {
        paginate(pageNumber);
    };

    return (
        <div className="flex">
            {pageNumbers.map((number, index) => (
                <React.Fragment key={number}>
                    {index === 0 && (
                        <select
                            onChange={(e) => handlePageSelect(parseInt(e.target.value))}
                            value={currentPage}
                            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            {pageNumbers.slice(index, index + 5).map((num) => (
                                <option key={num} value={num}>
                                    Page {num}
                                </option>
                            ))}
                        </select>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Pagination;
