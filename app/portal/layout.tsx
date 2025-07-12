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
  }, [router]);
  return (
    <div className="w-full min-height-screen flex pt-4 pl-4 max-sm:pl-2 gap-4  max-sm:gap-2 relative">
      <div className="w-[16rem] min-w-[2rem] max-sm:w-[2rem] height-screen overflow-auto sticky top-4">
        <SideNav />
      </div>
      <div className="flex-1 min-height-screen rounded-t-2xl bg-white p-4">
        {children}
      </div>
    </div>
  );
}
