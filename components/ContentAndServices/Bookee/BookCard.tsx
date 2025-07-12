import { DOMAIN } from "@/utils/urls";
import Link from "next/link";
import BookForm from "./BookForm";
import { useDialog } from "@/context/DialogContext";

/* eslint-disable @next/next/no-img-element */
export interface Book {
  id: string | number;
  cover: string;
  title: string;
  author: string;
  bookmark_count: number;
  chapter_count: number;
  rating: string | number;
  about: string | null;
  about_author: string | null;
  organization: string | null;
}

export default function BookCard({ book }: { book: Book }) {
  const { showDialog } = useDialog();

  return (
    <div className="w-full border-2 rounded-md">
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
          objectPosition: "top",
        }}
        className="w-full aspect-[5/4] rounded-xl px-12 pt-6 pb-0"
      />
      <div className="w-full py-3 px-4">
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
          <button
            type="button"
            onClick={() => {
              showDialog(
                <>
                  <BookForm instance={book} />
                </>
              );
            }}
            className="w-full flex-1 bg-transparent border border-black/60 py-2 px-3 flex gap-2 items-center justify-center rounded-full truncate"
          >
            <span>&#9998;</span>
            <span>Modify</span>
          </button>
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
