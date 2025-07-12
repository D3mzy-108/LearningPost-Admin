/* eslint-disable @next/next/no-img-element */
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { DOMAIN, GET_BOOKS_URL } from "@/utils/urls";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function BookeeDisplay() {
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<string>("0 of 0");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);

  const loadBooks = useCallback(
    async (search_string: string) => {
      const response = await http.get(GET_BOOKS_URL(search_string, pageNumber));
      if (response.success) {
        setBooks(response.data.books);
        setPage(response.data.page);
        setMaxPageNumber(response.data.num_pages);
      } else {
        showToast(response.message, "error");
      }
    },
    [showToast, pageNumber]
  );

  function searchForBooks(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loadBooks(formData.get("s")?.toString() || "");
  }

  useEffect(() => {
    loadBooks("");
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
          <Link
            href={""}
            className="pl-3 pr-4 py-1 rounded-t-md rounded-b-none border-2 border-b-0 border-black/60 text-black bg-transparent flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">New Book</span>
          </Link>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </form>

        {/* BOOK GRID */}
        <div className="w-full my-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="w-full flex justify-center">
          <div className="w-4 border-b-2 border-b-black/60"></div>
          <button
            onClick={() => {
              if (pageNumber <= 1) {
                setPageNumber(1);
              } else {
                setPageNumber(pageNumber - 1);
              }
            }}
            className="bg-transparent border-2 border-b-0 border-black/60 text-black/80 text-lg py-2 px-5 rounded-t-md rounded-b-none grid place-items-center"
          >
            <span>&larr;</span>
          </button>
          <button className="bg-transparent border-b-2 border-b-black/60 text-black/80 text-sm py-2 px-6 rounded-none grid place-items-center">
            <span>{page}</span>
          </button>
          <button
            onClick={() => {
              if (pageNumber >= maxPageNumber) {
                setPageNumber(maxPageNumber);
              } else {
                setPageNumber(pageNumber + 1);
              }
            }}
            className="bg-transparent border-2 border-b-0 border-black/60 text-black/80 text-lg py-2 px-5 rounded-t-md rounded-b-none grid place-items-center"
          >
            <span>&rarr;</span>
          </button>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </div>
      </div>
    </>
  );
}

interface Book {
  id: string | number;
  cover: string;
  title: string;
  author: string;
  bookmark_count: number;
  chapter_count: number;
  rating: string | number;
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="w-full p-2">
      <img
        src={`${
          book.cover.includes("https://") || book.cover.includes("http://")
            ? book.cover
            : DOMAIN + book.cover
        }`}
        alt={book.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/50x50/EEE/333333?text=";
        }} // Fallback image
        style={{
          objectFit: "cover",
        }}
        className="w-full aspect-[3/2] rounded-xl shadow-lg"
      />
      <div className="w-full py-3 px-2">
        <div className="w-full flex gap-2">
          {/* BOOK DETAILS */}
          <div className="flex-1 flex flex-col">
            <legend className="font-semibold text-lg">{book.title}</legend>
            <span className="text-black/60 text-sm">
              {book.author} - {book.bookmark_count} Saves
            </span>
            <div className="w-full flex gap-2 flex-wrap mt-2">
              <div className="w-fit px-2 py-1 text-xs rounded-md bg-blue-600/10 text-blue-600">
                <span>{"EPUB"}</span>
              </div>
              <div className="w-fit px-2 py-1 text-xs rounded-md bg-blue-600/10 text-blue-600">
                <span>{book.chapter_count} Chapters</span>
              </div>
            </div>
          </div>

          {/* BOOK RATING */}
          <span className="text-orange-500">{book.rating}&#x2605;</span>
        </div>

        {/* BOOK ACTIONS */}
        <div className="w-full mt-3 flex gap-2 text-sm">
          <Link
            href={""}
            className="w-full flex-1 bg-transparent border border-black/60 py-2 px-3 flex gap-2 items-center justify-center rounded-full truncate"
          >
            <span>&#9998;</span>
            <span>Modify</span>
          </Link>
          <Link
            href={""}
            className="w-full flex-1 bg-transparent border border-black/60 py-2 px-3 flex gap-2 items-center justify-center rounded-full truncate"
          >
            <span>&#9776;</span>
            <span>Chapters</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
