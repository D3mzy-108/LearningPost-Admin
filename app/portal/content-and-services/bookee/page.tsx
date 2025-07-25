/* eslint-disable @next/next/no-img-element */
"use client";
import { useDialog } from "@/context/DialogContext";
import { useToast } from "@/context/ToastContext";
import { Book } from "@/models/BookeeModels";
import http from "@/utils/http";
import {
  DELETE_BOOK_CHAPTER_URL,
  DOMAIN,
  FETCH_BOOK_CHAPTERS_URL,
  UPLOAD_BOOK_CHAPTER_URL,
} from "@/utils/urls";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function BookView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showDialog, hideDialog } = useDialog();
  const [chapters, setChapters] = useState<
    { id: string | number; title: string }[]
  >([]);
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const bookId = searchParams.get("bid");
      if (bookId === null) {
        showToast("Book not Found", "warning");
        router.push("/portal/content-and-services/");
        return;
      }
      const response = await http.get(FETCH_BOOK_CHAPTERS_URL(bookId));
      if (!response.success) {
        showToast(response.message, "error");
      } else {
        setChapters(response.data.chapters);
        setBook(response.data.book);
      }
    }

    fetchQuestions();
  }, [router, searchParams, showToast]);

  async function deleteChapter(chapterId: string | number) {
    const response = await http.get(DELETE_BOOK_CHAPTER_URL(chapterId));
    if (!response.success) {
      showToast(response.message, "error");
    } else {
      router.refresh();
      showToast(response.message, "warning");
      hideDialog();
    }
  }

  if (book === null) {
    return <div className="grid place-items-center">Loading...</div>;
  }

  return (
    <>
      <div className="w-full space-y-8 py-4 md:px-2">
        <div className="w-full flex gap-4 items-center border-b-2 pb-4 px-2">
          {/* COVER */}
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
              objectFit: "fill",
            }}
            className="rounded-lg aspect-[4/6] bg-gray-200"
            width={75.0}
          />

          {/* QUEST TITLE */}
          <div className="flex-1">
            <legend className="text-2xl font-bold mb-1 truncate">
              {book.title}
            </legend>
            <p className="text-sm text-black/70">
              <span>{book.author}</span>
              <span className="mx-1">|</span>
              <span>{book.chapter_count} Books</span>
              <span className="mx-1">|</span>
              <span>{book.bookmark_count} Saves</span>
            </p>
          </div>

          {/* UPLOAD QUEST BTN */}
          <button
            type="button"
            onClick={() => {
              showDialog(<BookChapterForm bookId={book.id} />);
            }}
            className="rounded-lg bg-gray-200 text-sm"
          >
            New Book
          </button>
        </div>

        {/* CHAPTERS */}
        <ul className="p-4 w-full grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {chapters.map((chapter, index) => (
            <li className="bg-gray-100 rounded-xl" key={chapter.id}>
              <div className="w-full py-2 px-4 flex items-center">
                <div className="flex-1">
                  <span className="text-[var(--primary)] text-sm">
                    Book {index + 1}
                  </span>
                  <p className="text-lg font-bold">{chapter.title}</p>
                </div>
                <button
                  type="button"
                  className="bg-red-200 text-red-700 text-sm"
                  onClick={() =>
                    showDialog(
                      <>
                        <div className="w-full max-w-xl mx-auto space-y-2">
                          <legend className="text-xl font-bold">{`Delete Book #${chapter.id}`}</legend>
                          <p className="text-md p-2">
                            {`Are you sure you want to delete "${chapter.title}"?`}
                            <br />
                            {`This action cannot be undone.`}
                          </p>
                          <div className="w-full text-end mt-4">
                            <button
                              type="button"
                              onClick={() => deleteChapter(chapter.id)}
                              className="bg-red-700 hover:bg-red-800 text-white text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function BookChapterForm({ bookId }: { bookId: string | number }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { hideDialog } = useDialog();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    //   SAVE QUESTION INSTANCE
    setIsSaving(true);
    const response = await http.multipartPost(
      UPLOAD_BOOK_CHAPTER_URL(bookId),
      formData
    );
    if (response.success) {
      router.refresh();
      showToast(response.message, "success");
      hideDialog();
    } else {
      showToast(response.message, "error");
    }
    setIsSaving(false);
  }

  return (
    <>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="p-0 sm:px-6 sm:py-3 flex flex-col md:flex-row"
      >
        <div className="w-full max-w-xl p-6 mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {`Upload Book/Chapter`}
          </h2>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <small className="text-xs text-black/40"></small>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2 my-4">
            <input type="file" name="chapter" id="chapter" accept=".epub" />
          </div>

          {/* SAVE QUESTION INSTANCE BUTTON */}
          <div className="w-full col-span-2 text-center mt-6">
            <button
              type="submit"
              className="text-white disabled:bg-gray-200 disabled:text-gray-700"
              disabled={isSaving}
            >
              Save Instance
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
