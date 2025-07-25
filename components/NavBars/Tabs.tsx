"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export type Tab = {
  id: string;
  label: string;
  href: string | (() => void);
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const searchParams = useSearchParams();
  const activeTabId = searchParams.get("id") || tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex border-b border-black/60">
      {tabs.map((tab, index) => {
        if (typeof tab.href === "string") {
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
        } else {
          const isActive = activeTab === index;
          return (
            <button
              type="button"
              onClick={() => {
                setActiveTab(index);
                if (typeof tab.href === "function") tab.href();
              }}
              key={tab.id}
              className={`py-2 px-6 text-sm font-medium text-center bg-transparent rounded-none border-b-2 duration-500 ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-700 hover:border-black"
              }`}
            >
              {tab.label}
            </button>
          );
        }
      })}
    </div>
  );
}
