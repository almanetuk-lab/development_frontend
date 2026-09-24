/**
 * Builds a windowed page list: [1, "…", 4, 5, 6, "…", 20].
 *
 * Both member listings previously rendered one button per page via
 * Array.from({ length: totalPages }), which produces an unbounded row once the
 * corpus grows. Pure function, so it is trivially testable.
 */
export const DOTS = "…";

const range = (start, end) =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

export const getPageRange = (currentPage, totalPages, { siblingCount = 1, boundaryCount = 1 } = {}) => {
  // Enough room for every page plus both ellipses? Just show them all.
  const totalSlots = siblingCount * 2 + boundaryCount * 2 + 3;
  if (totalPages <= totalSlots) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots = rightSibling < totalPages - boundaryCount - 1;

  return [
    ...range(1, boundaryCount),
    ...(showLeftDots ? [DOTS] : range(boundaryCount + 1, boundaryCount + 1)),
    ...range(leftSibling, rightSibling),
    ...(showRightDots ? [DOTS] : range(totalPages - boundaryCount, totalPages - boundaryCount)),
    ...range(totalPages - boundaryCount + 1, totalPages),
  ];
};
