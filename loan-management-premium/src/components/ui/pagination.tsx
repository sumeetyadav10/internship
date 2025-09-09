"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    if (showEllipsisStart) {
      pages.push('ellipsis-start');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (showEllipsisEnd && totalPages > 3) {
      pages.push('ellipsis-end');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = generatePageNumbers();

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-lg transition-all",
          "hover:bg-white/5",
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-purple-400"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <div
                key={`${page}-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "w-10 h-10 rounded-lg font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "hover:bg-white/5 hover:text-purple-400 text-gray-400"
              )}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-lg transition-all",
          "hover:bg-white/5",
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-purple-400"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}

interface SimplePaginationProps {
  hasMore: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  isLoading?: boolean;
  className?: string;
}

export function SimplePagination({
  hasMore,
  onNext,
  onPrevious,
  canGoPrevious,
  isLoading = false,
  className
}: SimplePaginationProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
        className={cn(
          "px-4 py-2 rounded-lg font-medium transition-all",
          "flex items-center gap-2",
          "border border-white/10",
          !canGoPrevious || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white/5 hover:border-purple-500/50"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <button
        onClick={onNext}
        disabled={!hasMore || isLoading}
        className={cn(
          "px-4 py-2 rounded-lg font-medium transition-all",
          "flex items-center gap-2",
          "border border-white/10",
          !hasMore || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white/5 hover:border-purple-500/50"
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}