/* eslint-disable @next/next/no-img-element */
import Pagination from "@/components/NavBars/Pagination";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { GET_QUESTS_URL } from "@/utils/urls";
import { FormEvent, useCallback, useEffect, useState } from "react";
import QuestCard from "./QuestCard";
import QuestForm from "./QuestForm";
import { useDialog } from "@/context/DialogContext";
import { Quest } from "@/models/QuestModels";

export default function QuestsDisplay({
  partnerCode,
}: {
  partnerCode: string;
}) {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [page, setPage] = useState<string>("0 of 0");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);
  const [searchVal, setSearchVal] = useState<string>("");

  const loadQuests = useCallback(
    async (search_string: string, pageNumber: number) => {
      setSearchVal(search_string);
      const response = await http.get(
        GET_QUESTS_URL(search_string, pageNumber, partnerCode)
      );
      if (response.success) {
        setQuests(response.data.quests);
        setPage(response.data.page);
        setMaxPageNumber(response.data.num_pages);
      } else {
        showToast(response.message, "error");
      }
    },
    [partnerCode, showToast]
  );

  function searchForQuest(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loadQuests(formData.get("s")?.toString() || "", 1);
    setPageNumber(1);
  }

  useEffect(() => {
    loadQuests("", 1);
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
          <button
            type="button"
            onClick={() => {
              showDialog(
                <>
                  <QuestForm
                    instance={null}
                    isMutableOrganizationInstance={false}
                    organizationCode={partnerCode}
                  />
                </>
              );
            }}
            className="pl-3 pr-4 py-1 rounded-t-md rounded-b-none border-2 border-b-0 border-black/60 text-black bg-transparent flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">New Quest</span>
          </button>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </form>

        {/* QUEST GRID */}
        <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        <Pagination
          page={page}
          initialPageNumber={pageNumber}
          maxPageNumber={maxPageNumber}
          onPageChange={(pageNum) => {
            loadQuests(searchVal, pageNum);
          }}
        />
      </div>
    </>
  );
}
