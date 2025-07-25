import { useDialog } from "@/context/DialogContext";
import { Question } from "@/models/QuestModels";
import QuestionForm from "./QuestionForm";

export default function QuestionCard({
  question,
  questId,
}: {
  question: Question;
  questId: string | number;
}) {
  const { showDialog } = useDialog();
  return (
    <>
      <div className="w-full rounded-xl border p-4 relative">
        <small className="text-xs text-black/60 px-2 py-1 bg-black/10 rounded-full">
          #{question.questionid}
        </small>
        <div className="text-sm text-black/60 mt-4 mb-1">
          {question.question}
        </div>
        <div className="text-lg text-black">{question.answer}</div>

        {/* Actions */}
        <div className="w-fit flex gap-2 absolute top-0 right-0 p-3">
          <button
            type="button"
            onClick={() => {
              showDialog(
                <QuestionForm question={question} questId={questId} />
              );
            }}
            className="text-sm bg-[var(--transparentPrimary)] text-[var(--primary)] px-3 py-1"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
