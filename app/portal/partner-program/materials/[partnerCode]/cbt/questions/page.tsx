"use client";
import QuestionCard from "@/components/ContentAndServices/Quests/QuestionCard";
import QuestionForm from "@/components/ContentAndServices/Quests/QuestionForm";
import Pagination from "@/components/NavBars/Pagination";
import { useDialog } from "@/context/DialogContext";
import { useToast } from "@/context/ToastContext";
import { Test } from "@/models/PartnerModels";
import { Question } from "@/models/QuestModels";
import http from "@/utils/http";
import { DOMAIN, FETCH_TEST_QUESTIONS_URL } from "@/utils/urls";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [page, setPage] = useState<string>("0 of 0");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchQuestions() {
      const testID = searchParams.get("testID");
      if (testID === null) {
        showToast("Quest not Found", "warning");
        router.back();
        return;
      }
      const response = await http.get(
        FETCH_TEST_QUESTIONS_URL(testID, search, pageNumber)
      );
      if (!response.success) {
        showToast(response.message, "error");
      } else {
        setQuestions(response.data.questions);
        setTest(response.data.test);
        setPage(response.data.page);
        setQuestionCount(response.data.question_count);
        setMaxPageNumber(response.data.num_pages);
      }
    }

    fetchQuestions();
  }, [pageNumber, router, search, searchParams, showToast]);

  if (test === null) {
    return <div className="grid place-items-center">Loading...</div>;
  }

  return (
    <>
      <div className="w-full space-y-8 py-4 md:px-2">
        <div className="w-full flex gap-4 items-center border-b-2 pb-4 px-2">
          {/* COVER */}
          <Image
            src={`${
              test.cover.includes("https://") || test.cover.includes("http://")
                ? test.cover
                : DOMAIN + test.cover
            }`}
            alt={test.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/50x50/EEE/333333?text=";
            }} // Fallback image
            style={{
              objectFit: "cover",
            }}
            className="rounded-lg"
            width={70.0}
            height={70.0}
          />

          {/* QUEST TITLE */}
          <div className="flex-1">
            <legend className="text-2xl font-bold mb-1 truncate">
              {test.title}
            </legend>
            <p className="text-sm text-black/70">
              <span>{test.attempts} Attempts</span>
              <span className="mx-1">|</span>
              <span>{test.status}</span>
              <span className="mx-1">|</span>
              <span>{questionCount} Questions</span>
            </p>
          </div>

          {/* UPLOAD QUEST BTN */}
          <button
            type="button"
            onClick={() => {
              showDialog(
                <QuestionForm
                  question={null}
                  questId={test.id}
                  isCBTQuestion={true}
                />
              );
            }}
            className="rounded-lg bg-gray-200 text-sm"
          >
            Upload Questions
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            setSearch(formData.get("s")?.toString() || "");
            setPageNumber(1);
          }}
          method="get"
          className="flex w-full justify-end px-2"
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
            className="w-full max-w-sm px-3 py-2 border-b-2 border-b-black/60 placeholder:text-black/80"
            placeholder="Search Questions..."
          />
        </form>

        {/* RENDER QUESTIONS LIST */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.questionid}
              question={question}
              questId={test.id}
              isCBTQuestion={true}
            />
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center pb-12">
            <p>No Questions Found</p>
          </div>
        )}

        {/* PAGINATION */}
        <Pagination
          initialPageNumber={pageNumber}
          maxPageNumber={maxPageNumber}
          onPageChange={(pageNum) => setPageNumber(pageNum)}
          page={page}
        />
      </div>
    </>
  );
}
