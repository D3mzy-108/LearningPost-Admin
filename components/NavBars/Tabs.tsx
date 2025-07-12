"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type Tab = {
  id: string;
  label: string;
  href: string;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const searchParams = useSearchParams();
  const activeTabId = searchParams.get("id") || tabs[0]?.id;

  return (
    <div className="flex border-b border-black/60">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <Link
            href={tab.href}
            key={tab.id}
            className={`py-2 px-6 text-sm font-medium text-center border-b-2 duration-500 ${
              isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-700 hover:border-black"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
