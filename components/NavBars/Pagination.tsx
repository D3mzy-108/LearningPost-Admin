"use client";
import { useState } from "react";

type PaginationProps = {
  page: string;
  initialPageNumber: number;
  maxPageNumber: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  initialPageNumber,
  maxPageNumber,
  onPageChange,
}: PaginationProps) {
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);

  return (
    <div className="w-full flex justify-center mt-5">
      <button
        onClick={() => {
          if (pageNumber <= 1) {
            setPageNumber(1);
          } else {
            onPageChange(pageNumber - 1);
            setPageNumber(pageNumber - 1);
          }
        }}
        className="bg-transparent border-l-2 border-black/20 rounded-lg text-black/80 text-lg py-2 px-5 grid place-items-center"
      >
        <span>&larr;</span>
      </button>
      <button className="bg-transparent border-2 border-black/60 text-black/80 text-sm py-2 px-6 rounded-md grid place-items-center">
        <span>{page}</span>
      </button>
      <button
        onClick={() => {
          if (pageNumber >= maxPageNumber) {
            setPageNumber(maxPageNumber);
          } else {
            onPageChange(pageNumber + 1);
            setPageNumber(pageNumber + 1);
          }
        }}
        className="bg-transparent border-r-2 border-black/20 rounded-lg text-black/80 text-lg py-2 px-5 grid place-items-center"
      >
        <span>&rarr;</span>
      </button>
    </div>
  );
}
