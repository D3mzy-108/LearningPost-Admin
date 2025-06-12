"use client";
import SideNav from "@/components/NavBars/SideNav";
import { __isLastLoginToday } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    function autoLogout() {
      const loginSessionActive = __isLastLoginToday();
      if (loginSessionActive !== true) {
        router.push("/");
        localStorage.removeItem("user");
      }
    }

    autoLogout();
  }, []);
  return (
    <div className="w-full min-h-screen flex pt-4 pl-4 gap-4 relative">
      <div className="w-1/5 h-screen overflow-auto sticky top-4">
        <SideNav />
      </div>
      <div className="w-4/5 min-h-screen rounded-t-2xl bg-white p-4">
        {children}
      </div>
    </div>
  );
}
