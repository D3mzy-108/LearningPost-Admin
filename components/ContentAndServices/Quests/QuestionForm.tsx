import Tabs, { Tab } from "@/components/NavBars/Tabs";
import { useDialog } from "@/context/DialogContext";
import { useToast } from "@/context/ToastContext";
import { Question } from "@/models/QuestModels";
import http from "@/utils/http";
import {
  DOMAIN,
  SAVE_QUESTION_INSTANCE_URL,
  UPLOAD_QUESTIONS_FILE_URL,
} from "@/utils/urls";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function QuestionForm({
  question,
  questId,
}: {
  question: Question | null;
  questId: string | number;
}) {
  const [keyEntryMode, setKeyEntryMode] = useState(false);
  const uploadFormTypes: Tab[] = [
    {
      id: "upload-bulk",
      label: "Upload Bulk",
      href: () => setKeyEntryMode(false),
    },
    {
      id: "key-entry",
      label: "Manual Entry",
      href: () => setKeyEntryMode(true),
    },
  ];

  return (
    <div className="p-0 sm:px-6 sm:py-3 flex flex-col md:flex-row">
      <div className="w-full md:w-1/5 max-md:border-b-2 md:border-r-2"></div>
      <div className="w-full md:w-4/5">
        {question === null ? (
          <>
            <div className="w-full max-md:py-4 px-4">
              <Tabs tabs={uploadFormTypes} />
              <div className="mt-5">
                {keyEntryMode ? (
                  <KeyEntryForm question={question} questId={questId} />
                ) : (
                  <BulkUploadForm questId={questId} />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {`Edit Question #${question.questionid}`}
              </h2>
              <KeyEntryForm question={question} questId={questId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===================================================================================
// FORM TO UPLOAD QUESTIONS IN BULK
// ===================================================================================
function BulkUploadForm({ questId }: { questId: string | number }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { hideDialog } = useDialog();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await http.multipartPost(
      UPLOAD_QUESTIONS_FILE_URL(questId),
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
    <form method="post" onSubmit={handleSubmit}>
      <style>
        {`
            li{
                list-style: disc;
            }
        `}
      </style>
      <div className="w-full space-y-6">
        <legend className="text-lg font-bold text-gray-800">
          Instructions for Populating the CSV File
        </legend>

        {/* TSV FILE FORMAT */}
        <div className="px-2">
          <div className="w-full overflow-auto rounded-xl bg-gray-100 p-2 pb-0">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Comprehension</th>
                  <th>Question</th>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>D</th>
                  <th>Answer</th>
                  <th>Explanation</th>
                  <th>Topic</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* INSTRUCTION DETAILS */}
        <div className="w-full text-black/60">
          <p>
            {`This guide explains how to structure your CSV file for questions and
            answers. Each row in your CSV will represent a single question, and
            each column serves a specific purpose.`}
          </p>

          <legend className="font-bold mt-4">Column Breakdown</legend>
          <ul className="pl-4 flex flex-col gap-2 mt-2">
            <li>
              Column 1: Comprehension (Optional) <br />
              {`Include any reading passage or short narrative necessary to answer
              the question. If no comprehension is needed, leave this column
              blank.`}
            </li>
            <li>
              Column 2: Question <br />
              This column must contain the question itself.
            </li>
            <li>
              Columns 3, 4, 5, & 6: Answer Options <br />
              Provide four distinct answer choices for the question.
            </li>
            <li>
              Column 7: Correct Answer <br />
              {`This column must contain the exact correct answer. It needs to
              match one of your options from columns 3-6 precisely. The system
              will ignore differences only in capitalization (e.g., "Answer"
              will match "answer"). If there are any other discrepancies, the
              system will mark all answers as incorrect.`}
              <br />
              {`Tip for Content Creation: To simplify things, you can place the
              correct answer in Column 6 first, and then duplicate it into
              Column 7. The system shuffles all answer options when presenting
              the question, so the position in Column 6 won't affect the test
              output.`}
            </li>
            <li>
              Column 8: Explanation <br />
              Provide a clear explanation for why the chosen answer is correct.
            </li>
            <li>
              Column 9: Topic <br />
              Specify the topic or category the question belongs to.
            </li>
          </ul>

          <legend className="font-bold mt-4">CSV File Structure</legend>
          <ul className="pl-4 flex flex-col gap-2 mt-2">
            <li>
              {`First Row (Header Row): The very first row of your CSV file must
            contain the column headers (e.g., "Comprehension", "Question",
            "Option1", etc.). These headers are used to correctly map and
            interpret the data in your file.`}
            </li>
            <li>
              {`Unique Headers: Each column header in the first row must be unique.
            Do not repeat any header names.`}
            </li>
          </ul>
        </div>

        {/* FILE INPUT FIELS */}
        <div className="w-full flex flex-wrap items-center gap-4 mt-4">
          <input
            type="file"
            name="questions"
            id="questions"
            accept=".tsv"
            required
          />

          <button
            type="submit"
            className="text-white disabled:bg-gray-200 disabled:text-gray-700"
            disabled={isSaving}
          >
            Upload Questions
          </button>
        </div>
      </div>
    </form>
  );
}

// ===================================================================================
// FORM TO SAVE SINGLE QUESTION INSTANCES
// ===================================================================================
function KeyEntryForm({
  question,
  questId,
}: {
  question: Question | null;
  questId: string | number;
}) {
  const textAreaFields = [
    {
      label: "Comprehension",
      sub: "",
      name: "comprehension",
      value: `${question?.comprehension ?? ""}`,
      required: false,
    },
    {
      label: "Question",
      sub: "",
      name: "question",
      value: `${question?.question ?? ""}`,
      required: true,
    },
    {
      label: "Option A",
      sub: "",
      name: "a",
      value: `${question?.a ?? ""}`,
      required: true,
    },
    {
      label: "Option B",
      sub: "",
      name: "b",
      value: `${question?.b ?? ""}`,
      required: true,
    },
    {
      label: "Option C",
      sub: "",
      name: "c",
      value: `${question?.c ?? ""}`,
      required: true,
    },
    {
      label: "Option D",
      sub: "",
      name: "d",
      value: `${question?.d ?? ""}`,
      required: true,
    },
    {
      label: "Explanation",
      sub: "",
      name: "explanation",
      value: `${question?.explanation ?? ""}`,
      required: true,
    },
  ];

  const answerOptions = [
    {
      label: "Option A",
      value: "--a--",
      initialValue: question?.a ?? "",
    },
    {
      label: "Option B",
      value: "--b--",
      initialValue: question?.b ?? "",
    },
    {
      label: "Option C",
      value: "--c--",
      initialValue: question?.c ?? "",
    },
    {
      label: "Option D",
      value: "--d--",
      initialValue: question?.d ?? "",
    },
  ];
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { hideDialog } = useDialog();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    //   SET CORRECT ANSWER
    const defaultOptions = ["--a--", "--b--", "--c--", "--d--"];
    const newOptionValues = [
      formData.get("a")?.toString(),
      formData.get("b")?.toString(),
      formData.get("c")?.toString(),
      formData.get("d")?.toString(),
    ];
    const correctAnswerIndex = defaultOptions.indexOf(
      formData.get("answer")!.toString()
    );
    formData.set("answer", newOptionValues[correctAnswerIndex] ?? "");

    //   SAVE QUESTION INSTANCE
    setIsSaving(true);
    const response = await http.multipartPost(
      SAVE_QUESTION_INSTANCE_URL(questId),
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-1 md:col-span-2">
          <label
            htmlFor="diagram"
            className="block text-sm font-medium text-gray-700"
          >
            Diagram:
          </label>
          <Link
            href={
              question?.diagram === null
                ? ""
                : question?.diagram!.includes("https://") ||
                  question?.diagram!.includes("http://")
                ? question?.diagram
                : DOMAIN + question?.diagram
            }
            target="_blank"
            className="text-xs text-black/40"
          >
            {question?.diagram ?? ""}
          </Link>
          <input type="file" name="diagram" id="diagram" accept="image/*" />
        </div>

        {textAreaFields.map((field) => (
          <div className="flex flex-col gap-1" key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}:
            </label>
            <textarea
              name={field.name}
              id={field.name}
              rows={3}
              required={field.required}
              defaultValue={field.value}
              className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        ))}

        {/* CORRECT ANSWER */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Answer:
          </label>
          <small className="text-xs text-black/40"></small>
          <div className="w-full flex flex-wrap gap-4">
            {answerOptions.map((option, index) => (
              <div className="w-fit flex gap-1 items-center" key={index}>
                <input
                  type="radio"
                  name="answer"
                  id={`option${index}`}
                  required
                  value={option.value}
                  defaultChecked={question?.answer === option.initialValue}
                />
                <label htmlFor={`option${index}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Topic:
          </label>
          <small className="text-xs text-black/40"></small>
          <input
            type="text"
            name="topic"
            id="topic"
            defaultValue={question?.topic ?? ""}
            required
            className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* QUESTION ID FIELD */}
        {question !== null && (
          <input type="hidden" name="questionId" value={question?.questionid} />
        )}

        {/* SAVE QUESTION INSTANCE BUTTON */}
        <div className="w-full col-span-2 text-center mt-4">
          <button
            type="submit"
            className="text-white disabled:bg-gray-200 disabled:text-gray-700"
            disabled={isSaving}
          >
            Save Instance
          </button>
        </div>
      </form>
    </>
  );
}
