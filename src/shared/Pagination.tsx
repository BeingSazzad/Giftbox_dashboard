import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showPageInfo?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showPageInfo = true,
}: PaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 1);

  const range = (start: number, end: number): number[] => {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => i + start);
  };

  const DOTS = "...";

  const paginationRange = (): (number | string)[] => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= safeTotalPages) {
      return range(1, safeTotalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < safeTotalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = safeTotalPages;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, safeTotalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(safeTotalPages - rightItemCount + 1, safeTotalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, safeTotalPages);
  };

  const pages = paginationRange();

  return (
    <div className="pagination">
      {showPageInfo && (
        <div className="pagination__info">
          Page <span className="pagination__info-current">{currentPage}</span> of{" "}
          <span className="pagination__info-total">{safeTotalPages}</span>
        </div>
      )}
      <div className="pagination__controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination__nav pagination__nav--prev"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        <div className="pagination__pages">
          {pages?.map((page, index) => {
            if (page === DOTS) {
              return (
                <span
                  key={`dot-${index}`}
                  className="pagination__dots"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`pagination__page ${
                  page === currentPage ? "pagination__page--active" : ""
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          className="pagination__nav pagination__nav--next"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
