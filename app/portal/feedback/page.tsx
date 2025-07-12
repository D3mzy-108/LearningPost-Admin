import Tabs, { Tab } from "@/components/NavBars/Tabs";

export default function Feedback() {
  const tabs: Tab[] = [
    {
      id: "help_desk",
      label: "Feedback & Queries",
      href: "/portal?id=help-desk",
    },
    {
      id: "question_report",
      label: "Reported Questions",
      href: "/portal?id=reported-questions",
    },
    {
      id: "unsatisfied_user",
      label: "Unsatisfied User Feedback",
      href: "/portal?id=unsatisfied-user-feedback",
    },
  ];
  return (
    <>
      <Tabs tabs={tabs} />
      <p>Feedback Screen</p>
    </>
  );
}
