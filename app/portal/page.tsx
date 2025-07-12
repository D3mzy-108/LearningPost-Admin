import Tabs, { Tab } from "@/components/NavBars/Tabs";

export default function Dashboard() {
  const tabs: Tab[] = [
    {
      id: "kpi",
      label: "KPIs",
      href: "/portal?id=kpi",
    },
    {
      id: "users",
      label: "Users",
      href: "/portal?id=users",
    },
  ];
  return (
    <>
      <Tabs tabs={tabs} />
      <p>Dashboard Screen</p>
    </>
  );
}
