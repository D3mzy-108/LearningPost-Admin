import { DOMAIN } from "@/utils/urls";
import Link from "next/link";
import QuestForm from "./QuestForm";
import { useDialog } from "@/context/DialogContext";
import { Quest } from "@/models/QuestModels";

/* eslint-disable @next/next/no-img-element */
export default function QuestCard({ quest }: { quest: Quest }) {
  const { showDialog } = useDialog();

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
          filter: "brightness(90%)",
        }}
        className="w-full aspect-[5/4] rounded-xl shadow-lg mb-1"
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
          <button
            type="button"
            onClick={() => {
              showDialog(
                <>
                  <QuestForm
                    instance={quest}
                    isMutableOrganizationInstance={false}
                    organizationCode={quest.organization}
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
            href={`/portal/content-and-services/quest/?q=${quest.title}&qid=${quest.id}`}
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
