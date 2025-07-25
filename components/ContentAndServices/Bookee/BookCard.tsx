import { DOMAIN } from "@/utils/urls";
import Link from "next/link";
import BookForm from "./BookForm";
import { useDialog } from "@/context/DialogContext";
import { Book } from "@/models/BookeeModels";

/* eslint-disable @next/next/no-img-element */
export default function BookCard({ book }: { book: Book }) {
  const { showDialog } = useDialog();

  return (
    <div className="w-full rounded-md">
      <div className="w-full px-12 pt-6 pb-0">
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
            filter: "brightness(90%)",
          }}
          className="w-full aspect-[6/5] rounded-t-lg"
        />
      </div>
      <div className="w-full border-2 rounded-xl py-3 px-4">
        <div className="w-full flex gap-2">
          {/* BOOK DETAILS */}
          <div className="flex-1 flex flex-col">
            <div className="w-full font-semibold text-lg line-clamp-2">
              {book.title}
            </div>
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
                  <BookForm
                    instance={book}
                    isMutableOrganizationInstance={false}
                    organizationCode={book.organization}
                  />
                </>
              );
            }}
            className="w-full flex-1 bg-transparent border border-black/60 py-2 px-3 flex gap-2 items-center justify-center rounded-full truncate"
          >
            <span>&#9998;</span>
            <span>Modify</span>
          </button>
          <Link
            href={"/portal/content-and-services/bookee/?bid=" + book.id}
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
