import Pagination from "@/components/NavBars/Pagination";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { DOMAIN, GET_BOOKS_URL } from "@/utils/urls";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useDialog } from "@/context/DialogContext";
import BookForm from "./BookForm";
import { Book } from "@/models/BookeeModels";

export default function BookeeDisplay() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<string>("0 of 0");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);
  const [searchVal, setSearchVal] = useState<string>("");

  const loadBooks = useCallback(
    async (search_string: string, pageNum: number) => {
      setSearchVal(search_string);
      const response = await http.get(GET_BOOKS_URL(search_string, pageNum));
      if (response.success) {
        setBooks(response.data.books);
        setPage(response.data.page);
        setMaxPageNumber(response.data.num_pages);
      } else {
        showToast(response.message, "error");
      }
    },
    [showToast]
  );

  function searchForBooks(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loadBooks(formData.get("s")?.toString() || "", 1);
    setPageNumber(1);
  }

  useEffect(() => {
    loadBooks("", 1);
  }, [loadBooks]);
  return (
    <>
      <div className="w-full px-2 py-5">
        <form
          onSubmit={searchForBooks}
          method="get"
          className="flex w-full justify-end"
        >
          <label
            htmlFor="search_books"
            className="w-fit px-2 border-b-2 border-b-black/60 grid place-items-center"
          >
            <span>&#128269;</span>
          </label>
          <input
            type="search"
            name="s"
            id="search_books"
            className="w-full max-w-[150px] px-3 py-2 border-b-2 border-b-black/60 placeholder:text-black/80"
            placeholder="Search Books..."
          />
          <button
            type="button"
            onClick={() => {
              showDialog(
                <>
                  <BookForm instance={null} isOrganizationInstance={false} />
                </>
              );
            }}
            className="pl-3 pr-4 py-1 rounded-t-md rounded-b-none border-2 border-b-0 border-black/60 text-black bg-transparent flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">New Book</span>
          </button>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </form>

        {/* BOOK GRID */}
        <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <Pagination
          page={page}
          initialPageNumber={pageNumber}
          maxPageNumber={maxPageNumber}
          onPageChange={(pageNum) => {
            loadBooks(searchVal, pageNum);
            setPageNumber(pageNum);
          }}
        />
      </div>
    </>
  );
}
