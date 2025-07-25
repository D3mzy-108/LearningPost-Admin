"use client";
import BookeeDisplay from "@/components/ContentAndServices/Bookee/BookeeDisplay";
import QuestsDisplay from "@/components/ContentAndServices/Quests/QuestsDisplay";
import Tabs, { Tab } from "@/components/NavBars/Tabs";
import { useParams, useSearchParams } from "next/navigation";

export default function PartnerMaterials() {
  const { partnerCode } = useParams();
  const tabs: Tab[] = [
    {
      id: "modules",
      label: "Modules",
      href: "?id=modules",
    },
    {
      id: "learning-resources",
      label: "Learning Resources",
      href: "?id=learning-resources",
    },
    {
      id: "cbt",
      label: "CBT",
      href: "?id=cbt",
    },
  ];
  const searchParams = useSearchParams();

  function displayContent() {
    const activeTabId = searchParams.get("id") || tabs[0]?.id;
    if (activeTabId === "modules") {
      return <QuestsDisplay partnerCode={partnerCode.toString()} />;
    } else if (activeTabId === "learning-resources") {
      return <BookeeDisplay partnerCode={partnerCode.toString()} />;
    } else if (activeTabId === "cbt") {
      return <></>;
    }
  }

  return (
    <>
      <Tabs tabs={tabs} />
      {displayContent()}
    </>
  );
}
