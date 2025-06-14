"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  canPreviousPage,
  canNextPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPreviousPage}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNextPage}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
