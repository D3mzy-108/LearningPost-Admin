import { Quest } from "./QuestCard";

export default function QuestForm({ instance }: { instance: Quest | null }) {
  return (
    <>
      <p>This is a form to add or edit a quest</p>
      <span>Instance:: {instance?.title ?? ""}</span>
    </>
  );
}
