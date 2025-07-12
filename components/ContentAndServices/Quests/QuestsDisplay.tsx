/* eslint-disable @next/next/no-img-element */
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { DOMAIN, GET_QUESTS_URL } from "@/utils/urls";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function QuestsDisplay() {
  const { showToast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [page, setPage] = useState<string>("0 of 0");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);

  const loadQuests = useCallback(
    async (search_string: string) => {
      const response = await http.get(
        GET_QUESTS_URL(search_string, pageNumber)
      );
      if (response.success) {
        setQuests(response.data.quests);
        setPage(response.data.page);
        setMaxPageNumber(response.data.num_pages);
      } else {
        showToast(response.message, "error");
      }
    },
    [showToast, pageNumber]
  );

  function searchForQuest(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loadQuests(formData.get("s")?.toString() || "");
  }

  useEffect(() => {
    loadQuests("");
  }, [loadQuests]);
  return (
    <>
      <div className="w-full px-2 py-5">
        <form
          onSubmit={searchForQuest}
          method="get"
          className="flex w-full justify-end"
        >
          <label
            htmlFor="search_quests"
            className="w-fit px-2 border-b-2 border-b-black/60 grid place-items-center"
          >
            <span>&#128269;</span>
          </label>
          <input
            type="search"
            name="s"
            id="search_quests"
            className="w-full max-w-[150px] px-3 py-2 border-b-2 border-b-black/60 placeholder:text-black/80"
            placeholder="Search Quests..."
          />
          <Link
            href={""}
            className="pl-3 pr-4 py-1 rounded-t-md rounded-b-none border-2 border-b-0 border-black/60 text-black bg-transparent flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">New Quest</span>
          </Link>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </form>

        {/* QUEST GRID */}
        <div className="w-full my-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
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

interface Quest {
  id: string | number;
  cover: string;
  title: string;
  grade: string;
  category: string;
  time: number | string;
  bookmark_count: number;
  question_count: number;
  rating: number;
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="w-full p-2">
      <img
        src={`${
          quest.cover.includes("https://") || quest.cover.includes("http://")
            ? quest.cover
            : DOMAIN + quest.cover
        }`}
        alt={quest.title}
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
          {/* QUEST DETAILS */}
          <div className="flex-1 flex flex-col">
            <legend className="font-semibold text-lg">{quest.title}</legend>
            <span className="text-black/60 text-sm">
              {quest.question_count} Questions - {quest.bookmark_count} Saves
            </span>
            <div className="w-full flex gap-2 flex-wrap mt-2">
              <div className="w-fit px-2 py-1 text-xs rounded-md bg-blue-600/10 text-blue-600">
                <span>{quest.category}</span>
              </div>
              <div className="w-fit px-2 py-1 text-xs rounded-md bg-blue-600/10 text-blue-600">
                <span>{quest.grade}</span>
              </div>
              <div className="w-fit px-2 py-1 text-xs rounded-md bg-blue-600/10 text-blue-600">
                <span>{quest.time} Secs</span>
              </div>
            </div>
          </div>

          {/* QUEST RATING */}
          <span className="text-orange-500">{quest.rating}&#x2605;</span>
        </div>

        {/* QUEST ACTIONS */}
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
            <span>Questions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
