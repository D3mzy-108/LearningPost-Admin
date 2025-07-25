"use client";
import BookeeDisplay from "@/components/ContentAndServices/Bookee/BookeeDisplay";
import QuestsDisplay from "@/components/ContentAndServices/Quests/QuestsDisplay";
import SubscriptionPlansDisplay from "@/components/ContentAndServices/SubscriptionPlans/SubscriptionPlansDisplay";
import Tabs, { Tab } from "@/components/NavBars/Tabs";
import { useSearchParams } from "next/navigation";

export default function ContentAndServices() {
  const tabs: Tab[] = [
    {
      id: "quests",
      label: "Quests",
      href: "/portal/content-and-services?id=quests",
    },
    {
      id: "bookee",
      label: "Bookee",
      href: "/portal/content-and-services?id=bookee",
    },
    {
      id: "subscriptions",
      label: "Subscription Plans",
      href: "/portal/content-and-services?id=subscriptions",
    },
  ];
  const searchParams = useSearchParams();

  function displayContent() {
    const activeTabId = searchParams.get("id") || tabs[0]?.id;
    if (activeTabId === "quests") {
      return <QuestsDisplay partnerCode="" />;
    } else if (activeTabId === "bookee") {
      return <BookeeDisplay partnerCode="" />;
    } else if (activeTabId === "subscriptions") {
      return <SubscriptionPlansDisplay />;
    }
  }

  return (
    <>
      <Tabs tabs={tabs} />
      {displayContent()}
    </>
  );
}
